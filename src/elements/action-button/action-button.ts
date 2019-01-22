/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, styles } from './action-button.template.js';

export class ActionButton extends HTMLElement {
  static defaultTagName = 'action-button';
  static readonly DEFAULT_LABEL = 'Button';

  private labelInternal = ActionButton.DEFAULT_LABEL;
  private root = this.attachShadow({ mode: 'open' });

  connectedCallback() {
    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    this.render();
  }

  get label() {
    return this.labelInternal;
  }

  set label(label: string) {
    this.labelInternal = label;
    this.render();
  }

  render() {
    const button = this.root.querySelector('button');
    if (!button) {
      return;
    }

    button.textContent = this.label;
  }
}
