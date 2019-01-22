/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { detect as BarcodeDetect } from '../detectors/barcode.js';
import { CameraCapture } from '../elements/camera-capture/camera-capture.js';
import { Card } from '../elements/card/card.js';
import { NoSupportCard } from '../elements/no-support-card/no-support-card.js';
import * as BarcodeDetectorSupport from '../support/barcode.js';
import { DeviceSupport } from '../support/device-support.js';
import * as GetUserMediaSupport from '../support/get-user-media.js';
import * as EnvironmentCamera from '../utils/environment-camera.js';

const detectedBarcodes = new Set<string>();

/**
 * Processes the outcome of the device support testing.
 *
 * @param evt The supports event from the DeviceSupport class.
 */
function onSupports(evt: Event) {
  const supportEvt = evt as CustomEvent<Support>;
  if (!(supportEvt.detail[BarcodeDetectorSupport.name] &&
        supportEvt.detail[GetUserMediaSupport.name])) {
    const noSupport = new NoSupportCard();
    document.body.appendChild(noSupport);
    return;
  }

  createCameraCapture();
}

/**
 * Creates a getUserMedia-based camera capture.
 */
async function createCameraCapture() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const supportsEnvironmentCamera =
      EnvironmentCamera.supportsEnvironmentCamera(devices);
  const capture = new CameraCapture();
  capture.captureRate = 1000;
  capture.style.width = '100%';
  capture.captureScale = 0.75;
  capture.addEventListener('click', async () => {
    try {
      await capture.requestFullscreen();
    } catch (e) {
      // Unable to go full screen.
      console.warn(e);
    }
  });

  const streamOpts = {
    video: {
      facingMode: 'environment'
    }
  };

  // Attempt to get the camera.
  const stream = await navigator.mediaDevices.getUserMedia(streamOpts);
  capture.flipped = !supportsEnvironmentCamera;
  capture.start(stream);

  document.body.appendChild(capture);
}

/**
 * Processes the image data captured by the Camera Capture class. Hands off the
 * image data to the barcode detector for processing.
 *
 * @param evt The Custom Event containing the captured frame data.
 */
async function onCaptureFrame(evt: Event) {
  const { detail } = evt as CustomEvent<{imgData: ImageData}>;
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
customElements.define(CameraCapture.defaultTagName, CameraCapture);
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
customElements.define(Card.defaultTagName, Card);

// Register events.
window.addEventListener(DeviceSupport.supportsEvent, onSupports);
window.addEventListener(CameraCapture.frameEvent, onCaptureFrame);

// Start the detection process.
const deviceSupport = new DeviceSupport();
deviceSupport.useEvents = true;
deviceSupport.addDetector(BarcodeDetectorSupport);
deviceSupport.addDetector(GetUserMediaSupport);
deviceSupport.detect();
