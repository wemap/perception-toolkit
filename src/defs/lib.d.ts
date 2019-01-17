/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

type Supported = () => Promise<boolean>;
type Support = {[key: string]: boolean};

interface Document {
  fullscreenElement: null | HTMLElement;
}

interface Barcode {
  rawValue: string;
}

interface BarcodeDetector {
  detect(data: ImageData | ImageBitmap | HTMLCanvasElement): Promise<Array<Barcode>>
}

interface HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

declare const BarcodeDetector: {
  prototype: BarcodeDetector;
  new(): BarcodeDetector;
};

interface Window {
  BarcodeDetector: typeof BarcodeDetector
}
