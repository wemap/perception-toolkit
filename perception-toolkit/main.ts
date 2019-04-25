/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { detectBarcodes } from '../src/detectors/barcode.js';
import { ActionButton } from '../src/elements/action-button/action-button.js';
import { Card, CardData } from '../src/elements/card/card.js';
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
import { OnboardingCard } from '../src/elements/onboarding-card/onboarding-card.js';
import { hideOverlay, showOverlay } from '../src/elements/overlay/overlay.js';
import { closeEvent, frameEvent, StreamCapture } from '../src/elements/stream-capture/stream-capture.js';
import { supportsEnvironmentCamera } from '../src/utils/environment-camera.js';
import { fire } from '../src/utils/fire.js';
import { DEBUG_LEVEL, enableLogLevel, log } from '../src/utils/logger.js';
import { vibrate } from '../src/utils/vibrate.js';

export { vibrate } from '../src/utils/vibrate.js';
export { Card } from '../src/elements/card/card.js';
export { ActionButton } from '../src/elements/action-button/action-button.js';

import { Marker } from '../defs/marker.js';
import { NearbyResultDelta } from '../src/artifacts/artifact-dealer.js';
import { MeaningMaker } from './meaning-maker.js';

import { cameraAccessDenied, markerChanges, markerDetect } from './events.js';

const detectedMarkers = new Map<{value: string, format: string}, number>();

const meaningMaker = new MeaningMaker();

// Register custom elements.
customElements.define(StreamCapture.defaultTagName, StreamCapture);
customElements.define(Card.defaultTagName, Card);
customElements.define(ActionButton.defaultTagName, ActionButton);

// Register events.
window.addEventListener(frameEvent, onCaptureFrame);
window.addEventListener('offline', onConnectivityChanged);
window.addEventListener('online', onConnectivityChanged);

switch (window.PerceptionToolkit.config.debugLevel) {
  case DEBUG_LEVEL.VERBOSE:
    enableLogLevel(DEBUG_LEVEL.VERBOSE);
    break;

  case DEBUG_LEVEL.INFO:
    enableLogLevel(DEBUG_LEVEL.INFO);
    break;

  case DEBUG_LEVEL.WARNING:
    enableLogLevel(DEBUG_LEVEL.WARNING);
    break;

  case DEBUG_LEVEL.NONE:
    enableLogLevel(DEBUG_LEVEL.NONE);
    break;

  default:
    enableLogLevel(DEBUG_LEVEL.ERROR);
    break;
}

// While the onboarding begins, attempt a fake detection. If the polyfill is
// necessary, or the detection fails, we should find out.
const polyfillPrefix = window.PerceptionToolkit.config.root || '';

// TODO: Attempt the correct detection based on the target types.
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
    log(e.message, DEBUG_LEVEL.ERROR, 'Begin detection');
  }
}

/**
 * Whenever we find nearby content, show it
 */
async function updateContentDisplay(contentDiff: NearbyResultDelta) {
  const { cardContainer, cardUrlLabel, cardMainEntityLabel,
      cardShouldLaunchNewWindow = false } =
      window.PerceptionToolkit.config;

  if (!cardContainer) {
    log(`No card container provided, but event'a default was not prevented`,
        DEBUG_LEVEL.ERROR);
    return;
  }

  // Prevent multiple cards from showing.
  if (cardContainer.hasChildNodes()) {
    return;
  }

  for (const { content } of contentDiff.found) {
    // Create a card for every found marker.
    const cardContent = content as CardData;
    const card = new Card();
    card.src = cardContent;
    cardContainer.appendChild(card);

    if (typeof cardContent.url !== 'undefined') {
      const viewDetails = createActionButton(cardContent.url,
          cardUrlLabel || 'View Details',
          cardShouldLaunchNewWindow);
      card.appendChild(viewDetails);
    }

    if (typeof cardContent.mainEntity !== 'undefined' &&
        typeof cardContent.mainEntity.url !== 'undefined') {
      const launch = createActionButton(cardContent.mainEntity.url,
          cardMainEntityLabel || 'Launch',
          cardShouldLaunchNewWindow);
      card.appendChild(launch);
    }
  }
}

function createActionButton(url: string, label: string, launchNewWindow: boolean) {
  const targetUrl = url;
  const button = new ActionButton();
  button.label = label;

  const callback = launchNewWindow ?
      () => {
        if (!targetUrl) {
          return;
        }
        window.open(targetUrl);
      } :

      () => {
        if (!targetUrl) {
          return;
        }
        window.location.href = targetUrl;
      };

  button.addEventListener('click', callback);
  return button;
}

/*
 * Handle Marker discovery
 */
async function onMarkerFound(evt: Event) {
  const { detail } = evt as CustomEvent<{value: string, format: string}>;
  const { value, format } = detail;
  const marker: Marker = { type: format, value };
  const { shouldLoadArtifactsFrom } = window.PerceptionToolkit.config;

  // Update the UI
  const contentDiffs = await meaningMaker.markerFound(marker, shouldLoadArtifactsFrom);
  const markerChangeEvt = fire(markerChanges, capture, contentDiffs);

  // If the developer prevents default on the marker changes event then don't
  // handle the UI updates; they're doing it themselves.
  if (markerChangeEvt.defaultPrevented) {
    return;
  }

  vibrate(200);
  updateContentDisplay(contentDiffs);
}

let stream: MediaStream;
const streamOpts = {
  video: {
    facingMode: 'environment'
  }
};

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
      fire(frameEvent, capture, {imgData, detectionMode});
    });
  }
  capture.captureScale = 0.8;
  capture.addEventListener(closeEvent, close);
  capture.addEventListener(markerDetect, onMarkerFound);

  // Attempt to get access to the user's camera.
  try {
    stream = await navigator.mediaDevices.getUserMedia(streamOpts);
    const devices = await navigator.mediaDevices.enumerateDevices();

    const hasEnvCamera = await supportsEnvironmentCamera(devices);
    capture.flipped = !hasEnvCamera;

    window.addEventListener('visibilitychange', onVisibilityChange);

    capture.start(stream);
    document.body.appendChild(capture);

    hintTimeout = setTimeout(() => {
      showOverlay('Make sure the marker is inside the box.');
    }, window.PerceptionToolkit.config.hintTimeout || 5000) as unknown as number;
  } catch (e) {
    // User has denied or there are no cameras.
    fire(cameraAccessDenied, window);
  }
}

let isRequestingNewStream = false;
/**
 * Ensure the stream is stopped and started when the user changes tabs.
 */
async function onVisibilityChange() {
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
}

export function close() {
  capture.stop();
  capture.remove();
  hideOverlay();
  clearTimeout(hintTimeout);
  window.removeEventListener('visibilitychange', onVisibilityChange);

  const onboarding = document.querySelector(OnboardingCard.defaultTagName);
  if (!onboarding) {
    return;
  }

  onboarding.remove();
}

let isProcessingCapture = false;
/**
 * Processes the image data captured by the StreamCapture class, and hands off
 * the image data to the detector for processing.
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

  // TODO: Expand with other types besides barcodes.
  const markers = await detectBarcodes(imgData, { polyfillPrefix });

  for (const marker of markers) {
    const value = { value: marker.rawValue, format: marker.format };
    const markerAlreadyDetected = detectedMarkers.has(value);

    // Update the last time for this marker.
    detectedMarkers.set(value, self.performance.now());
    if (markerAlreadyDetected) {
      continue;
    }

    log(value, DEBUG_LEVEL.INFO, 'Detect');

    // Only fire the event if the marker is freshly detected.
    fire(markerDetect, capture, value);
  }

  if (markers.length > 0) {
    // Hide the hint if it's shown. Cancel it if it's pending.
    clearTimeout(hintTimeout);
    hideOverlay();
  } else if (detectionMode && detectionMode === 'active') {
    showOverlay('No markers found');
  }

  capture.paused = false;

  // Provide a cool-off before allowing another detection. This aids the case
  // where a recently-scanned markers are mistakenly re-scanned.
  setTimeout(async () => {
    const now = self.performance.now();
    const removals = [];
    for (const [markerValue, timeLastSeen] of detectedMarkers.entries()) {
      if (now - timeLastSeen < 1000) {
        continue;
      }

      const marker: Marker = { value: markerValue.value, type: markerValue.format };
      removals.push(meaningMaker.markerLost(marker));
      detectedMarkers.delete(markerValue);
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
