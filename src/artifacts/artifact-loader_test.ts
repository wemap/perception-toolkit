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

import { ArtifactLoader } from './artifact-loader.js';

describe.only('ArtifactLoader', () => {
  let artLoader: ArtifactLoader;

  beforeEach(() => {
    artLoader = new ArtifactLoader();
  });

  it('passes JSON to Artifact Decoder', async () => {
    const result = await artLoader.fromJson({
      '@type': 'ARArtifact',
      'arTarget': {},
      'arContent': {},
    });
    assert.isArray(result);
    assert.lengthOf(result, 1);
    assert.containsAllKeys(result[0], ['@type', 'arTarget', 'arContent']);
  });

  it('decodes inline script', async () => {
    const html = `
      <!doctype html>
      <html>
      <head>
      <script type="application/ld+json">
      {
        "@type": "ARArtifact",
        "arTarget": {},
        "arContent": {}
      }
      </script>
      </head>
      </html>
    `;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const result = await artLoader.fromElement(doc, 'Fake URL');
    assert.isArray(result);
    assert.lengthOf(result, 1);
    assert.containsAllKeys(result[0], ['@type', 'arTarget', 'arContent']);
  });

  it('decodes nested inline script', async () => {
    const html = `
      <!doctype html>
      <html>
      <head>
      </head>
      <body>
        <div><p>
          <script type="application/ld+json">
          {
            "@type": "ARArtifact",
            "arTarget": {},
            "arContent": {}
          }
          </script>
          </p></div>
        </body>
      </html>
    `;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const result = await artLoader.fromElement(doc, 'Fake URL');
    assert.isArray(result);
    assert.lengthOf(result, 1);
    assert.containsAllKeys(result[0], ['@type', 'arTarget', 'arContent']);
  });

  it('decodes mulitple inline scripts', async () => {
    const html = `
      <!doctype html>
      <html>
      <head>
      <script type="application/ld+json">
      {
        "@type": "ARArtifact",
        "arTarget": {},
        "arContent": {}
      }
      </script>
      </head>
      <body>
        <div><p>
          <script type="application/ld+json">
          {
            "@type": "ARArtifact",
            "arTarget": {},
            "arContent": {}
          }
          </script>
          </p></div>
        </body>
      </html>
    `;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const result = await artLoader.fromElement(doc, 'Fake URL');
    assert.isArray(result);
    assert.lengthOf(result, 2);
  });
});
