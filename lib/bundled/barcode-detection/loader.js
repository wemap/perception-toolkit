this.PerceptionToolkit = this.PerceptionToolkit || {};
this.PerceptionToolkit.loader = (function (exports) {
  'use strict';

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
  const styles = `
:host {
  --color: #999;
  --dotSize: 8px;
  --dotMargin: 4px;
  display: flex;
}

.dot {
  border-radius: 50%;
  width: var(--dotSize);
  height: var(--dotSize);
  background: var(--color);
  margin: var(--dotMargin);
  animation: bounceHorizontal 1s infinite cubic-bezier(0, 0, 0.4, 1);
}

:host([vertical]) .dot {
  animation-name: bounceVertical;
}

.dot:nth-of-type(2) {
  animation-delay: 0.1s;
}

.dot:nth-of-type(3) {
  animation-delay: 0.2s;
}

.dot:nth-of-type(4) {
  animation-delay: 0.3s;
}

@keyframes bounceHorizontal {
  0% {
    transform: none;
  }

  50% {
    transform: translateX(-10px);
  }

  100% {
    transform: none;
  }
}

@keyframes bounceVertical {
  0% {
    transform: none;
    animation-timing-function: ease-in;
  }

  10% {
    transform: translateY(-4px);
    animation-timing-function: ease-in-out;
  }

  30% {
    transform: translateY(4px);
    animation-timing-function: ease-out;
  }

  40% {
    transform: none;
  }

  100% {
    transform: none;
  }
}
`;
  const html = `
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>`;

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
  class DotLoader extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          this.root = this.attachShadow({ mode: 'open' });
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      connectedCallback() {
          this.root.innerHTML = `<style>${styles}</style> ${html}`;
      }
  }
  /**
   * The Loader's default tag name for registering with `customElements.define`.
   */
  DotLoader.defaultTagName = 'dot-loader';

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
  customElements.define(DotLoader.defaultTagName, DotLoader);
  const loader = new DotLoader();
  loader.style.setProperty('--color', '#FFF');
  // Uncomment for vertical animation.
  // loader.setAttribute('vertical', 'vertical');
  function showLoader() {
      document.body.appendChild(loader);
  }
  function hideLoader() {
      loader.remove();
  }

  exports.showLoader = showLoader;
  exports.hideLoader = hideLoader;

  return exports;

}({}));
