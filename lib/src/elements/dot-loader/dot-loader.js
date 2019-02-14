/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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
//# sourceMappingURL=dot-loader.js.map