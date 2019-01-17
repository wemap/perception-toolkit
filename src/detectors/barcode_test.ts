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
import { detect } from './barcode.js';

describe('BarcodeDetector', () => {

  class BarcodeDetectorMock implements BarcodeDetector {
    detect(): Promise<Barcode[]> {
      return Promise.resolve([]);
    }
  }

  function createSpy({throws = false} = {}) {
    const stub = spy(() => {
      const instance = createStubInstance(BarcodeDetectorMock);

      if (throws) {
        instance.detect.throws('Detection failed');
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
    const barcodes = await detect(canvas, barcodeSpy as any);

    assert.deepEqual(barcodes, [{rawValue: 'foo'}]);
    assert(barcodeSpy.BarcodeDetector.called);
  });

  it('recovers from failed detection', async () => {
    const barcodeSpy = createSpy({throws: true});
    const canvas = document.createElement('canvas');
    const barcodes = await detect(canvas, barcodeSpy as any);

    assert.deepEqual(barcodes, []);
    assert(barcodeSpy.BarcodeDetector.called);
  });
});
