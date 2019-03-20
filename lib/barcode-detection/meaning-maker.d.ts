/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { Marker } from '../defs/marker';
import { NearbyResultDelta } from '../src/artifacts/artifact-dealer';
import { GeoCoordinates } from '../src/artifacts/schema/geo-coordinates';
export declare class MeaningMaker {
    private readonly artloader;
    private readonly artstore;
    private readonly artdealer;
    constructor();
    /**
     * Load artifact content for initial set.
     */
    init(): Promise<void>;
    /**
     * Load artifact content for initial set.
     */
    loadArtifactsFromJsonldUrl(url: URL): Promise<void>;
    /**
     * Load artifact content from url on same origin, usually discovered from environment.
     */
    loadArtifactsFromSameOriginUrl(url: URL): Promise<void>;
    markerFound(marker: Marker): Promise<NearbyResultDelta>;
    markerLost(marker: Marker): Promise<NearbyResultDelta>;
    updateGeolocation(coords: GeoCoordinates): Promise<NearbyResultDelta>;
    private saveArtifacts;
}
