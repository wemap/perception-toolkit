/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { assert } = chai;

import { NoSupportCard } from './no-support-card.js';
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);

function createCard() {
  const card = new NoSupportCard();
  document.body.appendChild(card);
  return card;
}

describe('NoSupportCard', () => {
  afterEach(() => {
    const cards = document.body.querySelectorAll(NoSupportCard.defaultTagName);
    for (const card of cards) {
      card.remove();
    }
  });

  it('should set its content', (done) => {
    const card = createCard();

    // Wait a frame to ensure rendering happened.
    requestAnimationFrame(() => {
      assert(card.shadowRoot!.textContent, NoSupportCard.DEFAULT_MESSAGE);
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
