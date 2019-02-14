/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { detect as BarcodeDetect } from '../src/detectors/barcode.js';
import { Card } from '../src/elements/card/card.js';
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
import { NoSupportCard } from '../src/elements/no-support-card/no-support-card.js';
import { StreamCapture } from '../src/elements/stream-capture/stream-capture.js';
import { DeviceSupport } from '../src/support/device-support.js';
import { default as GetUserMediaSupport } from '../src/support/get-user-media.js';
import * as EnvironmentCamera from '../src/utils/environment-camera.js';
import { DEBUG_LEVEL, enableLogLevel } from '../src/utils/logger.js';
enableLogLevel(DEBUG_LEVEL.WARNING);
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
    createStreamCapture();
}
async function createStreamCapture() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const supportsEnvironmentCamera = await EnvironmentCamera.supportsEnvironmentCamera(devices);
    const capture = new StreamCapture();
    capture.captureRate = 600;
    capture.style.width = '100%';
    capture.captureScale = 0.6;
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
    const stream = await navigator.mediaDevices.getUserMedia(streamOpts);
    capture.flipped = !supportsEnvironmentCamera;
    capture.start(stream);
    document.body.appendChild(capture);
}
/**
 * Processes the image data captured by the StreamCapture class, and hands off
 * the image data to the barcode detector for processing.
 *
 * @param evt The Custom Event containing the captured frame data.
 */
async function onCaptureFrame(evt) {
    if (loader) {
        loader.remove();
        loader = null;
    }
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
deviceSupport.detect();
//# sourceMappingURL=barcode-detection.js.map