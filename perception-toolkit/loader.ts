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

import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';

customElements.define(DotLoader.defaultTagName, DotLoader);

const loader = new DotLoader();
loader.style.setProperty('--color', '#FFF');

// Uncomment for vertical animation.
// loader.setAttribute('vertical', 'vertical');

/**
 * @hidden
 */
export function showLoader() {
  document.body.appendChild(loader);
}

/**
 * @hidden
 */
export function hideLoader() {
  loader.remove();
}
