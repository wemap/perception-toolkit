/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, styles } from './no-support-card.template.js';

export class NoSupportCard extends HTMLElement {
  static defaultTagName = 'no-support-card';
  static readonly DEFAULT_MESSAGE =
      'Sorry, this browser does not support the required features';
  message = NoSupportCard.DEFAULT_MESSAGE;
  private root = this.attachShadow({ mode: 'open' });

  /* istanbul ignore next */
  constructor() {
    super();
  }

  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;

    const container = this.root.querySelector('#container')!;
    container.textContent = this.message;
  }
}
