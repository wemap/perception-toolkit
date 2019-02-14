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
 * The supported formats for [[resize]].
 */
export declare enum ResizeFormat {
    PNG = "image/png",
    IMAGE_DATA = "imageData"
}
/** @ignore */
export declare const DEFAULT_WIDTH = 100;
/** @ignore */
export declare const DEFAULT_HEIGHT = 100;
/**
 * Resizes an image element.
 *
 * The second parameter is an object detailing the resize:
 *
 * ```javascript
 * const resizedImg = await resize(img, {
 *   width: 300,
 *   height: 300,
 *   format: ResizeFormat.PNG
 * })
 * ```
 *
 * All properties of the object are optional.
 */
export declare function resize(img: HTMLImageElement, { width, height, format }?: {
    width?: number | undefined;
    height?: number | undefined;
    format?: ResizeFormat | undefined;
}): Promise<HTMLImageElement | ImageData>;
