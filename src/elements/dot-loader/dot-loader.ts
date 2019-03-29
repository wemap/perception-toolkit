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

import { html, styles } from './dot-loader.template.js';

/**
 * A loader that uses animating dots.
 *
 * ```javascript
 * const loader = new DotLoader();
 * loader.style.setProperty('--color', '#FFF');
 *
 * // Vertical animation.
 * loader.setAttribute('vertical', 'vertical');
 * document.body.appendChild(loader);
 *
 * ```
 *
 * ## Configurable properties.
 *
 * ```css
 * dot-loader {
 *   --color: '#<CSS color>';
 *   --dotSize: '<CSS size>px';
 *   --dotMargin: '<CSS size>px';
 * }
 * ```
 */
export class DotLoader extends HTMLElement {
  /**
   * The Loader's default tag name for registering with `customElements.define`.
   */
  static defaultTagName = 'dot-loader';

  private root = this.attachShadow({ mode: 'open' });

  /* istanbul ignore next */
  constructor() {
    super();
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
  }
}
