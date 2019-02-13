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

import { Support } from '../../defs/lib.js';
import { DeviceSupport } from './device-support.js';

describe('DeviceSupport', () => {
  it('defaults to no detectors', async () => {
    const deviceSupport = new DeviceSupport();
    assert.deepEqual(await deviceSupport.detect(), {});
  });

  it('supports adding detectors', async () => {
    const deviceSupport = new DeviceSupport();
    deviceSupport.addDetector({name: 'foo', supported: async () => true});

    const support = await deviceSupport.detect();
    assert.deepEqual(support, { foo: true });
  });

  it('supports removing detectors', async () => {
    const deviceSupport = new DeviceSupport();
    deviceSupport.addDetector({name: 'foo', supported: async () => true});
    deviceSupport.removeDetector('foo');

    const support = await deviceSupport.detect();
    assert.deepEqual(support, {});
  });

  it('throws if detector already exists', () => {
    const deviceSupport = new DeviceSupport();
    deviceSupport.addDetector({name: 'foo', supported: async () => true});

    assert.throws(() => deviceSupport.addDetector({
      name: 'foo',
      supported: async () => false
    }), 'foo already added');
  });

  it('emits an event', (done) => {
    const deviceSupport = new DeviceSupport();
    deviceSupport.useEvents = true;
    deviceSupport.addDetector({name: 'foo', supported: async () => true});

    window.addEventListener(DeviceSupport.supportsEvent, (evt) => {
      const supportEvt = evt as CustomEvent<Support>;
      assert.deepEqual(supportEvt.detail, { foo: true });
      done();
    });
    deviceSupport.detect();
  });
});
