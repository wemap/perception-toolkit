/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

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
