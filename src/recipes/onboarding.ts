/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { OnboardingCard } from '../elements/onboarding-card/onboarding-card.js';
import { DeviceSupport } from '../support/device-support.js';
import * as IntersectionObserverSupport from '../support/intersection-observer.js';
import { injectScript } from '../utils/inject-script.js';

const IO_POLYFILL_PATH =
    '/third_party/intersection-observer/intersection-observer-polyfill.js';

/**
 * Processes the outcome of the device support testing.
 *
 * @param evt The supports event from the DeviceSupport class.
 */
async function onSupports(evt: Event) {
  const supportEvt = evt as CustomEvent<Support>;
  if (!(supportEvt.detail[IntersectionObserverSupport.name])) {
    await injectScript(IO_POLYFILL_PATH);

    // Force the polyfill to check every 300ms.
    (IntersectionObserver as any).prototype.POLL_INTERVAL = 300;
    console.log('Loaded polyfill: IntersectionObserver');
  }

  customElements.define(OnboardingCard.defaultTagName, OnboardingCard);
}

window.addEventListener(DeviceSupport.supportsEvent, onSupports);

// Start the detection process.
const deviceSupport = new DeviceSupport();
deviceSupport.useEvents = true;
deviceSupport.addDetector(IntersectionObserverSupport);
deviceSupport.detect();
