/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { clamp } from '../../utils/clamp.js';
import { fade } from '../../utils/fade.js';
import { fire } from '../../utils/fire.js';
import { html, styles } from './onboarding-card.template.js';
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
 */
export class OnboardingCard extends HTMLElement {
    /* istanbul ignore next */
    constructor() {
        super();
        this.modeInternal = 'scroll';
        this.itemInternal = 0;
        this.itemMax = 0;
        this.widthInternal = 0;
        this.heightInternal = 0;
        this.root = this.attachShadow({ mode: 'open' });
        this.onSlotChangeBound = this.onSlotChange.bind(this);
        this.onContainerClickBound = this.onContainerClick.bind(this);
        this.onButtonClickBound = this.onButtonClick.bind(this);
        this.onIntersectionBound = this.onIntersection.bind(this);
    }
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
    static get observedAttributes() {
        return ['width', 'height', 'mode'];
    }
    /**
     * Gets & sets the width of the card.
     */
    get width() {
        return this.widthInternal;
    }
    set width(width) {
        if (Number.isNaN(width)) {
            width = 0;
        }
        this.setAttribute('width', width.toString());
    }
    /**
     * Gets & sets the height of the card.
     */
    get height() {
        return this.heightInternal;
    }
    set height(height) {
        if (Number.isNaN(height)) {
            height = 0;
        }
        this.setAttribute('height', height.toString());
    }
    /**
     * Gets the current item's index.
     */
    get item() {
        return this.itemInternal;
    }
    /**
     * Gets & sets the mode of the card. `scroll` autoscrolls between steps,
     * `fade` fades between steps.
     */
    get mode() {
        return this.modeInternal;
    }
    set mode(mode) {
        this.setAttribute('mode', mode);
    }
    /**
     * @ignore Only public because it's a Custom Element.
     */
    connectedCallback() {
        this.root.innerHTML = `<style>${styles}</style> ${html}`;
        const slot = this.root.querySelector('slot');
        const container = this.root.querySelector('#container');
        const buttons = this.root.querySelector('#buttons');
        slot.addEventListener('slotchange', this.onSlotChangeBound);
        container.addEventListener('click', this.onContainerClickBound);
        buttons.addEventListener('click', this.onButtonClickBound);
        this.setAttribute('tabindex', '0');
        this.observer = new IntersectionObserver(this.onIntersectionBound, {
            root: container,
            rootMargin: '-1px'
        });
        this.updateCardDimensions();
        this.observeChildren();
        // Call the slot change callback manually for Safari 12; it doesn't do it
        // automatically for the initial element connection.
        this.onSlotChange();
    }
    /**
     * @ignore Only public because it's a Custom Element.
     */
    disconnectedCallback() {
        const slot = this.root.querySelector('slot');
        const container = this.root.querySelector('#container');
        const buttons = this.root.querySelector('#buttons');
        slot.removeEventListener('slotchange', this.onSlotChangeBound);
        container.removeEventListener('click', this.onContainerClickBound);
        buttons.addEventListener('click', this.onButtonClickBound);
        this.unobserveChildren();
        this.root.innerHTML = ``;
    }
    /**
     * @ignore Only public because it's a Custom Element.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'width': {
                const value = Number(newValue);
                this.widthInternal = Number.isNaN(value) ? 0 : value;
                break;
            }
            case 'height': {
                const value = Number(newValue);
                this.heightInternal = Number.isNaN(value) ? 0 : value;
                break;
            }
            case 'mode':
                this.modeInternal = newValue === 'fade' ? 'fade' : 'scroll';
                break;
        }
        this.updateCardDimensions();
    }
    /**
     * Moves to the next step.
     */
    async next() {
        const from = this.itemInternal;
        this.itemInternal = clamp(this.itemInternal + 1, 0, this.itemMax - 1);
        await this.gotoItem({ from });
        // The user has hit the final item in the list.
        if (from === this.itemInternal) {
            fire(OnboardingCard.onboardingFinishedEvent, this, { id: this.itemInternal });
        }
    }
    /**
     * Jumps to a given item. Accepts an optional object with `from` and `to`
     * numbers indicating the indexes of the item to move from and to,
     * respectively. If not provided, `gotoItem` assumes that there is no `from`
     * and that it ought to go to the current item.
     */
    async gotoItem({ to = this.itemInternal, from = -1 } = {}) {
        const elements = this.getSlotElements();
        if (!elements[to] || (from !== -1 && !elements[from]) || from === to) {
            return;
        }
        if (this.mode === 'fade') {
            if (from !== -1) {
                await fade(elements[from], { from: 1, to: 0 });
            }
            elements[to].scrollIntoView();
            await fade(elements[to], { from: 0, to: 1 });
        }
        else {
            elements[to].scrollIntoView({ behavior: 'smooth' });
        }
    }
    onContainerClick() {
        this.next();
    }
    async onButtonClick(e) {
        const buttons = this.root.querySelector('#buttons');
        let idx = Array.from(buttons.childNodes).indexOf(e.target);
        /* istanbul ignore if */
        if (idx === -1) {
            idx = 0;
        }
        const from = this.itemInternal;
        this.itemInternal = idx;
        await this.gotoItem({ from });
    }
    onIntersection(entries) {
        const elements = this.getSlotElements();
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }
            this.itemInternal = elements.indexOf(entry.target);
            fire(OnboardingCard.itemChangedEvent, this, { id: this.itemInternal });
        }
        const buttons = this.root.querySelectorAll('#buttons button');
        for (const [bIdx, button] of buttons.entries()) {
            button.classList.toggle('active', bIdx === this.itemInternal);
        }
    }
    observeChildren() {
        const elements = this.getSlotElements();
        for (const element of elements) {
            this.observer.observe(element);
        }
    }
    unobserveChildren() {
        // TODO(paullewis): Fire this on mutation events.
        const elements = this.getSlotElements();
        for (const element of elements) {
            this.observer.observe(element);
        }
    }
    getSlotElements() {
        const slot = this.root.querySelector('slot');
        /* istanbul ignore if */
        if (!slot) {
            return [];
        }
        const supportsAssignedElements = 'assignedElements' in slot;
        /* istanbul ignore else */
        if (supportsAssignedElements) {
            return slot.assignedElements();
        }
        else {
            return slot.assignedNodes()
                .filter((node) => node.nodeType === this.ELEMENT_NODE);
        }
    }
    onSlotChange() {
        const buttons = this.root.querySelector('#buttons');
        const elements = this.getSlotElements();
        this.itemMax = elements.length;
        /* istanbul ignore if */
        if (!buttons) {
            return;
        }
        // Create status / control buttons for each state.
        buttons.innerHTML = '';
        for (let i = 0; i < this.itemMax; i++) {
            const button = document.createElement('button');
            button.textContent = `${i + 1}`;
            buttons.appendChild(button);
        }
    }
    updateCardDimensions() {
        const container = this.root.querySelector('#container');
        /* istanbul ignore if */
        if (!container) {
            return;
        }
        container.style.width = `${this.width}px`;
        container.style.height = `${this.height}px`;
    }
}
/**
 * The name of the event fired when the final item has been reached.
 */
OnboardingCard.onboardingFinishedEvent = 'onboardingfinished';
/**
 * The name of the event fired when the item changes.
 */
OnboardingCard.itemChangedEvent = 'itemchanged';
/**
 * The default tag name provided to `customElement.define`.
 */
OnboardingCard.defaultTagName = 'onboarding-card';
//# sourceMappingURL=onboarding-card.js.map