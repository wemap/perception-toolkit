/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
declare function easeOut(value: number): number;
/**
 * Fades an element using `requestAnimationFrame`. Takes a parameter detailing
 * the animation, which is an object containing `to` (`0 <= to <= 1`), `from`
 * (`0 <= to <= 1`), duration (milliseconds), and `ease` (a function that takes
 * a value between `0` and `1` and returns a new value, also between `0` and
 * `1`) properties.
 *
 * ```javascript
 * fade(someElement, { from: 1, to: 1, duration: 200, ease: (v) => v })
 * ```
 *
 * @param target The element to fade.
 */
export declare function fade(target: HTMLElement, { from, to, duration, ease }?: {
    from?: number | undefined;
    to?: number | undefined;
    duration?: number | undefined;
    ease?: typeof easeOut | undefined;
}): Promise<void>;
export {};
