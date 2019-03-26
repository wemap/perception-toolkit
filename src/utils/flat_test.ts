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

import { flat } from './flat.js';

describe('Flat', () => {
  it('flattens 1 level deep', () => {
    assert.deepEqual(flat([1, 2, [3, 4]]), [1, 2, 3, 4]);
  });
  it('flattens only 1 level deep by default', () => {
    assert.deepEqual(flat([1, 2, [3, 4, [5, 6]]]), [1, 2, 3, 4, [5, 6]]);
  });
  it('flattens multiple levels deep when asked', () => {
    assert.deepEqual(flat([1, 2, [3, 4, [5, 6]]], 2), [1, 2, 3, 4, 5, 6]);
  });
  it('removes empty slots in arrays', () => {
    assert.deepEqual(flat([1, 2, /* none */, 4, 5]), [1, 2, 4, 5]);
  });
});
