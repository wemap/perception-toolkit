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

import * as IntersectionObserverSupport from '../../support/intersection-observer.js';
import { doubleRaf } from '../../utils/double-raf.js';
import { injectScript } from '../../utils/inject-script.js';
import { OnboardingCard } from './onboarding-card.js';

const IO_POLYFILL_PATH =
    '/third_party/intersection-observer/intersection-observer-polyfill.js';

function createCard({children = 0, width = 0, height = 0} = {}) {
  const card = new OnboardingCard();
  card.width = width;
  card.height = height;

  for (let i = 0; i < children; i++) {
    const step = document.createElement('div');
    step.style.width = `${width}px`;
    step.style.height = `${height}px`;

    card.appendChild(step);
  }

  document.body.appendChild(card);
  return card;
}

describe('OnboardingCard', () => {
  beforeEach(async () => {
    const ioSupported = await IntersectionObserverSupport.supported();
    if (!ioSupported) {
      await injectScript(IO_POLYFILL_PATH);

      // Force the polyfill to check every 300ms.
      (IntersectionObserver as any).prototype.POLL_INTERVAL = 300;
    }

    if (!customElements.get(OnboardingCard.defaultTagName)) {
      customElements.define(OnboardingCard.defaultTagName, OnboardingCard);
    }
  });

  afterEach(() => {
    const cards = document.body.querySelectorAll(OnboardingCard.defaultTagName);
    for (const card of cards) {
      card.remove();
    }
  });

  it('reflects width as an attribute', () => {
    const card = createCard();
    card.width = 400;
    assert.equal(card.getAttribute('width'), '400');
  });

  it('reflects height as an attribute', () => {
    const card = createCard();
    card.height = 400;
    assert.equal(card.getAttribute('height'), '400');
  });

  it('reflects width as an attribute', () => {
    const card = createCard();
    card.width = 400;
    assert.equal(card.getAttribute('width'), '400');
  });

  it('reflects width and height to zero if invalid', () => {
    const card = createCard();
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
    const card = createCard({children: 3, width: 500, height: 500});

    // Give the element chance to render.
    await doubleRaf();
    assert.equal(card.shadowRoot!.querySelectorAll('button').length, 3);
  });

  it('goes to the next item via next()', (done) => {
    const card = createCard({children: 3});
    card.next();

    setTimeout(() => {
      assert.equal(card.item, 1);
      done();
    }, 1000);
  });

  it('goes to the next item via click()', (done) => {
    const card = createCard({children: 3});
    const container = card.shadowRoot!.querySelector('#container');
    if (container === null) {
      return assert.fail('Container not found');
    }

    const clickEvt = new MouseEvent('click', { bubbles: true, composed: true });
    container.dispatchEvent(clickEvt);

    setTimeout(() => {
      assert.equal(card.item, 1);
      done();
    }, 1000);
  });

  it('goes to the item indicated', (done) => {
    const card = createCard({children: 3, width: 500, height: 500});
    card.gotoItem({to: 1});

    setTimeout(() => {
      assert.equal(card.item, 1);
      done();
    }, 1000);
  });

  it('goes to the item when the button is clicked', (done) => {
    const card = createCard({children: 3, width: 500, height: 500});
    const buttons = card.shadowRoot!.querySelectorAll('button');
    if (buttons.length < 3) {
      return assert.fail('Buttons not found');
    }

    const clickEvt = new MouseEvent('click', { bubbles: true, composed: true });
    buttons[1].dispatchEvent(clickEvt);

    setTimeout(() => {
      assert.equal(card.item, 1);
      done();
    }, 1000);
  });

  it('dispatches events when the item changes', (done) => {
    const card = createCard({children: 3, width: 500, height: 500});
    card.addEventListener(OnboardingCard.itemChangedEvent, () => done());
    card.gotoItem({to: 1});
  });

  it('ignores requests for items of the max', (done) => {
    const card = createCard({children: 3});
    card.gotoItem({to: 100});

    setTimeout(() => {
      assert.equal(card.item, 0);
      done();
    }, 1000);
  });

  it('ignores requests for items below 0', (done) => {
    const card = createCard({children: 3});
    card.gotoItem({to: -1});

    setTimeout(() => {
      assert.equal(card.item, 0);
      done();
    }, 1000);
  });

  it('fires an event for the last child', (done) => {
    const card = createCard({children: 2});
    card.addEventListener(OnboardingCard.onboardingFinishedEvent, () => done());
    card.next();
    card.next();
  });

  it('fades between items', (done) => {
    const card = createCard({children: 3, width: 500, height: 500});
    card.mode = 'fade';
    card.gotoItem({from: 0, to: 1});
    setTimeout(() => {
      const child = card.firstChild! as HTMLElement;
      const opacity = Number(window.getComputedStyle(child).opacity);
      assert.isBelow(opacity, 1);
      done();
    }, 100);
  });

  it('completes the fades between items', async () => {
    const card = createCard({children: 3, width: 500, height: 500});
    card.mode = 'fade';
    await card.gotoItem({from: 0, to: 1});
    assert.equal(card.item, 1);
  });

  it('does nothing if given no id to transition to', async () => {
    const card = createCard({children: 3, width: 500, height: 500});
    card.mode = 'fade';
    await card.gotoItem();
    assert.equal(card.item, 0);
  });

  it('reverts to scroll for invalid modes', () => {
    const card = createCard({children: 3, width: 500, height: 500});
    (card.mode as any) = 'foo';
    assert.equal(card.mode, 'scroll');
  });
});
