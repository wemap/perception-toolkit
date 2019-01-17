/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export async function detect(data: ImageData | ImageBitmap | HTMLCanvasElement,
                             context: {BarcodeDetector: typeof BarcodeDetector} = window) {
  try {
    const detector = new context.BarcodeDetector();
    return await detector.detect(data);
  } catch (e) {
    // TODO(paullewis): Fall back to using a third party lib.
    return [];
  }
}
