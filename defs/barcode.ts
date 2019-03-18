/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { WasmModule } from './wasm-module.js';

export interface Barcode {
  rawValue: string;
}

export interface BarcodeDetector {
  isReady?: Promise<void>;
  detect(data: ImageData | ImageBitmap | HTMLCanvasElement): Promise<Barcode[]>;
}

declare global {
  const BarcodeDetector: {
    prototype: BarcodeDetector;
    isReady?: Promise<void>;
    new(): BarcodeDetector;
  };
}

export interface BarcodeDectionResult {
  format: string;
  text: string;
  error: string;
}

export type BarcodeWasmModule = WasmModule & {
  readBarcodeFromPng(buffer: Uint8ClampedArray,
                     width: number,
                     height: number): BarcodeDectionResult
};
