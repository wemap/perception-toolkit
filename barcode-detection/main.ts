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
import { vibrate } from '../src/utils/vibrate.js';

import { Marker } from '../defs/marker.js';
import { ArtifactDealer, NearbyResult, NearbyResultDelta } from '../src/artifacts/artifact-dealer.js';
import { ArtifactLoader } from '../src/artifacts/artifact-loader.js';
import { LocalArtifactStore } from '../src/artifacts/stores/local-artifact-store.js';

const artloader = new ArtifactLoader();
const artstore = new LocalArtifactStore();
const artdealer = new ArtifactDealer();

artdealer.addArtifactStore(artstore);

const detectedBarcodes = new Set<string>();

// Register custom elements.
customElements.define(StreamCapture.defaultTagName, StreamCapture);
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
customElements.define(Card.defaultTagName, Card);

// Register events.
window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);
window.addEventListener('offline', onConnectivityChanged);
window.addEventListener('online', onConnectivityChanged);

const attemptDetection = detectBarcodes(new ImageData(1, 1));

/**
 * Starts the user onboarding.
 */
export async function initialize() {
  const onboarding = document.querySelector(OnboardingCard.defaultTagName);
  if (!onboarding) {
    beginDetection();
    return;
  }

  // When onboarding is finished, start the stream and remove the loader.
  onboarding.addEventListener(OnboardingCard.onboardingFinishedEvent, () => {
    onboarding.remove();
    beginDetection();
  });
}

/**
 * Initializes the main behavior.
 */
async function beginDetection() {
  try {
    // Wait for the faked detection to resolve.
    await attemptDetection;

    // Start loading some artifacts.
    await loadInitialArtifacts();

    // Create the stream.
    await createStreamCapture();
  } catch (e) {
    log(e.message, DEBUG_LEVEL.ERROR, 'Barcode detection');
    showNoSupportCard();
  }
}

let hintTimeout: number;

/**
 * Load artifact content for initial set.
 */
async function loadInitialArtifacts() {
  const artifactGroups = await Promise.all([
      artloader.fromDocument(document, document.URL),
      artloader.fromJsonUrl(new URL('./barcode-listing-sitemap.jsonld', document.URL)),
    ]);
  for (const artifacts of artifactGroups) {
    for (const artifact of artifacts) {
      artstore.addArtifact(artifact);
    }
  }
}

/**
 * Load artifact content from url on same originn, usually discovered from environment.
 *
 * TODO: Consider constraining content-type, so as not to fetch needless large resources.
 */
async function loadArtifactsFromSameOriginUrl(url: URL) {
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
async function updateContentDisplay(contentDiff: NearbyResultDelta) {
  for (const { target, content, artifact } of contentDiff.found) {
    // TODO: Card should accept the whole content object and template itself,

    // Create a card for every found barcode.
    const card = new Card();
    card.src = content.name;

    const container = createContainerIfRequired();
    container.appendChild(card);
  }
}

async function onMarkerFound(marker: Marker) {
  // If this marker is a URL, try loading artifacts from that URL
  try {
    // Attempt to convert markerValue to URL.  This will throw if markerValue isn't a valid URL.
    // Do not supply a base url argument, since we do not want to support relative URLs,
    // and because that would turn lots of normal string values into valid relative URLs.
    const url = new URL(marker.value);
    await loadArtifactsFromSameOriginUrl(url);
  } catch (_) {
    // Do nothing if this isn't a valid URL
  }

  // Update the UI
  const contentDiffs = await artdealer.markerFound(marker);
  updateContentDisplay(contentDiffs);
}

/**
 * Creates the stream an initializes capture.
 */
async function createStreamCapture() {
  const capture = new StreamCapture();
  capture.captureRate = 600;
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

    vibrate(200);

    // Hide the hint if it's shown. Cancel it if it's pending.
    clearTimeout(hintTimeout);
    (evt.target as StreamCapture).hideOverlay();

    await onMarkerFound({ type: 'qrcode', value: barcode.rawValue });
  }

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
