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
import { Barcode } from '../schema/barcode.js';

export class LocalMarkerStore {
  private readonly markers = new Map<string, NearbyResult>();

  addMarker(artifact: ARArtifact, barcode: Barcode): void {
    if (!barcode.text) {
      return;
    }
    this.markers.set(barcode.text, { target: barcode, artifact });
  }

  findRelevantArtifacts(markers: Marker[]): NearbyResult[] {
    const ret = [];
    for (const marker of markers) {
      if (!marker.value) {
        continue;
      }

      const nearbyResult = this.markers.get(marker.value);

      if (nearbyResult) {
        ret.push(nearbyResult);
      }
    }
    return ret;
  }
}
