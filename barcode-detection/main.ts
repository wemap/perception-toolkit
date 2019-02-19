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
import { DEBUG_LEVEL, log } from '../src/utils/logger.js';

import { ArtifactLoader } from '../src/artifacts/artifact-loader.js';
import { ArtifactDealer } from '../src/artifacts/artifact-dealer.js';
import { LocalArtifactStore } from '../src/artifacts/stores/local-artifact-store.js';

const artstore = new LocalArtifactStore;
const artdealer = new ArtifactDealer;

artdealer.addArtifactStore(artstore);

const detectedBarcodes = new Set<string>();

// Register custom elements.
customElements.define(StreamCapture.defaultTagName, StreamCapture);
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
customElements.define(Card.defaultTagName, Card);

// Register events.
window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);

// While the onboarding begins, attempt a fake detection. If the polyfill is
// necessary, or the detection fails, we should find out.
const attemptDetection = detectBarcodes(new ImageData(1, 1));

// Go!
waitForOnboardingFinish();

/**
 * Starts the user onboarding.
 */
async function waitForOnboardingFinish() {
  const onboarding = document.querySelector(OnboardingCard.defaultTagName);
  if (!onboarding) {
    initialize();
    return;
  }

  // When onboarding is finished, start the stream and remove the loader.
  onboarding.addEventListener(OnboardingCard.onboardingFinishedEvent, () => {
    onboarding.remove();
    initialize();
  });
}

/**
 * Initializes the main behavior.
 */
async function initialize() {
  try {
    // Wait for the faked detection to resolve.
    await attemptDetection;

    // Start loading some artifacts.
    /* await */ loadArtifacts();

    // Create the stream.
    await createStreamCapture();

    await setupContentDisplay();
  } catch (e) {
    log(e.message, DEBUG_LEVEL.ERROR, 'Barcode detection');
    showNoSupportCard();
  }
}

/**
 * Load artifact content.  Note: this can be done async without awaiting.
 */
async function loadArtifacts() {
  const artloader = new ArtifactLoader;
  artloader.addEventListener('artifact-found', (evt: Event) => {
    const { detail } = evt as CustomEvent<any>;
    let { root, datafeed, arartifact } = detail;

    artstore.addArtifact(arartifact);
  });

  // Load artifacts defined on this page
  await artloader.fromDocument(document, document.URL);
  // Alternative:
  // await artloader.fromHtmlUrl(new URL('./index.html', document.URL));

  // Load artifacts from a jsonld "sitemap"
  await artloader.fromJsonUrl(new URL('./barcode-listing-sitemap.jsonld', document.URL));
}

/**
 * Whenever we find nearby content, show it
 */
async function setupContentDisplay() {
  artdealer.addEventListener('nearby-content-found', (evt: Event) => {
    const { detail } = evt as CustomEvent<any>;
    let { target, content } = detail;

    // TODO: Card should accept the whole content object and template itself,
    // Or, card should have more properties than just src.

    // Create a card for every found barcode.
    const card = new Card();
    card.src = content.name;

    const container = createContainerIfRequired();
    container.appendChild(card);
  });

  artdealer.addEventListener('nearby-content-lost', (evt: Event) => {
    const { detail } = evt as CustomEvent<any>;
    let { target, content } = detail;
    // TODO: hide card after timeout?  Mark it as missing?
  });
}

/**
 * Creates the stream an initializes capture.
 */
async function createStreamCapture() {
  const capture = new StreamCapture();
  capture.captureRate = 600;
  capture.captureScale = 0.8;

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
  } catch (e) {
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
async function onCaptureFrame(evt: Event) {
  const { detail } = evt as CustomEvent<{imgData: ImageData}>;
  const { imgData } = detail;
  const barcodes = await detectBarcodes(imgData);

  for (const barcode of barcodes) {
    if (detectedBarcodes.has(barcode.rawValue)) {
      continue;
    }

    // Prevent multiple markers for the same barcode.
    detectedBarcodes.add(barcode.rawValue);

    vibrate();

    // TODO: Do we have access top barcode type? Or, maybe ignore types and merge by unique value only?
    artdealer.markerFound(barcode.rawValue, 'qrcode');
  }

  // Hide the loader if there is one.
  const loader = document.querySelector(DotLoader.defaultTagName);
  if (!loader) {
    return;
  }

  loader.remove();
}

function vibrate() {
  if (!('vibrate' in navigator)) {
    return;
  }

  navigator.vibrate(200);
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
