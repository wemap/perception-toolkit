/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { Marker } from '../../defs/marker.js';
import { generateMarkerId } from '../utils/generate-marker-id.js';
import { ARArtifact } from './schema/ar-artifact.js';
import { GeoCoordinates } from './schema/geo-coordinates.js';
import { JsonLd } from './schema/json-ld.js';
import { ArtifactStore } from './stores/artifact-store.js';

export interface NearbyResult {
  target?: JsonLd;
  content?: JsonLd;
  artifact: ARArtifact;
}

export interface NearbyResultDelta {
  found: NearbyResult[];
  lost: NearbyResult[];
}

export class ArtifactDealer {
  private readonly artstores: ArtifactStore[] = [];
  private readonly nearbyMarkers = new Map<string, Marker>();
  private nearbyResults = new Set<NearbyResult>();
  private currentGeolocation: GeoCoordinates = {};

  async addArtifactStore(artstore: ArtifactStore): Promise<NearbyResultDelta> {
    this.artstores.push(artstore);
    return this.generateDiffs();
  }

  async updateGeolocation(coords: GeoCoordinates): Promise<NearbyResultDelta> {
    this.currentGeolocation = coords;
    return this.generateDiffs();
  }

  async markerFound(marker: Marker): Promise<NearbyResultDelta> {
    this.nearbyMarkers.set(generateMarkerId(marker.type, marker.value), marker);
    return this.generateDiffs();
  }

  async markerLost(marker: Marker): Promise<NearbyResultDelta> {
    this.nearbyMarkers.delete(generateMarkerId(marker.type, marker.value));
    return this.generateDiffs();
  }

  // TODO (#34): Change ArtStore's `findRelevantArtifacts` to be async
  // TODO (#33): Replace map+flat with flatMap once it is polyfilled for all platforms.
  private async generateDiffs(): Promise<NearbyResultDelta> {
    // 1. Using current context (geo, markers), ask artstores to compute relevant artifacts
    const pendingNearbyResults = new Set(this.artstores.map((artstore) => {
      return artstore.findRelevantArtifacts(
        Array.from(this.nearbyMarkers.values()),
        this.currentGeolocation
      );
    }).flat(1));

    // 2. Diff with previous list to compute new/old artifacts.
    //    New ones are those which haven't appeared before.
    //    Old ones are those which are no longer nearby.
    //    The remainder (intersection) are not reported.
    const newNearbyResults = [...pendingNearbyResults].filter(a => !this.nearbyResults.has(a));
    const oldNearbyresults = [...this.nearbyResults].filter(a => !pendingNearbyResults.has(a));

    const ret: NearbyResultDelta = {
      found: [],
      lost: []
    };

    // 3. Compute
    for (const { target, artifact } of newNearbyResults) {
      const content = artifact.arContent;
      ret.found.push({ target, content, artifact });
    }

    for (const { target, artifact } of oldNearbyresults) {
      const content = artifact.arContent;
      ret.lost.push({ target, content, artifact });
    }

    // 4. Update current set of nearbyResults.
    this.nearbyResults = pendingNearbyResults;

    return ret;
  }

}
