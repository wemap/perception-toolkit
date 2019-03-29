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

import { DotLoader } from './dot-loader.js';
customElements.define(DotLoader.defaultTagName, DotLoader);

function createLoader() {
  const card = new DotLoader();
  document.body.appendChild(card);
  return card;
}

describe('DotLoader', () => {
  afterEach(() => {
    const loaders = document.body.querySelectorAll(DotLoader.defaultTagName);
    for (const loader of loaders) {
      loader.remove();
    }
  });

  it('should create dots', (done) => {
    const card = createLoader();

    // Wait a frame to ensure rendering happened.
    requestAnimationFrame(() => {
      assert.isAtLeast(card.shadowRoot!.querySelectorAll('.dot').length, 1);
      done();
    });
  });
});
