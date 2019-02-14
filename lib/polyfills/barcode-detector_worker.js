(function () {
  'use strict';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  self.Module = {
      locateFile(url) {
          if (url.endsWith('.wasm')) {
              return `/third_party/zxing/${url}`;
          }
          return url;
      },
      onRuntimeInitialized() {
          self.postMessage('ready');
      }
  }; // Cast as WasmModule because the import will augment.
  if ('importScripts' in self) {
      // Import the emscripten'd file that loads the wasm.
      importScripts('/third_party/zxing/zxing.js');
  }
  function getDetectorModule() {
      return self.Module;
  }
  class WasmBarcodeDetector {
      process(data) {
          const Module = getDetectorModule();
          const format = '';
          const fileData = new Uint8Array(data);
          const buffer = Module._malloc(fileData.length);
          Module.HEAPU8.set(fileData, buffer);
          const result = Module.readBarcodeFromPng(buffer, fileData.length, true, format);
          Module._free(buffer);
          if (result.text) {
              return [{ rawValue: result.text }];
          }
          return [];
      }
  }
  const detector = new WasmBarcodeDetector();
  self.onmessage = (e) => {
      const data = detector.process(e.data);
      self.postMessage(data);
  };

}());
