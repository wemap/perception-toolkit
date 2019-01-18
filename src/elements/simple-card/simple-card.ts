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

  private srcInternal: string | URL = '';
  private widthInternal: number | undefined;
  private heightInternal: number | undefined;
  private root = this.attachShadow({ mode: 'open' });
  private onClickBound = this.onClick.bind(this);

  constructor() {
    super();

    this.addEventListener('click', this.onClickBound);
  }

  get src() {
    return this.srcInternal;
  }

  set src(src: string | URL) {
    this.srcInternal = src;
    this.render();
  }

  get width() {
    return this.widthInternal;
  }

  set width(width: number | undefined) {
    this.widthInternal = width;
    this.setDimensions();
  }

  get height() {
    return this.heightInternal;
  }

  set height(height: number | undefined) {
    this.heightInternal = height;
    this.setDimensions();
  }

  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    this.render();
    this.setDimensions();
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
    const container = this.root.querySelector('#container') as HTMLElement;
    if (!container) {
      return;
    }

    if (this.srcIsString(this.src)) {
      container.textContent = this.src;
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = this.src.toString();
      iframe.setAttribute('sandbox', 'allow-same-origin');
      iframe.style.border = 'none';
      iframe.id = 'external-content';
      iframe.width = (this.width || 0).toString();
      iframe.height = (this.height || 0).toString();

      container.appendChild(iframe);
    }
  }

  private srcIsString(msg: string | URL): msg is string {
    return typeof msg === 'string';
  }

  private setDimensions() {
    const container = this.root.querySelector('#container') as HTMLElement;
    if (!container) {
      return;
    }

    if (this.widthInternal) {
      container.style.width = `${this.widthInternal}px`;
    }

    if (this.heightInternal) {
      container.style.height = `${this.heightInternal}px`;
    }
  }
}
