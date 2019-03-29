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
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
/**
 * The supported formats for [[resize]].
 */
export var ResizeFormat;
(function (ResizeFormat) {
    ResizeFormat["PNG"] = "image/png";
    ResizeFormat["IMAGE_DATA"] = "imageData";
})(ResizeFormat || (ResizeFormat = {}));
/** @ignore */
export const DEFAULT_WIDTH = 100;
/** @ignore */
export const DEFAULT_HEIGHT = 100;
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
export async function resize(img, { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, format = ResizeFormat.PNG } = {}) {
    canvas.width = width;
    canvas.height = height;
    const maxDim = Math.min(img.naturalWidth, img.naturalHeight);
    const newWidth = (img.naturalWidth / maxDim) * width;
    const newHeight = (img.naturalHeight / maxDim) * width;
    const x = (width - newWidth) / 2;
    const y = (height - newHeight) / 2;
    ctx.drawImage(img, x, y, newWidth, newHeight);
    switch (format) {
        case ResizeFormat.PNG: {
            const resizedImage = new Image();
            resizedImage.src = canvas.toDataURL(ResizeFormat.PNG);
            return new Promise((resolve) => {
                resizedImage.onload = () => resolve(resizedImage);
            });
        }
        case ResizeFormat.IMAGE_DATA:
            return Promise.resolve(ctx.getImageData(0, 0, width, height));
    }
}
//# sourceMappingURL=resize-image.js.map