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