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

import { IntersectionObserverSupport } from '../../support/intersection-observer.js';
import { clamp } from '../../utils/clamp.js';
import { fade } from '../../utils/fade.js';
import { fire } from '../../utils/fire.js';
import { injectScript } from '../../utils/inject-script.js';
import { DEBUG_LEVEL, log } from '../../utils/logger.js';
import { html, styles } from './onboarding-card.template.js';

const IO_POLYFILL_PATH =
  '/third_party/intersection-observer/intersection-observer-polyfill.js';

/* istanbul ignore next: Not testing polyfill injection x-browser */
/**
 * @ignore
 */
export async function loadIntersectionObserverPolyfillIfNeeded({
      force = false, polyfillPrefix = ''}) {
  if (!force && await IntersectionObserverSupport.supported()) {
    return true;
  }

  try {
    await injectScript(`${polyfillPrefix}${IO_POLYFILL_PATH}`);

    // Force the polyfill to check every 300ms.
    (IntersectionObserver as any).prototype.POLL_INTERVAL = 300;
    log('Loaded IntersectionObserver polyfill', DEBUG_LEVEL.INFO, 'Onboarding');

    return true;
  } catch (e) {
    log('Intersection Observer polyfill load failed', DEBUG_LEVEL.ERROR,
        'Onboarding');
    return false;
  }
}

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
export class OnboardingCard extends HTMLElement {
  /**
   * The name of the event fired when the final item has been reached.
   */
  static onboardingFinishedEvent = 'onboardingfinished';

  /**
   * The name of the event fired when the item changes.
   */
  static itemChangedEvent = 'itemchanged';

  /**
   * The default tag name provided to `customElement.define`.
   */
  static defaultTagName = 'onboarding-card';

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

  ready: Promise<boolean>;

  private readonly root = this.attachShadow({ mode: 'open' });
  private readonly itemsInView = new Set<Element>();
  private modeInternal: 'scroll' | 'fade' = 'scroll';
  private itemInternal = 0;
  private itemMax = 0;
  private widthInternal = 0;
  private heightInternal = 0;
  private observer!: IntersectionObserver;

  private onSlotChangeBound = this.onSlotChange.bind(this);
  private onContainerClickBound = this.onContainerClick.bind(this);
  private onButtonClickBound = this.onButtonClick.bind(this);
  private onIntersectionBound = this.onIntersection.bind(this);

  /* istanbul ignore next */
  constructor({ polyfillPrefix = ''} = {}) {
    super();

    this.ready = loadIntersectionObserverPolyfillIfNeeded({ polyfillPrefix });
  }

  /**
   * Gets & sets the width of the card.
   */
  get width() {
    return this.widthInternal;
  }

  set width(width: number) {
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

  set height(height: number) {
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

  set mode(mode: 'scroll' | 'fade') {
    this.setAttribute('mode', mode);
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  connectedCallback() {
    // Await the polyfill then go ahead.
    this.ready.then(() => {
      this.root.innerHTML = `<style>${styles}</style> ${html}`;
      const slot = this.root.querySelector('slot')!;
      const container = this.root.querySelector('#container')!;
      const buttons = this.root.querySelector('#buttons')!;
      slot.addEventListener('slotchange', this.onSlotChangeBound);
      container.addEventListener('click', this.onContainerClickBound);
      buttons.addEventListener('click', this.onButtonClickBound);

      this.setAttribute('tabindex', '0');

      this.observer = new IntersectionObserver(this.onIntersectionBound, {
        root: container,
        rootMargin: '-5px',
        threshold: 0
      });
      this.updateCardDimensions();
      this.observeChildren();

      // Call the slot change callback manually for Safari 12; it doesn't do it
      // automatically for the initial element connection.
      this.onSlotChange();
    });
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  disconnectedCallback() {
    const slot = this.root.querySelector('slot')!;
    const container = this.root.querySelector('#container')!;
    const buttons = this.root.querySelector('#buttons')!;
    slot.removeEventListener('slotchange', this.onSlotChangeBound);
    container.removeEventListener('click', this.onContainerClickBound);
    buttons.addEventListener('click', this.onButtonClickBound);

    this.unobserveChildren();
    this.root.innerHTML = ``;
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
      fire(OnboardingCard.onboardingFinishedEvent, this,
           { item: this.itemInternal });
    }
  }

  /**
   * Jumps to a given item. Accepts an optional object with `from` and `to`
   * numbers indicating the indexes of the item to move from and to,
   * respectively. If not provided, `gotoItem` assumes that there is no `from`
   * and that it ought to go to the current item.
   */
  async gotoItem({to = this.itemInternal, from = -1} = {}) {
    const elements = this.getSlotElements();
    if (!elements[to] || (from !== -1 && !elements[from]) || from === to) {
      return;
    }

    if (this.mode === 'fade') {
      if (from !== -1) {
        await fade(elements[from] as HTMLElement, { from: 1, to: 0 });

        // Bring the faded out element back up to 1 so that scrolling still
        // works as intended.
        (elements[from] as HTMLElement).style.opacity = '1';
      }
      elements[to].scrollIntoView();
      this.itemsInView.add(elements[to]);
      await fade(elements[to] as HTMLElement, { from: 0, to: 1 });
    } else {
      elements[to].scrollIntoView({ behavior: 'smooth' });
    }

    this.setLabel();
  }

  private setLabel() {
    const elements = this.getSlotElements();
    if (!elements[this.item]) {
      return;
    }

    this.setAttribute('aria-label', elements[this.item].getAttribute('alt') ||
        'No description provided');
  }

  private onContainerClick() {
    this.next();
  }

  private async onButtonClick(e: Event) {
    const buttons = this.root.querySelector('#buttons') as HTMLElement;
    let idx = Array.from(buttons.childNodes).indexOf(e.target as HTMLElement);
    /* istanbul ignore if */
    if (idx === -1) {
      idx = 0;
    }
    const from = this.itemInternal;
    this.itemInternal = idx;
    await this.gotoItem({ from });
  }

  private onIntersection(entries: IntersectionObserverEntry[]) {
    const elements = this.getSlotElements();
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.itemsInView.add(entry.target);
      } else {
        this.itemsInView.delete(entry.target);
      }

      // Whenever the set of visible elements dips to 1 find the element.
      if (this.itemsInView.size !== 1) {
        continue;
      }
      const items = Array.from(this.itemsInView);
      this.itemInternal = elements.indexOf(items[0]);

      fire(OnboardingCard.itemChangedEvent, this, { item: this.itemInternal });
    }

    const buttons = this.root.querySelectorAll('#buttons button');
    for (const [bIdx, button] of buttons.entries()) {
      button.classList.toggle('active', bIdx === this.itemInternal);
    }
  }

  private observeChildren() {
    const elements = this.getSlotElements();
    for (const element of elements) {
      this.observer.observe(element);
    }
  }

  private unobserveChildren() {
    // TODO(paullewis): Fire this on mutation events.
    const elements = this.getSlotElements();
    for (const element of elements) {
      this.observer.observe(element);
    }
  }

  private getSlotElements() {
    const slot = this.root.querySelector('slot') as HTMLSlotElement;
    /* istanbul ignore if */
    if (!slot) {
      return [];
    }

    const supportsAssignedElements = 'assignedElements' in slot;
    /* istanbul ignore else */
    if (supportsAssignedElements) {
      return slot.assignedElements();
    } else {
      return slot.assignedNodes()
          .filter((node) => node.nodeType === this.ELEMENT_NODE) as Element[];
    }
  }

  private onSlotChange() {
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

    this.setLabel();
  }

  private updateCardDimensions() {
    const container = this.root.querySelector('#container') as HTMLElement;

    /* istanbul ignore if */
    if (!container) {
      return;
    }

    container.style.width = `${this.width}px`;
    container.style.height = `${this.height}px`;
  }
}
