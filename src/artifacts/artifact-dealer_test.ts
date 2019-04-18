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

import { LocalArtifactStore } from './stores/local-artifact-store.js';

const { assert } = chai;

import { ArtifactDealer } from './artifact-dealer.js';

describe.only('ArtifactDealer', () => {
  let artDealer: ArtifactDealer;

  beforeEach(() => {
    artDealer = new ArtifactDealer();
  });

  it('supports adding stores', () => {
    artDealer.addArtifactStore(new LocalArtifactStore());
  });

  describe('Adding and Finding', () => {
    beforeEach(() => {
      const store = new LocalArtifactStore();
      artDealer.addArtifactStore(store);

      store.addArtifact({
        arTarget: { '@type': 'Barcode', 'text': 'Barcode1' },
        arContent: 'Fake URL'
      });
      store.addArtifact({
        arTarget: [
          { '@type': 'Barcode', 'text': 'Barcode2' },
          { '@type': 'Unsupported' },
        ],
        arContent: 'Fake URL'
      });
      store.addArtifact({
        arTarget: [
          { '@type': 'Barcode', 'text': 'Barcode3' },
          { '@type': 'Barcode', 'text': 'Barcode4' },
          { '@type': 'Barcode', 'text': 'Barcode5' },
        ],
        arContent: 'Fake URL'
      });
    });

    it('Ignores unknown markers', async () => {
      const result = await artDealer.markerFound({
        type: 'qrcode',
        value: 'Unknown Marker'
      });
      assert.isArray(result.found);
      assert.isEmpty(result.found);
      assert.isArray(result.lost);
      assert.isEmpty(result.lost);
    });

    it('Finds known markers', async () => {
      const result = await artDealer.markerFound({
        type: 'qrcode',
        value: 'Barcode1'
      });
      assert.isArray(result.found);
      assert.lengthOf(result.found, 1);
      assert.equal(result.found[0].target.text, 'Barcode1');

      assert.isArray(result.lost);
      assert.isEmpty(result.lost);
    });

    it('Loses known markers', async () => {
      await artDealer.markerFound({
        type: 'qrcode',
        value: 'Barcode1'
      });
      const result = await artDealer.markerLost({
        type: 'qrcode',
        value: 'Barcode1'
      });
      assert.isArray(result.found);
      assert.isEmpty(result.found);

      assert.isArray(result.lost);
      assert.lengthOf(result.lost, 1);
      assert.equal(result.lost[0].target.text, 'Barcode1');
    });

    it('Ignores geolocation', async () => {
      const result = await artDealer.updateGeolocation({});
      assert.isArray(result.found);
      assert.isEmpty(result.found);
      assert.isArray(result.lost);
      assert.isEmpty(result.lost);
    });
  });
});
