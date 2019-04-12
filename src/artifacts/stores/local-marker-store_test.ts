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
import { Marker } from '../../../defs/marker.js';
import { NearbyResult } from '../artifact-dealer.js';
import { ARArtifact } from '../schema/ar-artifact.js';
import { Barcode } from '../schema/barcode.js';

describe.only('LocalMarkerStore', () => {
  let localMarkerStore;

  beforeEach(() => {
    localMarkerStore = new LocalMarkerStore();
  });

  it('accepts barcodes', () => {
    const barcode: Barcode = { text: 'Barcode Value' };
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
    const specificBarcode = { text: 'Barcode1' };
    const specificArtifact = {
      arTarget: specificBarcode,
      arContent: 'Fake URL'
    };

    beforeEach(() => {
      localMarkerStore.addMarker(specificArtifact, specificBarcode);
      localMarkerStore.addMarker({}, { text: 'Barcode2' });
      localMarkerStore.addMarker({}, { text: 'Barcode3' });
      localMarkerStore.addMarker({}, { text: 'Barcode4' });
      localMarkerStore.addMarker({}, { text: 'Barcode5' });
    });

    it('ignores malformed search criteria', () => {
      const results = localMarkerStore.findRelevantArtifacts([{ }]);
      assert.lengthOf(results, 0);
    });

    it('finds single marker by value', () => {
      const code = 'Barcode2';
      const results = localMarkerStore.findRelevantArtifacts([{ value: code }]);
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].target, { text: code });
    });

    it('finds multiple markers together', () => {
      const results = localMarkerStore.findRelevantArtifacts([
        { value: 'Barcode2' }, { value: 'Barcode3' }, { value: 'Barcode4' }, { value: 'Barcode5' }
      ]);
      assert.lengthOf(results, 4);
    });

    it('doesnt find non-existant markers', () => {
      const results = localMarkerStore.findRelevantArtifacts([
        { value: 'Barcode2' }, { value: 'Barcode3' }, // Should find
        { value: 'Barcode6' }, { value: 'Barcode7' }, // Should not find
      ]);
      assert.lengthOf(results, 2);
    });

    it('returns original artifact', () => {
      const results = localMarkerStore.findRelevantArtifacts([{ value: specificBarcode.text }]);
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].target, specificBarcode);
      assert.deepEqual(results[0].artifact, specificArtifact);
    });

  });
});
