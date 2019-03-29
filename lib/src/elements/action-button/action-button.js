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
import { html, styles } from './action-button.template.js';
/**
 * An action button for use with [[Card]] components.
 *
 * ```javascript
 * // Create an action button, give it a label and a click handler.
 * const button = new ActionButton();
 * button.label = 'Dismiss';
 * button.addEventListener('click', () => {
 *   card.close();
 * });
 *
 * // Now create a card, and append the button to it.
 * const card = new Card();
 * card.src = 'Card with Actions';
 * card.appendChild(button);
 * ```
 */
export class ActionButton extends HTMLElement {
    /* istanbul ignore next */
    constructor() {
        super();
        this.labelInternal = ActionButton.DEFAULT_LABEL;
        this.root = this.attachShadow({ mode: 'open' });
    }
    /**
     * @ignore Only public because it's a Custom Element.
     */
    connectedCallback() {
        this.root.innerHTML = `<style>${styles}</style> ${html}`;
        this.render();
    }
    /**
     * Gets & sets the label for the instance.
     */
    get label() {
        return this.labelInternal;
    }
    set label(label) {
        this.labelInternal = label;
        this.render();
    }
    render() {
        const button = this.root.querySelector('button');
        if (!button) {
            return;
        }
        button.textContent = this.label;
    }
}
/**
 * The ActionButton's default tag name for registering with
 * `customElements.define`.
 */
ActionButton.defaultTagName = 'action-button';
/**
 * The ActionButton's default label.
 */
ActionButton.DEFAULT_LABEL = 'Button';
//# sourceMappingURL=action-button.js.map