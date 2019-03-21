/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * The flat() method creates a new array with all sub-array elements concatenated into it.
 * Unlike Array.prototoype.flat, does not support recursively flattening up to the specified depth.
 */
export function flat(arr: any[]): any[] {
  /*
  if ('flat' in arr) {
    return (arr as any[]).flat();
  }
  */
  // As Per: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
  // flat() is equivalent to:
  return arr.reduce((acc, val) => acc.concat(val), []);
}
