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
import { Card } from '../src/elements/card/card.js';
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
import { NoSupportCard } from '../src/elements/no-support-card/no-support-card.js';
import { OnboardingCard } from '../src/elements/onboarding-card/onboarding-card.js';
import { StreamCapture } from '../src/elements/stream-capture/stream-capture.js';
import { supportsEnvironmentCamera } from '../src/utils/environment-camera.js';
import { fire } from '../src/utils/fire.js';
import { DEBUG_LEVEL, log } from '../src/utils/logger.js';
import { vibrate } from '../src/utils/vibrate.js';

const detectedBarcodes = new Set<string>();

// Register custom elements.
customElements.define(StreamCapture.defaultTagName, StreamCapture);
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
customElements.define(Card.defaultTagName, Card);

// Register events.
window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);
window.addEventListener('offline', onConnectivityChanged);
window.addEventListener('online', onConnectivityChanged);

// While the onboarding begins, attempt a fake detection. If the polyfill is
// necessary, or the detection fails, we should find out.
const attemptDetection = detectBarcodes(new ImageData(1, 1));

/**
 * Starts the user onboarding.
 */
export async function initialize(detectionMode: 'active' | 'passive' = 'passive') {
  const onboarding = document.querySelector(OnboardingCard.defaultTagName);
  if (!onboarding) {
    beginDetection(detectionMode);
    return;
  }

  // When onboarding is finished, start the stream and remove the loader.
  onboarding.addEventListener(OnboardingCard.onboardingFinishedEvent, () => {
    onboarding.remove();
    beginDetection(detectionMode);
  });
}

/**
 * Initializes the main behavior.
 */
async function beginDetection(detectionMode: 'active' | 'passive') {
  try {
    // Wait for the faked detection to resolve.
    await attemptDetection;

    // Create the stream.
    await createStreamCapture(detectionMode);
  } catch (e) {
    log(e.message, DEBUG_LEVEL.ERROR, 'Barcode detection');
    showNoSupportCard();
  }
}

let hintTimeout: number;
/**
 * Creates the stream an initializes capture.
 */
async function createStreamCapture(detectionMode: 'active' | 'passive') {
  const capture = new StreamCapture();
  if (detectionMode === 'passive') {
    capture.captureRate = 600;
  } else {
    capture.showOverlay('Tap to capture');
    capture.addEventListener('click', async () => {
      capture.paused = true;
      capture.showOverlay('Processing...');
      const imgData = await capture.captureFrame();
      fire(StreamCapture.frameEvent, capture, {imgData, detectionMode});
    });
  }
  capture.captureScale = 0.8;
  capture.addEventListener(StreamCapture.closeEvent, () => {
    capture.remove();
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

    hintTimeout = setTimeout(() => {
      capture.showOverlay('Make sure the barcode is inside the box.');
    }, window.PerceptionToolkit.config.hintTimeout || 5000) as unknown as number;
  } catch (e) {
    // User has denied or there are no cameras.
    console.log(e);
  }
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
  const barcodes = await detectBarcodes(imgData);

  for (const barcode of barcodes) {
    if (detectedBarcodes.has(barcode.rawValue)) {
      continue;
    }

    // Prevent multiple markers for the same barcode.
    detectedBarcodes.add(barcode.rawValue);

    vibrate(200);

    // Create a card for every found barcode.
    const card = new Card();
    card.src = barcode.rawValue;

    const container = createContainerIfRequired();
    container.appendChild(card);
  }

  if (barcodes.length > 0) {
    // Hide the hint if it's shown. Cancel it if it's pending.
    clearTimeout(hintTimeout);
    capture.hideOverlay();
  } else if (detectionMode && detectionMode === 'active') {
    capture.showOverlay('No barcodes found');
  }

  capture.paused = false;
  isProcessingCapture = false;

  // Hide the loader if there is one.
  const loader = document.querySelector(DotLoader.defaultTagName);
  if (!loader) {
    return;
  }

  loader.remove();
}

function onConnectivityChanged() {
  const connected = navigator.onLine;
  const capture =
      document.body.querySelector(StreamCapture.defaultTagName) as StreamCapture;

  if (!capture) {
    return;
  }

  if (!connected) {
    capture.showOverlay('Currently offline. Please reconnect to the network.');
  } else {
    capture.hideOverlay();
  }
}

function showNoSupportCard() {
  const noSupport = new NoSupportCard();
  document.body.appendChild(noSupport);
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
