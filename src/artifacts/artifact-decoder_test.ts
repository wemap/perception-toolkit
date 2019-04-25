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

import { ArtifactDecoder } from './artifact-decoder.js';
import { ARArtifact } from './schema/ar-artifact.js';
import { JsonLd } from './schema/json-ld.js';

describe('ArtifactDecoder', () => {
  let artDecoder: ArtifactDecoder;

  beforeEach(() => {
    artDecoder = new ArtifactDecoder();
  });

  it('returns empty array for empty json-ld', () => {
    const result = artDecoder.decode({});
    assert.isArray(result);
    assert.isEmpty(result);
  });

  it('returns empty array for non json-ld', () => {
    const result = artDecoder.decode({ is_not: `real json-ld` });
    assert.isArray(result);
    assert.isEmpty(result);
  });

  it('returns empty array for json-ld types we ignore', () => {
    const result = artDecoder.decode({ '@type': 'https://schema.org/SomeOtherType' });
    assert.isArray(result);
    assert.isEmpty(result);
  });

  function testArtifact(artifact: ARArtifact) {
    assert.containsAllKeys(artifact, ['@type', 'arTarget', 'arContent']);
  }

  it('parses simple AR Artifacts', () => {
    const result = artDecoder.decode({
      '@type': 'ARArtifact',
      'arTarget': {},
      'arContent': {},
    });
    assert.isArray(result);
    assert.lengthOf(result, 1);
    testArtifact(result[0]);
  });

  it('parses array of AR Artifacts', () => {
    const result = artDecoder.decode([{
      '@type': 'ARArtifact',
      'arTarget': {},
      'arContent': {},
    }, {
      '@type': 'ARArtifact',
      'arTarget': {},
      'arContent': {},
    }]);
    assert.isArray(result);
    assert.lengthOf(result, 2);
    for (let artifact of result) {
      testArtifact(artifact);
    }
  });

  describe('DataFeed parsing', () => {
    it('parses empty DataFeed', () => {
      const result = artDecoder.decode({
        '@type': 'DataFeed'
      });
      assert.isArray(result);
      assert.isEmpty(result);
    });

    it('parses single-element DataFeed', () => {
      const result = artDecoder.decode({
        '@type': 'DataFeed',
        'dataFeedElement': {
            '@type': 'ARArtifact',
            'arTarget': {},
            'arContent': {},
          }
      });
      assert.isArray(result);
      assert.lengthOf(result, 1);
      testArtifact(result[0]);
    });

    it('parses multi-element DataFeed', () => {
      const result = artDecoder.decode({
        '@type': 'DataFeed',
        'dataFeedElement': [{
            '@type': 'ARArtifact',
            'arTarget': {},
            'arContent': {},
          }, {
            '@type': 'ARArtifact',
            'arTarget': {},
            'arContent': {},
          }
        ]
      });
      assert.isArray(result);
      assert.lengthOf(result, 2);
      for (let artifact of result) {
        testArtifact(artifact);
      }
    });

  });
});
