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

import { flatMap } from './flat-map.js';

describe('FlatMap', () => {
  const arr1 = [1, 2, 3, 4];

  it('maps just like map when there is no nesting', () => {
    assert.deepEqual(flatMap(arr1, x => x * 2), arr1.map(x => x * 2));
  });

  it('maps and flattens one level deep', () => {
    assert.deepEqual(flatMap(arr1, x => [x * 2]), [2, 4, 6, 8]);
  });

  it('flattens exactly one level deep', () => {
    assert.deepEqual(flatMap(arr1, x => [[x * 2]]), [[2], [4], [6], [8]]);
  });

  it('handles n:m input:output elements', () => {
    // As per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
    assert.deepEqual(
      flatMap(
        [5, 4, -3, 20, 17, -33, -4, 18],
        (n) => (n < 0) ? [] : (n % 2 === 0) ? [n] : [n - 1, 1]
      ),
      [4, 1, 4, 20, 16, 1, 18]
    );
  });
});
