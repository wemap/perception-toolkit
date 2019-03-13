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
  target: JsonLd; // TODO: this comes from art-store
  content: JsonLd;
  artifact: ARArtifact;
}

export interface NearbyResultDelta {
  found: NearbyResult[];
  lost: NearbyResult[];
}

export class ArtifactDealer {
  private artstores: ArtifactStore[] = [];
  private currentGeolocation: GeoCoordinates = {};
  private nearbyMarkers = new Map<string, Marker>();
  private nearbyArtifacts = new Set<ARArtifact>();

  async addArtifactStore(artstore: ArtifactStore): Promise<NearbyResultDelta> {
    this.artstores.push(artstore);
    // TODO: Subscribe for artstore update events, call generateEvents each update.

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

  // TODO: Future ArtStores may actually be async, and should convert this code to not rely
  // on sync implementation of findRelevantArtifacts()
  async generateDiffs(): Promise<NearbyResultDelta> {
    // 1. Using current context (geo, markers), ask artstores to compute relevant artifacts
    const pendingNearbyArtifacts = new Set(this.artstores.flatMap((artstore) => {
      return artstore.findRelevantArtifacts(
        Array.from(this.nearbyMarkers.values()),
        this.currentGeolocation
      );
    }));

    // 2. Diff with previous list to compute new/old artifacts.
    //    New ones are those which haven't appeared before.
    //    Old ones are those which are no longer nearby.
    //    The remainder (intersection) are not reported.
    const newNearbyArtifacts = [...pendingNearbyArtifacts].filter(a => !this.nearbyArtifacts.has(a));
    const oldNearbyArtifacts = [...this.nearbyArtifacts].filter(a => !pendingNearbyArtifacts.has(a));

    const ret: NearbyResultDelta = {
      found: [],
      lost: []
    };

    // 3. Compute
    for (const { target, artifact } of newNearbyArtifacts) {
      const content = artifact.arContent;
      ret.found.push({ target, content, artifact });
    }

    for (const { target, artifact } of oldNearbyArtifacts) {
      const content = artifact.arContent;
      ret.lost.push({ target, content, artifact });
    }

    // 4. Update current set of nearbyArtifacts.
    this.nearbyArtifacts = pendingNearbyArtifacts;

    return ret;
  }

}
