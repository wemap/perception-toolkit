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

import { Barcode, BarcodeDetector } from '../../defs/barcode.js';
import { injectScript } from '../utils/inject-script.js';
import { DEBUG_LEVEL, log } from '../utils/logger.js';

let detector: BarcodeDetector;

/**
 * Detects barcodes from image sources.
 */
export async function detectBarcodes(data: ImageData | ImageBitmap | HTMLCanvasElement,
                                     {
                                       context = window,
                                       forceNewDetector = false,
                                       polyfillRequired = false,
                                       polyfillPrefix = ''
                                     } = {}): Promise<Barcode[]> {

  const loadPolyfill = polyfillRequired ||
      (context === window && !('BarcodeDetector' in context));
  if (loadPolyfill) {
    log('Using barcode detection polyfill', DEBUG_LEVEL.INFO,
        'BarcodeDetector');
    await injectScript(`${polyfillPrefix}/lib/polyfills/barcode-detector.js`);
  }

  /* istanbul ignore else */
  if (!detector || forceNewDetector) {
    detector = new context.BarcodeDetector();
  }

  /* istanbul ignore else */
  if ('isReady' in detector) {
    await detector.isReady;
  }

  try {
    return await detector.detect(data);
  } catch (e) {
    // If the polyfill has loaded but there are still issues, exit.
    if (polyfillRequired) {
      return [];
    }

    log(`Detection failed: ${e.message}`, DEBUG_LEVEL.WARNING);
    return await detectBarcodes(data,
        {
          context,
          forceNewDetector,
          polyfillPrefix,
          polyfillRequired: true
        });
  }
}
