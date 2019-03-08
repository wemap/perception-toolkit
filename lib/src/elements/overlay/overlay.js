/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { styles } from './overlay.template.js';
const overlay = document.createElement('div');
const root = overlay.attachShadow({ mode: 'open' });
root.innerHTML = `<style>${styles}</style><span class="content"><slot></slot></span>`;
/**
 * Shows an overlay message. If there is already an overlay message a second
 * call will update the message rather than create a new overlay.
 */
export function showOverlay(message, target = document.body) {
    overlay.textContent = message;
    target.appendChild(overlay);
    return overlay;
}
/**
 * Hides the overlay if there is one.
 */
export function hideOverlay() {
    overlay.remove();
}
//# sourceMappingURL=overlay.js.map