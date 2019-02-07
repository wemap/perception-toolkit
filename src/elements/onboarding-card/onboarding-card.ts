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

export class OnboardingCard extends HTMLElement {
  static onboardingFinishedEvent = 'onboardingfinished';
  static itemChangedEvent = 'itemchanged';
  static defaultTagName = 'onboarding-card';
  static get observedAttributes() {
    return ['width', 'height', 'mode'];
  }

  private modeInternal: 'scroll' | 'fade' = 'scroll';
  private itemInternal = 0;
  private itemMax = 0;
  private widthInternal = 0;
  private heightInternal = 0;
  private root = this.attachShadow({ mode: 'open' });
  private observer!: IntersectionObserver;

  private onSlotChangeBound = this.onSlotChange.bind(this);
  private onContainerClickBound = this.onContainerClick.bind(this);
  private onButtonClickBound = this.onButtonClick.bind(this);
  private onIntersectionBound = this.onIntersection.bind(this);

  /* istanbul ignore next */
  constructor() {
    super();
  }

  get width() {
    return this.widthInternal;
  }

  set width(width: number) {
    if (Number.isNaN(width)) {
      width = 0;
    }
    this.setAttribute('width', width.toString());
  }

  get height() {
    return this.heightInternal;
  }

  set height(height: number) {
    if (Number.isNaN(height)) {
      height = 0;
    }
    this.setAttribute('height', height.toString());
  }

  get item() {
    return this.itemInternal;
  }

  set mode(mode: 'scroll' | 'fade') {
    this.setAttribute('mode', mode);
  }

  get mode() {
    return this.modeInternal;
  }

  connectedCallback() {
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
      rootMargin: '-1px'
    });
    this.updateCardDimensions();
    this.observeChildren();

    // Call the slot change callback manually for Safari 12; it doesn't do it
    // automatically for the initial element connection.
    this.onSlotChange();
  }

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

  async next() {
    const from = this.itemInternal;
    this.itemInternal = clamp(this.itemInternal + 1, 0, this.itemMax - 1);
    await this.gotoItem({ from });

    // The user has hit the final item in the list.
    if (from === this.itemInternal) {
      fire(OnboardingCard.onboardingFinishedEvent, this, {id: this.itemInternal});
    }
  }

  async gotoItem({to = this.itemInternal, from = -1} = {}) {
    const elements = this.getSlotElements();
    if (!elements[to] || (from !== -1 && !elements[from]) || from === to) {
      return;
    }

    if (this.mode === 'fade') {
      if (from !== -1) {
        await fade(elements[from] as HTMLElement, { from: 1, to: 0 });
      }
      elements[to].scrollIntoView();
      await fade(elements[to] as HTMLElement, { from: 0, to: 1 });
    } else {
      elements[to].scrollIntoView({ behavior: 'smooth' });
    }
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
      if (!entry.isIntersecting) {
        continue;
      }

      this.itemInternal = elements.indexOf(entry.target);
      fire(OnboardingCard.itemChangedEvent, this, {id: this.itemInternal});
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
