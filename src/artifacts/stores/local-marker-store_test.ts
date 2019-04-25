/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { assert } = chai;

import { LocalMarkerStore } from './local-marker-store.js';
import { Barcode } from '../schema/core-schema-org.js';
import { ARArtifact } from '../schema/extension-ar-artifacts.js';

describe('LocalMarkerStore', () => {
  let localMarkerStore : LocalMarkerStore;

  beforeEach(() => {
    localMarkerStore = new LocalMarkerStore();
  });

  it('accepts barcodes', () => {
    const barcode: Barcode = { '@type': 'Barcode', 'text': 'Barcode Value' };
    const artifact: ARArtifact = {
      arTarget: barcode,
      arContent: 'Fake URL'
    };
    assert.doesNotThrow(() => {
      const addedMarker = localMarkerStore.addMarker(artifact, barcode);
      assert.isTrue(addedMarker);
    });
  });

  it('ignores malformed inputs', () => {
    assert.doesNotThrow(() => {
      const addedMarker = localMarkerStore.addMarker({}, {});
      assert.isFalse(addedMarker);
    });
  });

  describe('FindRelevantMarkers', () => {
    const specificBarcode = { '@type': 'Barcode', 'text': 'Barcode1' };
    const specificArtifact = {
      arTarget: specificBarcode,
      arContent: 'Fake URL'
    };

    beforeEach(() => {
      localMarkerStore.addMarker(specificArtifact, specificBarcode);
      localMarkerStore.addMarker({}, { '@type': 'Barcode', 'text': 'Barcode2' });
      localMarkerStore.addMarker({}, { '@type': 'Barcode', 'text': 'Barcode3' });
      localMarkerStore.addMarker({}, { '@type': 'Barcode', 'text': 'Barcode4' });
      localMarkerStore.addMarker({}, { '@type': 'Barcode', 'text': 'Barcode5' });
    });

    it('finds single marker by value', () => {
      const code = 'Barcode2';
      const results = localMarkerStore.findRelevantArtifacts([{ type: 'qrcode', value: code }]);
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].target, { '@type': 'Barcode', 'text': code });
    });

    it('finds multiple markers together', () => {
      const results = localMarkerStore.findRelevantArtifacts([
        { type: 'qrcode', value: 'Barcode2' },
        { type: 'qrcode', value: 'Barcode3' },
        { type: 'qrcode', value: 'Barcode4' },
        { type: 'qrcode', value: 'Barcode5' },
      ]);
      assert.lengthOf(results, 4);
    });

    it('doesnt find non-existant markers', () => {
      const results = localMarkerStore.findRelevantArtifacts([
        { type: 'qrcode', value: 'Barcode2' }, { type: 'qrcode', value: 'Barcode3' }, // Should find
        { type: 'qrcode', value: 'Barcode6' }, { type: 'qrcode', value: 'Barcode7' }, // Should not find
      ]);
      assert.lengthOf(results, 2);
    });

    it('returns original artifact', () => {
      const results = localMarkerStore.findRelevantArtifacts([{ type: 'qrcode', value: specificBarcode.text }]);
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].target, specificBarcode);
      assert.deepEqual(results[0].artifact, specificArtifact);
    });

  });
});
