/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { createStubInstance, replace, spy } from 'sinon';

const { assert } = chai;

import { geolocation } from './geolocation-async.js';

describe('GetUserMediaSupport', () => {
  it('returns a boolean', async () => {
    const data = {
      coords: {
        accuracy: 1,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 2,
        longitude: 3,
        speed: null
      },

      timestamp: 0
    };

    replace(navigator.geolocation, 'getCurrentPosition',
        (successCallback: PositionCallback) => {
          successCallback.call(null, data);
        });

    const value = await geolocation();
    assert.deepEqual(value, data.coords);
  });
});
