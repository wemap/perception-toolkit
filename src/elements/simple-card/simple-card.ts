/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { doubleRaf } from '../../utils/double-raf.js';
import { html, styles } from './simple-card.template.js';

export class SimpleCard extends HTMLElement {
  static defaultTagName = 'simple-card';

  fadeDuration = 200;

  private messageInternal = '';
  private root = this.attachShadow({ mode: 'open' });
  private onClickBound = this.onClick.bind(this);

  constructor() {
    super();

    this.addEventListener('click', this.onClickBound);
  }

  get message() {
    return this.messageInternal;
  }

  set message(message: string) {
    this.messageInternal = message;
    this.render();
  }

  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    this.render();
  }

  async close(fadeDuration = 0) {
    if (fadeDuration === 0) {
      this.remove();
      return;
    }

    setTimeout(() => {
      this.remove();
    }, fadeDuration);
    this.style.transition =
        `opacity ${fadeDuration}ms cubic-bezier(0, 0, 0.3, 1)`;

    await doubleRaf();
    this.style.opacity = '0';
  }

  private async onClick(evt: Event) {
    const clicked =
        evt.path ? evt.path[0] : evt.composedPath()[0] as HTMLElement;
    if (clicked.id !== 'close') {
      return;
    }

    await this.close(this.fadeDuration);
  }

  private render() {
    const container = this.root.querySelector('#container');
    if (!container) {
      return;
    }

    container.textContent = this.message;
  }
}
