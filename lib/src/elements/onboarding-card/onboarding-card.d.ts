/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
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
    private modeInternal;
    private itemInternal;
    private itemMax;
    private widthInternal;
    private heightInternal;
    private root;
    private observer;
    private onSlotChangeBound;
    private onContainerClickBound;
    private onButtonClickBound;
    private onIntersectionBound;
    constructor();
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
