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

import { fade } from './fade.js';

describe('Fade', () => {
  it('fades element', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    await fade(el);

    const opacity = window.getComputedStyle(el).opacity;
    assert.equal(opacity, '0');
  });

  it('accepts fade args', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    await fade(el, { duration: 10, from: 0.5, to: 0.7, ease: (v) => v});

    const opacity = window.getComputedStyle(el).opacity;

    // Go approximate because of floats in JS.
    assert.approximately(Number(opacity), 0.7, 0.01);
  });

  it('cancels existing animations', (done) => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    fade(el).then(() => {
      done();
    });

    fade(el).then(() => {
      done('The first fade promise did not resolve');
    });
  });
});
