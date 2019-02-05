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

import { clamp } from './clamp.js';

describe('Clamp', () => {
  it('clamps min', () => {
    assert.equal(clamp(20, 40), 40);
  });

  it('clamps max', () => {
    assert.equal(clamp(20, 0, 10), 10);
  });

  it('does not change in-range values', () => {
    assert.equal(clamp(20, 10, 30), 20);
  });

  it('does not change unclamped values', () => {
    assert.equal(clamp(20), 20);
  });
});
