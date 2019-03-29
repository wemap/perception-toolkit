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
declare global {
    interface Event {
        path: Element[];
    }
}
export interface CardData {
    name?: string;
    disambiguatingDescription?: string;
    description?: string;
    image?: string;
    price?: {
        value: string;
        currency: string;
    };
    url?: string;
}
/**
 * A data card for information output.
 *
 * ```javascript
 * // Text card.
 * const card = new Card();
 * card.src = 'Card Message';
 *
 * // Or iframe some content in. By default the card supports same-origin
 * // content.
 * card.src = new URL('http://example.com');
 * ```
 */
export declare class Card extends HTMLElement {
    /**
     * The Cards's default tag name for registering with `customElements.define`.
     */
    static defaultTagName: string;
    /**
     * The duration of the card's fade animation when dismissed.
     */
    fadeDuration: number;
    /**
     * The sandbox attributes to use for card sources that are iframed in. By
     * default the iframed content is assumed to be same origin but not allowed to
     * execute scripts.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
     */
    sandboxAttribute: string;
    private srcInternal;
    private widthInternal;
    private heightInternal;
    private root;
    private onClickBound;
    constructor();
    /**
     * Gets & sets the src for the card. If the src is a URL the content is
     * `iframe`'d in using a sandbox that disallows
     */
    src: string | URL | CardData;
    /**
     * Gets & sets the width of the card.
     */
    width: number | undefined;
    /**
     * Gets & sets the height of the card.
     */
    height: number | undefined;
    /**
     * @ignore Only public because it's a Custom Element.
     */
    connectedCallback(): void;
    /**
     * @ignore Only public because it's a Custom Element.
     */
    disconnectedCallback(): void;
    /**
     * Closes the card with an optional fade.
     */
    close(fadeDuration?: number): Promise<void>;
    private onClick;
    private render;
    private renderCardData;
    private srcIsString;
    private srcIsCardData;
    private srcIsUrl;
    private setDimensions;
}
