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
import { flatMap } from '../utils/flat-map.js';
export class ArtifactDealer {
    constructor() {
        this.artstores = [];
        this.nearbyMarkers = new Map();
        this.nearbyResults = new Set();
        this.currentGeolocation = {};
    }
    async addArtifactStore(artstore) {
        this.artstores.push(artstore);
        return this.generateDiffs();
    }
    async updateGeolocation(coords) {
        this.currentGeolocation = coords;
        return this.generateDiffs();
    }
    async markerFound(marker) {
        this.nearbyMarkers.set(generateMarkerId(marker.type, marker.value), marker);
        return this.generateDiffs();
    }
    async markerLost(marker) {
        this.nearbyMarkers.delete(generateMarkerId(marker.type, marker.value));
        return this.generateDiffs();
    }
    // TODO (#34): Change ArtStore's `findRelevantArtifacts` to be async
    // TODO (#33): Replace map+flat with flatMap once it is polyfilled for all platforms.
    async generateDiffs() {
        // 1. Using current context (geo, markers), ask artstores to compute relevant artifacts
        const pendingNearbyResults = new Set(flatMap(this.artstores, (artstore) => {
            return artstore.findRelevantArtifacts(Array.from(this.nearbyMarkers.values()), this.currentGeolocation);
        }));
        // 2. Diff with previous list to compute new/old artifacts.
        //    New ones are those which haven't appeared before.
        //    Old ones are those which are no longer nearby.
        //    The remainder (intersection) are not reported.
        const newNearbyResults = [...pendingNearbyResults].filter(a => !this.nearbyResults.has(a));
        const oldNearbyresults = [...this.nearbyResults].filter(a => !pendingNearbyResults.has(a));
        const ret = {
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
//# sourceMappingURL=artifact-dealer.js.map