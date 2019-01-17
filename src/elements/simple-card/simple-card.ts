/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, styles } from './simple-card.template.js';

export class SimpleCard extends HTMLElement {
  static defaultTagName = 'simple-card';
  private messageInternal = '';
  private root = this.attachShadow({ mode: 'open' });

  get message() {
    return this.messageInternal;
  }

  set message(message: string) {
    this.messageInternal = message;
  }

  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    this.render();
  }

  private render() {
    const container = this.root.querySelector('#container')!;
    container.textContent = this.message;
  }
}

customElements.define(SimpleCard.defaultTagName, SimpleCard);
