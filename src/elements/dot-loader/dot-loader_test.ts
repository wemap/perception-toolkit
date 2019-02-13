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

import { DotLoader } from './dot-loader.js';
customElements.define(DotLoader.defaultTagName, DotLoader);

function createLoader() {
  const card = new DotLoader();
  document.body.appendChild(card);
  return card;
}

describe('DotLoader', () => {
  afterEach(() => {
    const loaders = document.body.querySelectorAll(DotLoader.defaultTagName);
    for (const loader of loaders) {
      loader.remove();
    }
  });

  it('should create dots', (done) => {
    const card = createLoader();

    // Wait a frame to ensure rendering happened.
    requestAnimationFrame(() => {
      assert.isAtLeast(card.shadowRoot!.querySelectorAll('.dot').length, 1);
      done();
    });
  });
});
