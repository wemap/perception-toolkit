/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, styles } from './onboarding-card.template.js';

export class OnboardingCard extends HTMLElement {
  static defaultTagName = 'onboarding-card';
  static get observedAttributes() {
    return ['width', 'height'];
  }
  private item = 0;
  private itemMax = 0;
  private widthInternal = 0;
  private heightInternal = 0;
  private root = this.attachShadow({ mode: 'open' });
  private onSlotChangeBound = this.onSlotChange.bind(this);
  private onContainerClickBound = this.onContainerClick.bind(this);
  private onButtonClickBound = this.onButtonClick.bind(this);
  private onIntersectionBound = this.onIntersection.bind(this);
  private observer!: IntersectionObserver;

  get width() {
    return this.widthInternal;
  }

  set width(width: number) {
    this.setAttribute('width', width.toString());
  }

  get height() {
    return this.heightInternal;
  }

  set height(height: number) {
    this.setAttribute('height', height.toString());
  }

  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    const slot = this.root.querySelector('slot')!;
    const container = this.root.querySelector('#container')!;
    const buttons = this.root.querySelector('#buttons')!;
    slot.addEventListener('slotchange', this.onSlotChangeBound);
    container.addEventListener('click', this.onContainerClickBound);
    buttons.addEventListener('click', this.onButtonClickBound);

    this.observer = new IntersectionObserver(this.onIntersectionBound, {
      root: container,
      rootMargin: '-1px'
    });
    this.updateCardDimensions();
    this.observeChildren();
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
    const value = Number(newValue);

    switch (name) {
      case 'width':
        this.widthInternal = Number.isNaN(value) ? 0 : value;
        break;

      case 'height':
        this.heightInternal = Number.isNaN(value) ? 0 : value;
        break;
    }

    this.updateCardDimensions();
  }

  next() {
    this.item++;
    this.gotoItem();
  }

  private gotoItem(idx = this.item) {
    const elements = this.getSlotElements();
    if (!elements[idx]) {
      return;
    }

    elements[idx].scrollIntoView({ behavior: 'smooth' });
  }

  private onContainerClick() {
    this.next();
  }

  private onButtonClick(e: Event) {
    const buttons = this.root.querySelector('#buttons') as HTMLElement;
    let idx = Array.from(buttons.childNodes).indexOf(e.target as HTMLElement);
    if (idx === -1) {
      idx = 0;
    }
    this.item = idx;
    this.gotoItem();
  }

  private onIntersection(entries: IntersectionObserverEntry[]) {
    const elements = this.getSlotElements();
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      console.log(this.item);

      this.item = elements.indexOf(entry.target);
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
    if (!slot) {
      return [];
    }

    const supportsAssignedElements = 'assignedElements' in slot;
    if (supportsAssignedElements) {
      return slot.assignedElements();
    } else {
      return slot.assignedNodes()
          .filter((node) => node.nodeType === this.ELEMENT_NODE) as Element[];
    }
  }

  private onSlotChange() {
    const elements = this.getSlotElements();
    this.itemMax = elements.length;

    // Create status / control buttons for each state.
    const buttons = this.root.querySelector('#buttons');
    if (!buttons) {
      return;
    }

    buttons.innerHTML = '';
    for (let i = 0; i < this.itemMax; i++) {
      const button = document.createElement('button');
      button.textContent = `${i + 1}`;
      buttons.appendChild(button);
    }
  }

  private updateCardDimensions() {
    const container = this.root.querySelector('#container') as HTMLElement;
    if (!container) {
      return;
    }

    container.style.width = `${this.width}px`;
    container.style.height = `${this.height}px`;
  }
}
