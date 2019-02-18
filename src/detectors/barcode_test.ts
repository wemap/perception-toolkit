/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const { assert } = chai;
import { createStubInstance, spy } from 'sinon';
import { BarcodeDetectorPolyfill } from '../polyfill/barcode-detector.js';
import { detectBarcodes } from './barcode.js';

describe('BarcodeDetector', () => {

  class BarcodeDetectorMock {
    detect() {
      return Promise.resolve([]);
    }
  }

  function createSpy({throws = false} = {}) {
    const stub = spy(() => {
      const instance = createStubInstance(BarcodeDetectorMock);

      if (throws) {
        instance.detect.throws(new Error('Detection failed'));
      } else {
        instance.detect.returns(Promise.resolve([{rawValue: 'foo'}]));
      }

      return instance;
    });

    return {
      BarcodeDetector: stub
    };
  }

  it('should detect', async () => {
    const barcodeSpy = createSpy();
    const canvas = document.createElement('canvas');
    const barcodes = await detectBarcodes(canvas, {
        context: barcodeSpy as any, forceNewDetector: true
    });

    assert.deepEqual(barcodes, [{rawValue: 'foo'}]);
    assert(barcodeSpy.BarcodeDetector.called);
  });

  it('recovers from failed detection', async () => {
    const barcodeSpy = createSpy({throws: true});
    const canvas = document.createElement('canvas');
    const barcodes = await detectBarcodes(canvas, {
      context: barcodeSpy as any, forceNewDetector: true
    });

    assert.deepEqual(barcodes, []);
    assert(barcodeSpy.BarcodeDetector.called);
  }).timeout(5000);

  it('recovers from secondary failed detection', async () => {
    // Try and remove the polyfill.
    const win: Window & {BarcodeDetector?: BarcodeDetectorPolyfill} =
        window as any;
    const Detector = win.BarcodeDetector;
    if (typeof Detector !== 'undefined') {
      // Detector, but possible polyfill.
      if ((Detector as any).name === 'BarcodeDetectorPolyfill') {
        delete (window as any).BarcodeDetector;
      } else {
        // Leave here - the browser supports the feature.
        return;
      }
    }

    const canvas = document.createElement('canvas');
    const barcodes = await detectBarcodes(canvas, { forceNewDetector: true });

    assert.deepEqual(barcodes, []);
  });
});
