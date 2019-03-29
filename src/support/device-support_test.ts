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
