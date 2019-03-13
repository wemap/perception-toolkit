
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

import { hideOverlay, showOverlay } from './overlay.js';

describe('StreamCapture', function() {
  it('shows and hides overlays', () => {
    const message = 'Hello, World';
    const overlay = showOverlay(message);

    assert.exists(overlay.shadowRoot!.querySelector('.content'));
    assert.equal(overlay.textContent, message);

    hideOverlay();
    assert.notExists(document.body.querySelector('.content'));
  });

  it('handles hiding non-existent overlays', () => {
    assert.doesNotThrow(() => hideOverlay());
  });
});
