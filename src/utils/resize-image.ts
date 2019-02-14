/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

/**
 * The supported formats for [[resize]].
 */
export enum ResizeFormat {
  PNG = 'image/png',
  IMAGE_DATA = 'imageData'
}

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
export async function resize(img: HTMLImageElement, {
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    format = ResizeFormat.PNG
  } = {}): Promise<HTMLImageElement | ImageData> {
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
