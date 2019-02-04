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

import { isImageData } from './is-image-data.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, resize, ResizeFormat } from './resize-image.js';

async function makeImage(src: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
  });
}

describe('Resize Image', () => {
  it('resizes images to defaults', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;

    const img = await makeImage(canvas.toDataURL('image/png'));
    const resizedImg = await resize(img);
    assert.equal(resizedImg.width, DEFAULT_WIDTH);
    assert.equal(resizedImg.height, DEFAULT_HEIGHT);
  });

  it('resizes images to custom sizes', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;

    const width = 300;
    const height = 200;
    const img = await makeImage(canvas.toDataURL('image/png'));
    const resizedImg = await resize(img, { width, height });
    assert.equal(resizedImg.width, width);
    assert.equal(resizedImg.height, height);
  });

  it('returns PNG', async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = await makeImage(canvas.toDataURL('image/png'));
    const resizedImg = await resize(img, { format: ResizeFormat.PNG });

    assert.isNotOk(isImageData(resizedImg));
  });

  it('returns image data', async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = await makeImage(canvas.toDataURL('image/png'));
    const resizedImg = await resize(img, { format: ResizeFormat.IMAGE_DATA });

    assert.ok(isImageData(resizedImg));
  });

  it('centers resized images', async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 500;
    canvas.height = 300;

    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 250, 300);

    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(250, 0, 250, 300);

    const img = await makeImage(canvas.toDataURL('image/png'));
    const resizedImg = await resize(img, { format: ResizeFormat.IMAGE_DATA });

    if (!isImageData(resizedImg)) {
      throw new Error('Expected image data');
    }

    const xLeft = Math.floor(resizedImg.width * 0.49);
    const xRight = Math.floor(resizedImg.width * 0.51);

    // Left.
    assert.equal(resizedImg.data[xLeft * 4], 255); // R
    assert.equal(resizedImg.data[xLeft * 4 + 1], 0); // G
    assert.equal(resizedImg.data[xLeft * 4 + 2], 0); // B

    // Right.
    assert.equal(resizedImg.data[xRight * 4], 0); // R
    assert.equal(resizedImg.data[xRight * 4 + 1], 255); // G
    assert.equal(resizedImg.data[xRight * 4 + 2], 0); // B
  });
});
