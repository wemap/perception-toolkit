/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { detectBarcodes as BarcodeDetect } from '../src/detectors/barcode.js';
import { Card } from '../src/elements/card/card.js';
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
import { NoSupportCard } from '../src/elements/no-support-card/no-support-card.js';
import { OnboardingCard } from '../src/elements/onboarding-card/onboarding-card.js';
import { StreamCapture } from '../src/elements/stream-capture/stream-capture.js';
import { DeviceSupport } from '../src/support/device-support.js';
import { GetUserMediaSupport } from '../src/support/get-user-media.js';
import { IntersectionObserverSupport } from '../src/support/intersection-observer.js';
import { supportsEnvironmentCamera } from '../src/utils/environment-camera.js';
import { injectScript } from '../src/utils/inject-script.js';
import { DEBUG_LEVEL, enableLogLevel } from '../src/utils/logger.js';
enableLogLevel(DEBUG_LEVEL.INFO);
const IO_POLYFILL_PATH = '/third_party/intersection-observer/intersection-observer-polyfill.js';
const detectedBarcodes = new Set();
let loader;
/**
 * Processes the outcome of the device support testing.
 *
 * @param evt The supports event from the DeviceSupport class.
 */
async function onSupports(evt) {
    const supportEvt = evt;
    if (!supportEvt.detail[GetUserMediaSupport.name]) {
        const noSupport = new NoSupportCard();
        document.body.appendChild(noSupport);
        return;
    }
    loader = new DotLoader();
    loader.style.setProperty('--color', '#FFF');
    document.body.appendChild(loader);
    if (!(supportEvt.detail[IntersectionObserverSupport.name])) {
        await injectScript(IO_POLYFILL_PATH);
        // Force the polyfill to check every 300ms.
        IntersectionObserver.prototype.POLL_INTERVAL = 300;
        console.log('Loaded polyfill: IntersectionObserver');
    }
    // Wait to confirm that IntersectionObservers are in place before registering
    // the Onboarding Card element.
    customElements.define(OnboardingCard.defaultTagName, OnboardingCard);
    // Go!
    startOnboardingProcess();
}
async function startOnboardingProcess() {
    const onboarding = new OnboardingCard();
    onboarding.mode = 'fade';
    const stepImages = await loadOnboardingImages();
    for (const stepImage of stepImages) {
        stepImage.width = stepImage.naturalWidth * 0.5;
        stepImage.height = stepImage.naturalHeight * 0.5;
        if (onboarding.width === 0 || onboarding.height === 0) {
            onboarding.width = stepImage.width;
            onboarding.height = stepImage.height;
        }
        onboarding.appendChild(stepImage);
    }
    document.body.appendChild(onboarding);
    onboarding.addEventListener(OnboardingCard.itemChangedEvent, async (e) => {
        const { detail } = e;
        const { item } = detail;
        // We've just informed the user that they will need to approve camera access
        // so attempt to get camera info.
        if (item === 1) {
            // TODO(paullewis): do the stream request?
        }
    });
    // When onboarding is finished, start the stream and remove the loader.
    onboarding.addEventListener(OnboardingCard.onboardingFinishedEvent, async () => {
        onboarding.remove();
        await createStreamCapture();
        // Hide the loader if necessary.
        if (!loader) {
            return;
        }
        loader.remove();
        loader = null;
    });
}
async function loadOnboardingImages() {
    const steps = [
        '../images/step1.jpg',
        '../images/step2.jpg',
        '../images/step3.jpg'
    ].map((img) => {
        return new Promise((resolve, reject) => {
            const imgElement = new Image();
            imgElement.src = img;
            imgElement.onerror = reject;
            imgElement.onload = () => resolve(imgElement);
        });
    });
    return await Promise.all(steps);
}
async function createStreamCapture() {
    const capture = new StreamCapture();
    capture.captureRate = 600;
    capture.style.width = '100%';
    capture.captureScale = 0.8;
    capture.addEventListener('click', async () => {
        try {
            await capture.requestFullscreen();
        }
        catch (e) {
            // Unable to go full screen.
            console.warn(e);
        }
    });
    const streamOpts = {
        video: {
            facingMode: 'environment'
        }
    };
    // Attempt to get access to the user's camera.
    try {
        const stream = await navigator.mediaDevices.getUserMedia(streamOpts);
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasEnvCamera = await supportsEnvironmentCamera(devices);
        capture.flipped = !hasEnvCamera;
        capture.start(stream);
        document.body.appendChild(capture);
    }
    catch (e) {
        // User has denied or there are no cameras.
        console.log(e);
    }
}
/**
 * Processes the image data captured by the StreamCapture class, and hands off
 * the image data to the barcode detector for processing.
 *
 * @param evt The Custom Event containing the captured frame data.
 */
async function onCaptureFrame(evt) {
    const { detail } = evt;
    const { imgData } = detail;
    const barcodes = await BarcodeDetect(imgData);
    for (const barcode of barcodes) {
        if (detectedBarcodes.has(barcode.rawValue)) {
            continue;
        }
        // Prevent multiple markers for the same barcode.
        detectedBarcodes.add(barcode.rawValue);
        // Create a card for every found barcode.
        const card = new Card();
        card.src = barcode.rawValue;
        const container = createContainerIfRequired();
        container.appendChild(card);
    }
}
function createContainerIfRequired() {
    let detectedBarcodesContainer = document.querySelector('#container');
    if (!detectedBarcodesContainer) {
        detectedBarcodesContainer = document.createElement('div');
        detectedBarcodesContainer.id = 'container';
        document.body.appendChild(detectedBarcodesContainer);
    }
    return detectedBarcodesContainer;
}
// Register custom elements.
customElements.define(StreamCapture.defaultTagName, StreamCapture);
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
customElements.define(Card.defaultTagName, Card);
customElements.define(DotLoader.defaultTagName, DotLoader);
// Register events.
window.addEventListener(DeviceSupport.supportsEvent, onSupports);
window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);
// Start the detection process.
const deviceSupport = new DeviceSupport();
deviceSupport.useEvents = true;
deviceSupport.addDetector(GetUserMediaSupport);
deviceSupport.addDetector(IntersectionObserverSupport);
deviceSupport.detect();
//# sourceMappingURL=barcode-detection.js.map