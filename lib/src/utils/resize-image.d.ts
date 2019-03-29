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
