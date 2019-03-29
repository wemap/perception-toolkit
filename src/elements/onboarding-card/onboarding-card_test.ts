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
import { timeout } from '../../utils/timeout.js';
import { OnboardingCard } from './onboarding-card.js';

customElements.define(OnboardingCard.defaultTagName, OnboardingCard);

async function createCard({children = 0, width = 0, height = 0} = {}) {
  const card = new OnboardingCard();
  card.width = width;
  card.height = height;

  for (let i = 0; i < children; i++) {
    const step = document.createElement('div');
    step.dataset.id = i.toString();
    step.setAttribute('alt', 'Alt content test');
    step.style.width = `${width}px`;
    step.style.height = `${height}px`;
    step.style.background = `hsl(${i * 50}, 50%, 50%)`;

    card.appendChild(step);
  }

  document.body.appendChild(card);
  await card.ready;
  return card;
}

describe('OnboardingCard', () => {
  afterEach(() => {
    const cards = document.body.querySelectorAll(OnboardingCard.defaultTagName);
    for (const card of cards) {
      card.remove();
    }
  });

  it('reflects width as an attribute', async () => {
    const card = await createCard();
    card.width = 400;
    assert.equal(card.getAttribute('width'), '400');
  });

  it('reflects height as an attribute', async () => {
    const card = await createCard();
    card.height = 400;
    assert.equal(card.getAttribute('height'), '400');
  });

  it('reflects width as an attribute', async () => {
    const card = await createCard();
    card.width = 400;
    assert.equal(card.getAttribute('width'), '400');
  });

  it('reflects width and height to zero if invalid', async () => {
    const card = await createCard();
    card.width = Number.NaN;
    card.height = Number.NaN;
    assert.equal(card.getAttribute('width'), '0');
    assert.equal(card.getAttribute('height'), '0');

    card.setAttribute('width', 'foo');
    card.setAttribute('height', 'foo');
    assert.equal(card.width, 0);
    assert.equal(card.height, 0);
  });

  it('creates the correct number of buttons', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});

    // Give the element chance to render.
    await doubleRaf();
    assert.equal(card.shadowRoot!.querySelectorAll('button').length, 3);
  });

  it('goes to the next item via next()', async () => {
    const card = await createCard({children: 3});
    card.next();

    await timeout(1000);
    assert.equal(card.item, 1);
  });

  it('goes to the next item via click()', async () => {
    const card = await createCard({children: 3});
    const container = card.shadowRoot!.querySelector('#container');
    if (container === null) {
      return assert.fail('Container not found');
    }

    const clickEvt = new MouseEvent('click', { bubbles: true, composed: true });
    container.dispatchEvent(clickEvt);

    await timeout(1000);
    assert.equal(card.item, 1);
  });

  it('goes to the item indicated', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});
    card.gotoItem({to: 1});

    await timeout(1000);
    assert.equal(card.item, 1);
  });

  it('goes to the item when the button is clicked', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});
    const buttons = card.shadowRoot!.querySelectorAll('button');
    if (buttons.length < 3) {
      return assert.fail('Buttons not found');
    }

    const clickEvt = new MouseEvent('click', { bubbles: true, composed: true });
    buttons[1].dispatchEvent(clickEvt);

    await timeout(1000);
    assert.equal(card.item, 1);
  });

  it('dispatches events when the item changes', (done) => {
    createCard({children: 3, width: 500, height: 500}).then((card) => {
      card.addEventListener(OnboardingCard.itemChangedEvent, () => done());
      card.gotoItem({to: 1});
    });
  });

  it('ignores requests for items of the max', async () => {
    const card = await createCard({children: 3});
    card.gotoItem({to: 100});

    await timeout(1000);
    assert.equal(card.item, 0);
  });

  it('ignores requests for items below 0', async () => {
    const card = await createCard({children: 3});
    card.gotoItem({to: -1});

    await timeout(1000);
    assert.equal(card.item, 0);
  });

  it('fires an event for the last child', (done) => {
    createCard({children: 2}).then((card) => {
      const evt = OnboardingCard.onboardingFinishedEvent;
      card.addEventListener(evt, () => done());
      card.next();
      card.next();
    });
  });

  it('fades between items', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});
    card.mode = 'fade';
    card.gotoItem({from: 0, to: 1});
    await timeout(100);
    const child = card.firstChild! as HTMLElement;
    const opacity = Number(window.getComputedStyle(child).opacity);
    assert.isBelow(opacity, 1);
  });

  it('completes the fades between items', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});
    card.mode = 'fade';
    await card.gotoItem({from: 0, to: 1});
    assert.equal(card.item, 1);
  });

  it('does nothing if given no id to transition to', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});
    card.mode = 'fade';
    await card.gotoItem();
    assert.equal(card.item, 0);
  });

  it('reverts to scroll for invalid modes', async () => {
    const card = await createCard({children: 3, width: 500, height: 500});
    (card.mode as any) = 'foo';
    assert.equal(card.mode, 'scroll');
  });
});
