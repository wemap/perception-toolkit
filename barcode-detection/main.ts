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
import { Card, CardData } from '../src/elements/card/card.js';
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

import { Marker } from '../defs/marker.js';
import { NearbyResultDelta } from '../src/artifacts/artifact-dealer.js';
import { MeaningMaker } from './meaning-maker.js';

const detectedMarkers = new Map<string, number>();
const barcodeDetect = 'barcodedetect';
const cameraAccessDenied = 'cameraaccessdenied';
const markerChanges = 'markerchanges';

const meaningMaker = new MeaningMaker();

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

interface InitOpts {
  detectionMode: 'active' | 'passive';
  sitemapUrl?: string;
}

/**
 * Starts the user onboarding.
 */
export async function initialize(opts: InitOpts) {
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
async function beginDetection({ detectionMode = 'passive', sitemapUrl }: InitOpts) {
  try {
    // Wait for the faked detection to resolve.
    await attemptDetection;

    // Initialize MeaningMaker
    await meaningMaker.init();
    if (sitemapUrl) {
      await meaningMaker.loadArtifactsFromJsonldUrl(new URL(sitemapUrl, document.URL));
    }

    // Create the stream.
    await createStreamCapture(detectionMode);
  } catch (e) {
    log(e.message, DEBUG_LEVEL.ERROR, 'Barcode detection');
  }
}

/**
 * Whenever we find nearby content, show it
 */
async function updateContentDisplay(contentDiff: NearbyResultDelta) {
  if (!window.PerceptionToolkit.config.cardContainer) {
    return;
  }
  const container = window.PerceptionToolkit.config.cardContainer;

  // Prevent multiple cards from showing.
  if (container.hasChildNodes()) {
    return;
  }

  for (const { content } of contentDiff.found) {
    // Create a card for every found barcode.
    const card = new Card();
    card.src = content as CardData;
    container.appendChild(card);
  }
}

/*
 * Handle Marker discovery
 */
async function onMarkerFound(evt: Event) {
  const { detail } = evt as CustomEvent<string>;
  const marker: Marker = { type: 'qrcode', value: detail };

  // Update the UI
  const contentDiffs = await meaningMaker.markerFound(marker);
  const markerChangeEvt = fire(markerChanges, capture, contentDiffs);

  // If the developer prevents default on the marker changes event then don't
  // handle the UI updates; they're doing it themselves.
  if (markerChangeEvt.defaultPrevented) {
    return;
  }

  vibrate(200);
  updateContentDisplay(contentDiffs);
}

let hintTimeout: number;
const capture = new StreamCapture();
/**
 * Creates the stream an initializes capture.
 */
async function createStreamCapture(detectionMode: 'active' | 'passive') {
  if (detectionMode === 'passive') {
    capture.captureRate = 600;
  } else {
    showOverlay('Tap to capture');
    capture.addEventListener('click', async () => {
      capture.paused = true;
      showOverlay('Processing...');
      const imgData = await capture.captureFrame();
      fire(StreamCapture.frameEvent, capture, {imgData, detectionMode});
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
      if (isRequestingNewStream || capture.parentNode === null) {
        return;
      }

      if (document.hidden) {
        capture.stop();
      } else {
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
    }, window.PerceptionToolkit.config.hintTimeout || 5000) as unknown as number;
  } catch (e) {
    // User has denied or there are no cameras.
    fire(cameraAccessDenied, window);
  }
}

export function close() {
  capture.stop();
  capture.remove();
  hideOverlay();
  clearTimeout(hintTimeout);

  const onboarding = document.querySelector(OnboardingCard.defaultTagName);
  if (!onboarding) {
    return;
  }

  onboarding.remove();
}

let isProcessingCapture = false;
/**
 * Processes the image data captured by the StreamCapture class, and hands off
 * the image data to the barcode detector for processing.
 *
 * @param evt The Custom Event containing the captured frame data.
 */
async function onCaptureFrame(evt: Event) {
  // Prevent overloading the capture process.
  if (isProcessingCapture) {
    return;
  }
  isProcessingCapture = true;

  const capture = evt.target as StreamCapture;
  const { detail } = evt as CustomEvent<{imgData: ImageData, detectionMode?: string}>;
  const { detectionMode, imgData } = detail;
  const barcodes = await detectBarcodes(imgData, { polyfillPrefix });

  for (const barcode of barcodes) {
    const markerAlreadyDetected = detectedMarkers.has(barcode.rawValue);

    // Update the last time for this marker.
    detectedMarkers.set(barcode.rawValue, self.performance.now());
    if (markerAlreadyDetected) {
      continue;
    }

    // Only fire the event if the marker is freshly detected.
    fire(barcodeDetect, capture, barcode.rawValue);
  }

  if (barcodes.length > 0) {
    // Hide the hint if it's shown. Cancel it if it's pending.
    clearTimeout(hintTimeout);
    hideOverlay();
  } else if (detectionMode && detectionMode === 'active') {
    showOverlay('No barcodes found');
  }

  capture.paused = false;

  // Provide a cool-off before allowing another detection. This aids the case
  // where a recently-scanned barcode is mistakenly re-scanned, but with errors.
  setTimeout(async () => {
    const now = self.performance.now();
    const removals = [];
    for (const [value, timeLastSeen] of detectedMarkers.entries()) {
      if (now - timeLastSeen < 3000) {
        continue;
      }

      const marker: Marker = { type: 'qrcode', value };
      removals.push(meaningMaker.markerLost(marker));
      detectedMarkers.delete(value);
    }

    // Wait for all dealer removals to conclude.
    await Promise.all(removals);
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
  const capture =
      document.body.querySelector(StreamCapture.defaultTagName) as StreamCapture;

  if (!capture) {
    return;
  }

  if (!connected) {
    showOverlay('Currently offline. Please reconnect to the network.');
  } else {
    hideOverlay();
  }
}
