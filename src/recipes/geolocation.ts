/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { Card } from '../elements/card/card.js';
import { NoSupportCard } from '../elements/no-support-card/no-support-card.js';
import { DeviceSupport } from '../support/device-support.js';
import * as GeolocationSupport from '../support/geolocation.js';
import { geolocation } from '../utils/geolocation-async.js';

/**
 * Processes the outcome of the device support testing.
 *
 * @param evt The supports event from the DeviceSupport class.
 */
async function onSupports(evt: Event) {
  const supportEvt = evt as CustomEvent<Support>;
  if (!(supportEvt.detail[GeolocationSupport.name])) {
    const noSupport = new NoSupportCard();
    document.body.appendChild(noSupport);
    return;
  }

  const container = createContainerIfRequired();
  const card = new Card();
  card.src = 'Obtaining location...';
  container.appendChild(card);

  try {
    const { latitude, longitude } = await geolocation();
    card.src = `Lat: ${latitude}, Lng: ${longitude}`;
  } catch (err) {
    card.src = err.message;
  }
}

function createContainerIfRequired() {
  let detectedBarcodesContainer = document.querySelector('#container');

  if (!detectedBarcodesContainer) {
    detectedBarcodesContainer = document.createElement('div');
    detectedBarcodesContainer.id = 'container';
    document.body.appendChild(detectedBarcodesContainer);
  }

  return detectedBarcodesContainer;
}

// Register custom elements.
customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
customElements.define(Card.defaultTagName, Card);

// Register events.
window.addEventListener(DeviceSupport.supportsEvent, onSupports);

// Start the detection process.
const deviceSupport = new DeviceSupport();
deviceSupport.useEvents = true;
deviceSupport.addDetector(GeolocationSupport);
deviceSupport.detect();
