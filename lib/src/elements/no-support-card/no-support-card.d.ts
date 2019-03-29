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
 * A card to use when the browser does not support the various APIs your
 * experience requires.
 *
 * ```javascript
 * const noSupport = new NoSupportCard();
 * document.body.appendChild(noSupport);
 * ```
 */
export declare class NoSupportCard extends HTMLElement {
    /**
     * The Card's default tag name for registering with `customElements.define`.
     */
    static defaultTagName: string;
    /**
     * @ignore Only exposed for testing.
     */
    static readonly DEFAULT_MESSAGE = "Sorry, this browser does not support the required features";
    /**
     * The message to share with users.
     */
    message: string;
    private root;
    constructor();
    /**
     * @ignore Only public because it's a Custom Element.
     */
    connectedCallback(): void;
}
