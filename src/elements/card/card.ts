/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

declare global {
  interface Event {
    path: Element[];
  }
}

import { fade } from '../../utils/fade.js';
import { html, styles } from './card.template.js';

/**
 * A data card for information output.
 *
 * ```javascript
 * // Text card.
 * const card = new Card();
 * card.src = 'Card Message';
 *
 * // Or iframe some content in. By default the card supports same-origin
 * // content.
 * card.src = new URL('http://example.com');
 * ```
 */
export class Card extends HTMLElement {
  /**
   * The Cards's default tag name for registering with `customElements.define`.
   */
  static defaultTagName = 'data-card';

  /**
   * The duration of the card's fade animation when dismissed.
   */
  fadeDuration = 200;

  /**
   * The sandbox attributes to use for card sources that are iframed in. By
   * default the iframed content is assumed to be same origin but not allowed to
   * execute scripts.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
   */
  sandboxAttribute: string = 'allow-same-origin';

  private srcInternal: string | URL = '';
  private widthInternal: number | undefined;
  private heightInternal: number | undefined;
  private root = this.attachShadow({ mode: 'open' });
  private onClickBound = this.onClick.bind(this);

  /* istanbul ignore next */
  constructor() {
    super();
  }

  /**
   * Gets & sets the src for the card. If the src is a URL the content is
   * `iframe`'d in using a sandbox that disallows
   */
  get src() {
    return this.srcInternal;
  }

  set src(src: string | URL) {
    this.srcInternal = src;
    this.render();
  }

  /**
   * Gets & sets the width of the card.
   */
  get width() {
    return this.widthInternal;
  }

  set width(width: number | undefined) {
    this.widthInternal = width;
    this.setDimensions();
  }

  /**
   * Gets & sets the height of the card.
   */
  get height() {
    return this.heightInternal;
  }

  set height(height: number | undefined) {
    this.heightInternal = height;
    this.setDimensions();
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    this.render();
    this.setDimensions();

    this.addEventListener('click', this.onClickBound);
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  disconnectedCallback() {
    this.removeEventListener('click', this.onClickBound);
  }

  /**
   * Closes the card with an optional fade.
   */
  async close(fadeDuration = this.fadeDuration) {
    if (fadeDuration === 0) {
      this.remove();
      return;
    }

    await fade(this, { duration: fadeDuration });
    this.remove();
  }

  private async onClick(evt: Event) {
    const clicked =
        evt.path ? evt.path[0] : evt.composedPath()[0] as HTMLElement;
    if (clicked.id !== 'close') {
      return;
    }

    await this.close();
  }

  private render() {
    const container = this.root.querySelector('#container') as HTMLElement;
    if (!container) {
      return;
    }

    if (this.srcIsString(this.src)) {
      container.textContent = this.src;
    } else if (typeof this.src === 'undefined') {
      container.textContent = 'Unexpected content';
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = this.src.toString();
      iframe.setAttribute('sandbox', this.sandboxAttribute);
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
