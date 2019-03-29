/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
