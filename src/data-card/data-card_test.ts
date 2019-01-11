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

import { XRDataCard } from './data-card.js';

describe('XRDataCard', () => {
  describe('Lifecycle', () => {
    it('should have the correct tag', () => {
      assert(XRDataCard.tagName, 'xr-data-card');
    });

    it('should set its content', (done) => {
      const card = document.createElement(XRDataCard.tagName);
      document.body.appendChild(card);

      // Wait a frame to ensure rendering happened.
      requestAnimationFrame(() => {
        assert(card.shadowRoot!.textContent, 'Data Card');
        card.remove();
        done();
      });
    });
  });
});
