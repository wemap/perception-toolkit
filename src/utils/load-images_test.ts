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

import { loadImages } from './load-images.js';

const url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxI' +
            'iB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPgo=';
describe('loadImages', () => {
  it('loads images', async () => {
    const images = await loadImages([url]);
    assert.isTrue(images.every(i => i instanceof HTMLImageElement));
  });

  it('throws for invalid images', async () => {
    try {
      await loadImages(['foo']);
      assert.fail('Did not throw on invalid images');
    } catch (e) {
      // No need to check - this failed.
    }
  });
});
