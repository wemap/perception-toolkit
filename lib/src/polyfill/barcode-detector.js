/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { isImageData } from '../utils/is-image-data.js';
export class BarcodeDetectorPolyfill {
    constructor(path = 'barcode-detector_worker.js') {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hasLoaded = false;
        let prefix = '/';
        if (typeof BarcodeDetectorPolyfill.loadedFrom !== 'undefined') {
            const prefixUrl = new URL(path, BarcodeDetectorPolyfill.loadedFrom);
            path = prefixUrl.href;
            prefix = prefixUrl.href.replace(/lib.*/, '');
        }
        this.worker = new Worker(path);
        this.worker.postMessage(prefix);
        this.isReadyInternal = new Promise((resolve, reject) => {
            this.worker.onmessage = (e) => {
                if (e.data === 'ready') {
                    this.hasLoaded = true;
                    resolve(this.hasLoaded);
                }
                else {
                    reject(new Error('Unexpected worker response'));
                }
            };
        });
    }
    get isReady() {
        return this.isReadyInternal;
    }
    async detect(pixels) {
        if (!this.hasLoaded) {
            return null;
        }
        return new Promise(async (resolve) => {
            if (isImageData(pixels)) {
                this.canvas.width = pixels.width;
                this.canvas.height = pixels.height;
                this.ctx.putImageData(pixels, 0, 0);
            }
            else {
                this.canvas.width = pixels.naturalWidth;
                this.canvas.height = pixels.naturalHeight;
                this.ctx.drawImage(pixels, 0, 0);
            }
            this.canvas.toBlob((blob) => {
                /* istanbul ignore next */
                if (!blob) {
                    resolve([]);
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.worker.onmessage = (evt) => {
                        resolve(evt.data);
                    };
                    this.worker.postMessage(reader.result);
                };
                reader.readAsArrayBuffer(blob);
            });
        });
    }
}
// Prevent overwriting the built-in.
/* istanbul ignore next */
if (!('BarcodeDetector' in self)) {
    const script = document.currentScript;
    window.BarcodeDetector = BarcodeDetectorPolyfill;
    BarcodeDetectorPolyfill.loadedFrom = new URL(script.src, window.location.toString());
}
//# sourceMappingURL=barcode-detector.js.map