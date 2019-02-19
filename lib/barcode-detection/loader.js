/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
customElements.define(DotLoader.defaultTagName, DotLoader);
const loader = new DotLoader();
loader.style.setProperty('--color', '#FFF');
// Uncomment for vertical animation.
// loader.setAttribute('vertical', 'vertical');
export function showLoader() {
    document.body.appendChild(loader);
}
export function hideLoader() {
    loader.remove();
}
//# sourceMappingURL=loader.js.map