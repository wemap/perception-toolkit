/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LocalMarkerStore } from './local-marker-store.js';

export class LocalArtifactStore {
  constructor() {
    this._markerStore = new LocalMarkerStore;
  }

  addArtifact(artifact) {
    const target = artifact['arTarget'];
    if (!target) {
      return;
    }

    const target_type = target['@type'] || '';

    switch (target_type) {
      case "Barcode":
        this._markerStore.addArtifact(artifact, target);
        break;

      default:
        break; // We ignore types we don't support, and move on
    }
  }

  findRelevantArtifacts(nearbyMarkers, geo) {
    return this._markerStore.findRelevantArtifacts(nearbyMarkers);
  }
};
