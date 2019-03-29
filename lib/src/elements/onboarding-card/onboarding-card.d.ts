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
 * @ignore
 */
export declare function loadIntersectionObserverPolyfillIfNeeded({ force, polyfillPrefix }: {
    force?: boolean | undefined;
    polyfillPrefix?: string | undefined;
}): Promise<boolean>;
/**
 * Provides a mechanism for onboarding users to your experience. Each child node
 * of the element is assumed to be a discrete step in the process.
 *
 * ```html
 * <onboarding-card width="327" height="376" mode="scroll">
 *   <img src="images/step1.png" width="327" height="376">
 *   <img src="images/step2.png" width="327" height="376">
 *   <img src="images/step3.png" width="327" height="376">
 * </onboarding-card>
 * ```
 *
 * The element can be further customized via CSS properties:
 *
 * ```css
 * onboarding-card {
 *   --background: #FFF;
 *   --borderRadius: 4px;
 *   --color: #333;
 *   --fontFamily: 'Arial', 'Helvetica', sans-serif;
 *   --padding: 8px 8px 36px 8px;
 *   --buttonBottomMargin: 8px;
 *   --buttonSideMargin: 4px;
 *   --buttonActiveColor: #444;
 *   --buttonHoverColor: #666;
 *   --buttonInactiveColor: #AAA;
 *   --contentBorderRadius: 0px;
 * }
 * ```
 */
export declare class OnboardingCard extends HTMLElement {
    /**
     * The name of the event fired when the final item has been reached.
     */
    static onboardingFinishedEvent: string;
    /**
     * The name of the event fired when the item changes.
     */
    static itemChangedEvent: string;
    /**
     * The default tag name provided to `customElement.define`.
     */
    static defaultTagName: string;
    /**
     * @ignore
     *
     * The attributes supported by the card:
     * <ul>
     *  <li>`width`: The width of the card.</li>
     *  <li>`height`: The height of the card.</li>
     *  <li>`mode`: The mode of the card, `scroll` or `fade`.</li>
     * </ul>
     */
    static readonly observedAttributes: string[];
    ready: Promise<boolean>;
    private readonly root;
    private readonly itemsInView;
    private modeInternal;
    private itemInternal;
    private itemMax;
    private widthInternal;
    private heightInternal;
    private observer;
    private onSlotChangeBound;
    private onContainerClickBound;
    private onButtonClickBound;
    private onIntersectionBound;
    constructor({ polyfillPrefix }?: {
        polyfillPrefix?: string | undefined;
    });
    /**
     * Gets & sets the width of the card.
     */
    width: number;
    /**
     * Gets & sets the height of the card.
     */
    height: number;
    /**
     * Gets the current item's index.
     */
    readonly item: number;
    /**
     * Gets & sets the mode of the card. `scroll` autoscrolls between steps,
     * `fade` fades between steps.
     */
    mode: 'scroll' | 'fade';
    /**
     * @ignore Only public because it's a Custom Element.
     */
    connectedCallback(): void;
    /**
     * @ignore Only public because it's a Custom Element.
     */
    disconnectedCallback(): void;
    /**
     * @ignore Only public because it's a Custom Element.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    /**
     * Moves to the next step.
     */
    next(): Promise<void>;
    /**
     * Jumps to a given item. Accepts an optional object with `from` and `to`
     * numbers indicating the indexes of the item to move from and to,
     * respectively. If not provided, `gotoItem` assumes that there is no `from`
     * and that it ought to go to the current item.
     */
    gotoItem({ to, from }?: {
        to?: number | undefined;
        from?: number | undefined;
    }): Promise<void>;
    private setLabel;
    private onContainerClick;
    private onButtonClick;
    private onIntersection;
    private observeChildren;
    private unobserveChildren;
    private getSlotElements;
    private onSlotChange;
    private updateCardDimensions;
}
