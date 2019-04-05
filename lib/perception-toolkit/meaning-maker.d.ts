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
import { Marker } from '../defs/marker';
import { NearbyResultDelta } from '../src/artifacts/artifact-dealer';
import { GeoCoordinates } from '../src/artifacts/schema/geo-coordinates';
declare type ShouldFetchArtifactsFromCallback = ((url: URL) => boolean) | string[];
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
    loadArtifactsFromSupportedUrls(url: URL, shouldFetchArtifactsFrom?: ShouldFetchArtifactsFromCallback): Promise<void>;
    markerFound(marker: Marker, shouldFetchArtifactsFrom?: ShouldFetchArtifactsFromCallback): Promise<NearbyResultDelta>;
    markerLost(marker: Marker): Promise<NearbyResultDelta>;
    updateGeolocation(coords: GeoCoordinates): Promise<NearbyResultDelta>;
    private saveArtifacts;
}
export {};
