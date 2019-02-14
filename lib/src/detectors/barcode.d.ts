/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
declare global {
    interface Window {
        BarcodeDetector: typeof BarcodeDetector;
    }
}
/**
 * Detects barcodes from image sources.
 */
export declare function detect(data: ImageData | ImageBitmap | HTMLCanvasElement, { context, forceNewDetector, polyfillPrefix }?: {
    context?: Window | undefined;
    forceNewDetector?: boolean | undefined;
    polyfillPrefix?: string | undefined;
}): Promise<import("../../defs/barcode.js").Barcode[]>;
