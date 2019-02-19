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

import { loadImages } from './load-images.js';

const url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxI' +
            'iB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPgo=';
describe('loadImages', () => {
  it('loads images', async () => {
    const images = await loadImages([url]);
    assert.isTrue(images.every(i => i instanceof HTMLImageElement));
  });

  it('throws for invalid images', async () => {
    try {
      await loadImages(['foo']);
      assert.fail('Did not throw on invalid images');
    } catch (e) {
      // No need to check - this failed.
    }
  });
});
