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

import { doubleRaf } from '../../utils/double-raf.js';
import { Card } from './card.js';
customElements.define(Card.defaultTagName, Card);

describe('Card', () => {
  afterEach(() => {
    const cards = document.body.querySelectorAll(Card.defaultTagName);
    for (const card of cards) {
      card.remove();
    }
  });

  it('renders custom messages', async () => {
    const card = new Card();
    const message = 'Foo bar!';
    card.src = message;
    document.body.appendChild(card);

    await doubleRaf();
    assert(card.shadowRoot!.querySelector('#container')!.textContent, message);
  });

  it('rerenders on message change', async () => {
    const card = new Card();
    const message1 = 'Foo bar!';
    const message2 = 'Bar foo!';

    card.src = message1;
    document.body.appendChild(card);

    const container = card.shadowRoot!.querySelector('#container')!;
    await doubleRaf();
    assert(container.textContent, message1);

    card.src = message2;
    assert(container.textContent, message2);
  });

  it('renders more complex data', () => {
    const card = new Card();
    card.src = {
      description: 'bar',
      name: 'foo',
    };

    assert.isDefined(card.shadowRoot!.querySelector('#title'));
    assert.isDefined(card.shadowRoot!.querySelector('#description'));
  });

  it('removes itself on close', (done) => {
    const card = new Card();
    document.body.appendChild(card);

    requestAnimationFrame(async () => {
      await card.close(100);

      setTimeout(() => {
        assert.equal(card.parentNode, null);
        done();
      }, 150);
    });
  });

  it('removes itself immediately when duration is 0', (done) => {
    const card = new Card();
    document.body.appendChild(card);

    requestAnimationFrame(async () => {
      await card.close();
      assert.equal(card.parentNode, null);
      done();
    });
  });

  it('closes when the close button is clicked', async () => {
    const card = new Card();
    card.fadeDuration = 0;
    document.body.appendChild(card);

    // Wait for the render.
    await doubleRaf();

    const close =
        card.shadowRoot!.querySelector('#close') as HTMLButtonElement;
    close.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    assert.isNull(card.parentNode, 'Parent node is not null');
  });

  it('does not closes when clicked', async () => {
    const card = new Card();
    card.fadeDuration = 0;
    document.body.appendChild(card);

    // Wait for the render.
    await doubleRaf();
    card.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      composed: true
    }));
    assert.isNotNull(card.parentNode);
  });

  it('allows the setting of width', async () => {
    const card = new Card();
    card.style.setProperty('--padding', '0');
    card.width = 500;
    document.body.appendChild(card);

    assert.equal(card.getBoundingClientRect().width, 500);
    assert.equal(card.width, 500);
  });

  it('allows the setting of height', async () => {
    const card = new Card();
    card.style.setProperty('--padding', '0');
    card.height = 500;
    document.body.appendChild(card);
    assert.equal(card.getBoundingClientRect().height, 500);
    assert.equal(card.height, 500);
  });

  it('supports embedding iframe content', async () => {
    const card = new Card();
    card.src = new URL('about:blank');
    document.body.appendChild(card);
    assert.isNotNull(card.shadowRoot!.querySelector('iframe'));
  });

  it('handles undefined content', async () => {
    const card = new Card();
    card.src = undefined as string;
    document.body.appendChild(card);

    const container = card.shadowRoot!.querySelector('#container')!;
    await doubleRaf();
    assert.ok(container.textContent !== '');
  });
});
