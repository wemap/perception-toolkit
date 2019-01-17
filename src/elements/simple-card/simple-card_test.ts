/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const { assert } = chai;

import { SimpleCard } from './simple-card.js';

function createCard() {
  const card =
      document.createElement(SimpleCard.defaultTagName) as SimpleCard;
  document.body.appendChild(card);
  return card;
}

describe('SimpleCard', () => {
  afterEach(() => {
    const cards = document.body.querySelectorAll(SimpleCard.defaultTagName);
    for (const card of cards) {
      card.remove();
    }
  });

  it('should set its content', (done) => {
    const card = createCard();

    // Wait a frame to ensure rendering happened.
    requestAnimationFrame(() => {
      assert(card.shadowRoot!.textContent, card.message);
      done();
    });
  });

  it('should render custom messages', (done) => {
    const card = createCard();
    const message = 'Foo bar!';
    card.message = message;

    requestAnimationFrame(() => {
      assert(card.shadowRoot!.textContent, message);
      done();
    });
  });
});
