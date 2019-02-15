/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { Support } from '../defs/lib.js';
import { DotLoader } from '../src/elements/dot-loader/dot-loader.js';
import { OnboardingCard } from '../src/elements/onboarding-card/onboarding-card.js';
import { DeviceSupport } from '../src/support/device-support.js';
import { default as IntersectionObserverSupport } from '../src/support/intersection-observer.js';
import { fire } from '../src/utils/fire.js';
import { injectScript } from '../src/utils/inject-script.js';

let loader: DotLoader | null;
const IO_POLYFILL_PATH =
    '/third_party/intersection-observer/intersection-observer-polyfill.js';

/**
 * Processes the outcome of the device support testing.
 *
 * @param evt The supports event from the DeviceSupport class.
 */
async function onSupports(evt: Event) {
  loader = new DotLoader();
  loader.style.setProperty('--color', '#FFF');
  document.body.appendChild(loader);

  const supportEvt = evt as CustomEvent<Support>;
  if (!(supportEvt.detail[IntersectionObserverSupport.name])) {
    await injectScript(IO_POLYFILL_PATH);

    // Force the polyfill to check every 300ms.
    (IntersectionObserver as any).prototype.POLL_INTERVAL = 300;
    console.log('Loaded polyfill: IntersectionObserver');
  }

  // Wait to confirm that IntersectionObservers are in place before registering
  // the Onboarding Card element.
  customElements.define(OnboardingCard.defaultTagName, OnboardingCard);

  const card =
      document.querySelector(OnboardingCard.defaultTagName) as OnboardingCard;
  if (!card) {
    return;
  }

  card.focus();
  loader.remove();
}

window.addEventListener('keyup', (e) => {
  const card = document.activeElement as OnboardingCard;
  if (card.tagName !== OnboardingCard.defaultTagName.toUpperCase()) {
    return;
  }

  switch (e.key) {
    case ' ':
      card.next();
      break;

    case 'Escape':
      fire(OnboardingCard.onboardingFinishedEvent, card);
      break;

    default: return;
  }
});

window.addEventListener(DeviceSupport.supportsEvent, onSupports);
window.addEventListener(OnboardingCard.onboardingFinishedEvent, (e) => {
  const target = e.target as OnboardingCard;
  const tagName = OnboardingCard.defaultTagName.toUpperCase();
  if (!target || target.tagName !== tagName) {
    return;
  }

  target.remove();
  document.body.focus();
});

// Register the dot loader.
customElements.define(DotLoader.defaultTagName, DotLoader);

// Start the detection process.
const deviceSupport = new DeviceSupport();
deviceSupport.useEvents = true;
deviceSupport.addDetector(IntersectionObserverSupport);
deviceSupport.detect();
