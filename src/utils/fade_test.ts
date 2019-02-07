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

import { fade } from './fade.js';

describe('Fade', () => {
  it('fades element', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    await fade(el);

    const opacity = window.getComputedStyle(el).opacity;
    assert.equal(opacity, '0');
  });

  it('accepts fade args', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    await fade(el, { duration: 10, from: 0.5, to: 0.7, ease: (v) => v});

    const opacity = window.getComputedStyle(el).opacity;

    // Go approximate because of floats in JS.
    assert.approximately(Number(opacity), 0.7, 0.01);
  });

  it('cancels existing animations', (done) => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    fade(el).then(() => {
      done();
    });

    fade(el).then(() => {
      done('The first fade promise did not resolve');
    });
  });
});
