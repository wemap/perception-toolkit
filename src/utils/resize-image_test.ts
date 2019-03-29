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
