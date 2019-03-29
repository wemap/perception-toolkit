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
import { LocalMarkerStore } from './local-marker-store.js';
export class LocalArtifactStore {
    constructor() {
        this.markerStore = new LocalMarkerStore();
    }
    addArtifact(artifact) {
        if (!artifact.arTarget) {
            return;
        }
        let targets = [];
        if (Array.isArray(artifact.arTarget)) {
            targets = artifact.arTarget;
        }
        else {
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
    findRelevantArtifacts(nearbyMarkers, geo) {
        return this.markerStore.findRelevantArtifacts(nearbyMarkers);
    }
}
//# sourceMappingURL=local-artifact-store.js.map