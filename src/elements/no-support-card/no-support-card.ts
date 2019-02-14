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

/**
 * A card to use when the browser does not support the various APIs your
 * experience requires.
 *
 * ```javascript
 * const noSupport = new NoSupportCard();
 * document.body.appendChild(noSupport);
 * ```
 */
export class NoSupportCard extends HTMLElement {
  /**
   * The Card's default tag name for registering with `customElements.define`.
   */
  static defaultTagName = 'no-support-card';

  /**
   * @ignore Only exposed for testing.
   */
  static readonly DEFAULT_MESSAGE =
      'Sorry, this browser does not support the required features';

  /**
   * The message to share with users.
   */
  message = NoSupportCard.DEFAULT_MESSAGE;

  private root = this.attachShadow({ mode: 'open' });

  /* istanbul ignore next */
  constructor() {
    super();
  }

  /**
   * @ignore Only public because it's a Custom Element.
   */
  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;

    const container = this.root.querySelector('#container')!;
    container.textContent = this.message;
  }
}
