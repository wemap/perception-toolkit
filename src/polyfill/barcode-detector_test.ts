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

import { BarcodeDetectorPolyfill } from './barcode-detector.js';

const workerValidSrc = `
  self.postMessage('ready');
  self.onmessage = (e) => {
    const value = [{rawValue: 'foo'}]
    self.postMessage(value);
  }`;
const workerValidUrl = URL.createObjectURL(new Blob([workerValidSrc]));

describe('BarcodeDetector', () => {
  it('isReady', async () => {
    const BarcodeDetector = new BarcodeDetectorPolyfill(workerValidUrl);
    const ready = await BarcodeDetector.isReady;
    assert.isTrue(ready);
  });

  it('fails for invalid workers', async () => {
    try {
      const workerSrc = `self.postMessage('foo');`;
      const workerUrl = URL.createObjectURL(new Blob([workerSrc]));
      const BarcodeDetector = new BarcodeDetectorPolyfill(workerUrl);
      await BarcodeDetector.isReady;
      assert.fail('should not load');
    } catch (e) {
      assert.equal(e.message, 'Unexpected worker response');
    }
  });

  it('returns null if not ready', async () => {
    const workerSrc = `setTimeout(() => self.postMessage('foo'), 500);`;
    const workerUrl = URL.createObjectURL(new Blob([workerSrc]));
    const BarcodeDetector = new BarcodeDetectorPolyfill(workerUrl);
    const value = await BarcodeDetector.detect({} as HTMLImageElement);
    assert.isNull(value);
  });

  it('handles Image elements', async () => {
    const BarcodeDetector = new BarcodeDetectorPolyfill(workerValidUrl);
    await BarcodeDetector.isReady;
    const value = await BarcodeDetector.detect(new Image());
    assert.isDefined(value);
  });

  it('handles ImageData', async () => {
    const BarcodeDetector = new BarcodeDetectorPolyfill(workerValidUrl);
    await BarcodeDetector.isReady;
    const value = await BarcodeDetector.detect(new ImageData(100, 100));
    assert.isDefined(value);
  });
});
