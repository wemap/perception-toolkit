
/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { getLocal } from 'mockttp';
import { fetchAsDocument } from './fetch-as-document.js';

const { assert } = chai;

describe('FetchAsDocument', () => {
  const mockServer = getLocal();

  // Start a server
  beforeEach(() => mockServer.start());
  afterEach(() => mockServer.stop());

  it('simple fetch', async () => {
    const html = `<html></html>`;
    const url = '/test_data/test_page.html';
    await mockServer.get(url).thenReply(200, html);

    const doc = await fetchAsDocument(mockServer.urlFor(url));
    assert.isNotNull(doc);

    const docAsString = new XMLSerializer().serializeToString(document);
    assert.equal(docAsString, html);
  });
});
