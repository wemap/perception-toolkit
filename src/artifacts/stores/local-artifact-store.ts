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
import { JsonLd } from '../schema/JsonLd.js';
import { ARArtifact } from '../schema/ARArtifact.js';
import { Marker } from '../schema/Marker.js';
import { GeoCoordinates } from '../schema/GeoCoordinates.js';

export class LocalArtifactStore {
  private markerStore = new LocalMarkerStore();

  constructor() {
  }

  addArtifact(artifact: ARArtifact): void {
    if (!artifact.arTarget) {
      return;
    }

    let targets : JsonLd[] = [];
    if (Array.isArray(artifact.arTarget)) {
      targets = artifact.arTarget;
    } else {
      targets = [artifact.arTarget];
    }

    for (let target of targets) {
      const target_type = target['@type'] || '';

      switch (target_type) {
        case "Barcode":
          this.markerStore.addArtifact(artifact, target);
          break;

        default:
          break; // We ignore types we don't support, and move on
      }
    }
  }

  findRelevantArtifacts(nearbyMarkers: Marker[], geo: GeoCoordinates) {
    return this.markerStore.findRelevantArtifacts(nearbyMarkers);
  }
};
