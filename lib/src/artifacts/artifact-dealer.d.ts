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
export declare class ArtifactDealer {
    private readonly artstores;
    private readonly nearbyMarkers;
    private nearbyResults;
    private currentGeolocation;
    addArtifactStore(artstore: ArtifactStore): Promise<NearbyResultDelta>;
    updateGeolocation(coords: GeoCoordinates): Promise<NearbyResultDelta>;
    markerFound(marker: Marker): Promise<NearbyResultDelta>;
    markerLost(marker: Marker): Promise<NearbyResultDelta>;
    generateDiffs(): Promise<NearbyResultDelta>;
}
