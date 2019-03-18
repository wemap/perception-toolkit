/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { Marker } from '../../../defs/marker.js';
import { NearbyResult } from '../artifact-dealer.js';
import { ARArtifact } from '../schema/ar-artifact.js';
import { GeoCoordinates } from '../schema/geo-coordinates.js';
import { JsonLd } from '../schema/json-ld.js';
import { ArtifactStore } from './artifact-store.js';
import { LocalMarkerStore } from './local-marker-store.js';

export class LocalArtifactStore implements ArtifactStore {
  private readonly markerStore = new LocalMarkerStore();

  addArtifact(artifact: ARArtifact): void {
    if (!artifact.arTarget) {
      return;
    }

    let targets: JsonLd[] = [];
    if (Array.isArray(artifact.arTarget)) {
      targets = artifact.arTarget;
    } else {
      targets = [artifact.arTarget];
    }

    for (const target of targets) {
      const targetType = target['@type'] || '';

      switch (targetType) {
        case 'Barcode':
          this.markerStore.addMarker(artifact, target);
          break;

        default:
          break; // We ignore types we don't support, and move on
      }
    }
  }

  findRelevantArtifacts(nearbyMarkers: Marker[], geo: GeoCoordinates): NearbyResult[] {
    return this.markerStore.findRelevantArtifacts(nearbyMarkers);
  }
}
