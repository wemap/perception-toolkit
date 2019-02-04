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

import { supportsEnvironmentCamera } from './environment-camera.js';

describe('SupportEnvironmentCamera', () => {
  it('only considers videoinputs correctly', () => {
    const supported = [
      {
        kind: 'audioinput',
        getCapabilities() {
          return {
            facingMode: ['environment']
          };
        }
      }
    ];
    assert.ok(supportsEnvironmentCamera(supported as any));
  });

  it('detects support correctly', () => {
    const supported = [
      {
        kind: 'videoinput',
        getCapabilities() {
          return {
            facingMode: ['environment']
          };
        }
      }
    ];

    assert.ok(supportsEnvironmentCamera(supported as any));
  });

  it('handles insufficient data', () => {
    const supported = [
      {
        kind: 'videoinput'
      },
      {
        kind: 'videoinput',
        getCapabilities() {
          return {};
        }
      }
    ];

    assert.ok(supportsEnvironmentCamera(supported as any));
  });
});
