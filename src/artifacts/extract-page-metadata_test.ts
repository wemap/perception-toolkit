/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { extractPageMetadata } from './extract-page-metadata.js';
import { JsonLd } from './schema/json-ld.js';

const { assert } = chai;

function createDocForHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

describe('ExtractPageMetadata', () => {
  it('extract simple page metadata', async () => {
    const url = new URL('https://sample.testpage.dev');
    const expectedPageMetadata: JsonLd = {
      '@type': 'WebPage',
      name: 'Test Title',
      description: 'Test Description',
      image: 'Test Image URL',
      url: url.toString(),
    };
    const html = `
      <!doctype html>
      <html>
      <head>
        <title>${expectedPageMetadata.name}</title>
        <meta name="description" content="${expectedPageMetadata.description}" />
        <meta itemprop="image" content="${expectedPageMetadata.image}" />
      </head>
      <body>
      </body>
      </html>
    `;
    const pageMetadata = await extractPageMetadata(createDocForHTML(html), url);
    assert.deepEqual(pageMetadata, expectedPageMetadata);
  });
});