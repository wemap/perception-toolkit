/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export interface WasmModule {
  HEAPU8: Uint8Array;
  HEAPF32: Float32Array;
  HEAPU32: Uint32Array;
  HEAPF64: Float64Array;

  _malloc(s: number): number;
  _free(s: number): void;
  _process(s: number): number;

  preRun(): void;
  onRuntimeInitialized(): void;
  locateFile(url: string): string;
}
