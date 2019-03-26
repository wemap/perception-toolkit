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

import { extractCardDataFromDoc } from './extract-card-data.js';
import { CardData } from '../elements/card/card.js';

function createDocForHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

describe('Clamp', () => {
  it('clamps min', async () => {
    const url = new URL('https://sample.testpage.dev');
    const expectedCardData: CardData = {
      name: 'Test Title',
      description: 'Test Description',
      image: 'Test Image URL',
      url: url.toString(),
    };
    const html = `
      <!doctype html>
      <html>
      <head>
        <title>${expectedCardData.name}</title>
        <meta name="description" content="${expectedCardData.description}" />
        <meta itemprop="image" content="${expectedCardData.image}" />
      </head>
      <body>
      </body>
      </html>
    `;
    assert.deepEqual(await extractCardDataFromDoc(createDocForHTML(html), url), expectedCardData);
  });
});