/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { detectBarcodes } from '../src/detectors/barcode.js';
import { ActionButton } from '../src/elements/action-button/action-button.js';
import { Card } from '../src/elements/card/card.js';
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
import { OnboardingCard } from '../src/elements/onboarding-card/onboarding-card.js';
import { hideOverlay, showOverlay } from '../src/elements/overlay/overlay.js';
import { StreamCapture } from '../src/elements/stream-capture/stream-capture.js';
import { supportsEnvironmentCamera } from '../src/utils/environment-camera.js';
import { fire } from '../src/utils/fire.js';
import { DEBUG_LEVEL, log } from '../src/utils/logger.js';
import { vibrate } from '../src/utils/vibrate.js';
export { vibrate } from '../src/utils/vibrate.js';
export { Card } from '../src/elements/card/card.js';
export { ActionButton } from '../src/elements/action-button/action-button.js';
import { ArtifactDealer } from '../src/artifacts/artifact-dealer.js';
import { ArtifactLoader } from '../src/artifacts/artifact-loader.js';
import { LocalArtifactStore } from '../src/artifacts/stores/local-artifact-store.js';
const artloader = new ArtifactLoader();
const artstore = new LocalArtifactStore();
const artdealer = new ArtifactDealer();
artdealer.addArtifactStore(artstore);
const detectedBarcodes = new Set();
const barcodeDetect = 'barcodedetect';
const cameraAccessDenied = 'cameraaccessdenied';
const markerChanges = 'markerchanges';
// Register custom elements.
customElements.define(StreamCapture.defaultTagName, StreamCapture);
customElements.define(Card.defaultTagName, Card);
customElements.define(ActionButton.defaultTagName, ActionButton);
// Register events.
window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);
window.addEventListener('offline', onConnectivityChanged);
window.addEventListener('online', onConnectivityChanged);
// While the onboarding begins, attempt a fake detection. If the polyfill is
// necessary, or the detection fails, we should find out.
const polyfillPrefix = window.PerceptionToolkit.config.root || '';
const attemptDetection = detectBarcodes(new ImageData(1, 1), { polyfillPrefix });
/**
 * Starts the user onboarding.
 */
export async function initialize(opts) {
    const onboarding = document.querySelector(OnboardingCard.defaultTagName);
    if (!onboarding) {
        beginDetection(opts);
        return;
    }
    // When onboarding is finished, start the stream and remove the loader.
    onboarding.addEventListener(OnboardingCard.onboardingFinishedEvent, () => {
        onboarding.remove();
        beginDetection(opts);
    });
}
/**
 * Initializes the main behavior.
 */
async function beginDetection({ detectionMode = 'passive', sitemapUrl }) {
    try {
        // Wait for the faked detection to resolve.
        await attemptDetection;
        // Start loading some artifacts.
        await loadInitialArtifacts(sitemapUrl);
        // Create the stream.
        await createStreamCapture(detectionMode);
    }
    catch (e) {
        log(e.message, DEBUG_LEVEL.ERROR, 'Barcode detection');
    }
}
/**
 * Load artifact content for initial set.
 */
async function loadInitialArtifacts(sitemapUrl) {
    const srcs = [
        artloader.fromDocument(document, document.URL),
    ];
    if (sitemapUrl) {
        srcs.push(artloader.fromJsonUrl(new URL(sitemapUrl, document.URL)));
    }
    const artifactGroups = await Promise.all(srcs);
    for (const artifacts of artifactGroups) {
        for (const artifact of artifacts) {
            artstore.addArtifact(artifact);
        }
    }
}
/**
 * Load artifact content from url on same originn, usually discovered from environment.
 */
async function loadArtifactsFromSameOriginUrl(url) {
    // Test that this URL is not from another origin
    if (url.hostname !== window.location.hostname ||
        url.port !== window.location.port ||
        url.protocol !== window.location.protocol) {
        return;
    }
    const artifacts = await artloader.fromHtmlUrl(url);
    for (const artifact of artifacts) {
        artstore.addArtifact(artifact);
    }
}
/**
 * Whenever we find nearby content, show it
 */
async function updateContentDisplay(contentDiff) {
    if (!window.PerceptionToolkit.config.cardContainer) {
        return;
    }
    const container = window.PerceptionToolkit.config.cardContainer;
    // Prevent multiple cards from showing.
    if (container.hasChildNodes()) {
        return;
    }
    for (const { target, content, artifact } of contentDiff.found) {
        // Create a card for every found barcode.
        const card = new Card();
        card.src = content;
        container.appendChild(card);
    }
}
/*
 * Handle Marker discovery
 */
async function onMarkerFound(evt) {
    const { detail } = evt;
    const marker = { type: 'qrcode', value: detail };
    vibrate(200);
    // If this marker is a URL, try loading artifacts from that URL
    try {
        // Attempt to convert markerValue to URL.  This will throw if markerValue isn't a valid URL.
        // Do not supply a base url argument, since we do not want to support relative URLs,
        // and because that would turn lots of normal string values into valid relative URLs.
        const url = new URL(marker.value);
        await loadArtifactsFromSameOriginUrl(url);
    }
    catch (_) {
        // Do nothing if this isn't a valid URL
    }
    // Update the UI
    const contentDiffs = await artdealer.markerFound(marker);
    updateContentDisplay(contentDiffs);
    fire(markerChanges, capture, contentDiffs);
}
let hintTimeout;
const capture = new StreamCapture();
/**
 * Creates the stream an initializes capture.
 */
async function createStreamCapture(detectionMode) {
    if (detectionMode === 'passive') {
        capture.captureRate = 600;
    }
    else {
        showOverlay('Tap to capture');
        capture.addEventListener('click', async () => {
            capture.paused = true;
            showOverlay('Processing...');
            const imgData = await capture.captureFrame();
            fire(StreamCapture.frameEvent, capture, { imgData, detectionMode });
        });
    }
    capture.captureScale = 0.8;
    capture.addEventListener(StreamCapture.closeEvent, close);
    capture.addEventListener(barcodeDetect, onMarkerFound);
    const streamOpts = {
        video: {
            facingMode: 'environment'
        }
    };
    // Attempt to get access to the user's camera.
    try {
        let stream = await navigator.mediaDevices.getUserMedia(streamOpts);
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasEnvCamera = await supportsEnvironmentCamera(devices);
        capture.flipped = !hasEnvCamera;
        // Ensure the stream is stopped and started when the user changes tabs.
        let isRequestingNewStream = false;
        window.addEventListener('visibilitychange', async () => {
            if (isRequestingNewStream) {
                return;
            }
            if (document.hidden) {
                capture.stop();
            }
            else {
                // Block multiple requests for a new stream.
                isRequestingNewStream = true;
                stream = await navigator.mediaDevices.getUserMedia(streamOpts);
                isRequestingNewStream = false;
                // Bail if the document is hidden again.
                if (document.hidden) {
                    return;
                }
                // Ensure the capture is definitely stopped before starting a new one.
                capture.stop();
                capture.start(stream);
            }
        });
        capture.start(stream);
        document.body.appendChild(capture);
        hintTimeout = setTimeout(() => {
            showOverlay('Make sure the barcode is inside the box.');
        }, window.PerceptionToolkit.config.hintTimeout || 5000);
    }
    catch (e) {
        // User has denied or there are no cameras.
        fire(cameraAccessDenied, window);
    }
}
export function close() {
    capture.stop();
    capture.remove();
    hideOverlay();
    clearTimeout(hintTimeout);
}
let isProcessingCapture = false;
/**
 * Processes the image data captured by the StreamCapture class, and hands off
 * the image data to the barcode detector for processing.
 *
 * @param evt The Custom Event containing the captured frame data.
 */
async function onCaptureFrame(evt) {
    // Prevent overloading the capture process.
    if (isProcessingCapture) {
        return;
    }
    isProcessingCapture = true;
    const capture = evt.target;
    const { detail } = evt;
    const { detectionMode, imgData } = detail;
    const barcodes = await detectBarcodes(imgData, { polyfillPrefix });
    for (const barcode of barcodes) {
        if (detectedBarcodes.has(barcode.rawValue)) {
            continue;
        }
        // Prevent multiple markers for the same barcode.
        detectedBarcodes.add(barcode.rawValue);
        fire(barcodeDetect, capture, barcode.rawValue);
    }
    if (barcodes.length > 0) {
        // Hide the hint if it's shown. Cancel it if it's pending.
        clearTimeout(hintTimeout);
        hideOverlay();
    }
    else if (detectionMode && detectionMode === 'active') {
        showOverlay('No barcodes found');
    }
    capture.paused = false;
    // Provide a cool-off before allowing another detection. This aids the case
    // where a recently-scanned barcode is mistakenly re-scanned, but with errors.
    setTimeout(() => {
        detectedBarcodes.clear();
        isProcessingCapture = false;
    }, 1000);
    // Hide the loader if there is one.
    const loader = document.querySelector(DotLoader.defaultTagName);
    if (!loader) {
        return;
    }
    loader.remove();
}
/**
 * Handles connectivity change for the user.
 */
function onConnectivityChanged() {
    const connected = navigator.onLine;
    const capture = document.body.querySelector(StreamCapture.defaultTagName);
    if (!capture) {
        return;
    }
    if (!connected) {
        showOverlay('Currently offline. Please reconnect to the network.');
    }
    else {
        hideOverlay();
    }
}
//# sourceMappingURL=main.js.map