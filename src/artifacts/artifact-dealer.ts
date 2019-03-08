/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { generateMarkerId } from '../utils/generate-marker-id.js';

export class ArtifactDealer {
  constructor() {
    this._artstores = [];

    this._currentGeolocation = null;
    this._nearbyMarkers = new Map;
    this._nearbyArtifacts = new Set;
  }

  async addArtifactStore(artstore) {
    this._artstores.push(artstore);
    // TODO: Subscribe for artstore update events, call _generateEvents each update.

    return this._generateDiffs();
  }

  async updateGeolocation(coords) {
    this._currentGeolocation = coords;
    return this._generateDiffs();
  }

  async markerFound(value, type) {
    this._nearbyMarkers.set(generateMarkerId(type, value), { value, type });

    return this._generateDiffs();
  }

  async markerLost(value, type) {
    this._nearbyMarkers.delete(generateMarkerId(type, type));
    return this._generateDiffs();
  }

  // TODO: Future ArtStores may actually be async, and should convert this code to not rely
  // on sync implementation of findRelevantArtifacts()
  async _generateDiffs() {
    // 1. Using current context (geo, markers), ask artstores to compute relevant artifacts
    const pendingNearbyArtifacts = new Set(this._artstores.flatMap((artstore) => {
      return artstore.findRelevantArtifacts(
        Array.from(this._nearbyMarkers.values()),
        this._currentGeolocation
      );
    }));

    // 2. Diff with previous list to compute new/old artifacts.
    //    New ones are those which haven't appeared before.
    //    Old ones are those which are no longer nearby.
    //    The remainder (intersection) are not reported.
    const newNearbyArtifacts = [...pendingNearbyArtifacts].filter(a => !this._nearbyArtifacts.has(a));
    const oldNearbyArtifacts = [...this._nearbyArtifacts].filter(a => !pendingNearbyArtifacts.has(a));

    const ret = {
      found: [],
      lost: []
    };

    // 3. Compute 
    for (let { target, artifact } of newNearbyArtifacts) {
      const content = artifact['arContent'];

      ret.found.push({ target, content, artifact });
    }

    for (let { target, artifact } of oldNearbyArtifacts) {
      const content = artifact['arContent'];

      ret.lost.push({ target, content, artifact });
    }

    // 4. Update current set of nearbyArtifacts.
    this._nearbyArtifacts = pendingNearbyArtifacts;

    return ret;
  }

}
