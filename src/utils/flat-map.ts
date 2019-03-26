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
 * The flatMap() method first maps each element using a mapping function, then flattens the result into a new array.
 * It is identical to a map followed by a flat of depth 1.
 */
export function flatMapPolyfill<T, U>(
      arr: T[],
      callback: (value: T, index: number, array: T[]) => U|ReadonlyArray<U>
    ): U[] {
  // As per: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
  // flatMap is equivalent to map + flat, or reduce + concat.
  // flat() is not available on all platforms, so using reduce + concat
  return arr.reduce((acc: U[], x: T, i: number, arr: T[]) => {
    const val = callback(x, i, arr);
    if (Array.isArray(val)) {
      return acc.concat(val);
    } else {
      acc.push(val as U);
      return acc;
    }
  }, []);
}

export function flatMap<T, U, This = undefined>(
      arr: T[],
      callback: (this: This, value: T, index: number, array: T[]) => U|ReadonlyArray<U>,
      thisArg?: This
    ): U[] {
  if ('flatMap' in Array.prototype) {
    // ts-ignore used to pass karma tests.  TS complains flatMap() is not defined, even though we are feature detecting.
    // @ts-ignore
    return arr.flatMap(callback);
  } else {
    return flatMapPolyfill(arr, callback);
  }
}
