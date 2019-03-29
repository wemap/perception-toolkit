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

import { Support, Supported } from '../../defs/lib.js';
import { fire } from '../utils/fire.js';

export class DeviceSupport {
  static supportsEvent = 'supports';
  useEvents = false;
  private detectors = new Map<string, Supported>();

  addDetector(detector: {name: string, supported: Supported}) {
    const { name, supported } = detector;
    if (this.detectors.has(name)) {
      throw new Error(`${name} already added`);
    }

    this.detectors.set(name, supported);
  }

  removeDetector(name: string) {
    this.detectors.delete(name);
  }

  async detect() {
    const support: Support = {};
    for (const [name, detector] of this.detectors) {
      support[name] = await detector();
    }

    if (this.useEvents) {
      fire(DeviceSupport.supportsEvent, self, support);
    }

    return support;
  }
}
