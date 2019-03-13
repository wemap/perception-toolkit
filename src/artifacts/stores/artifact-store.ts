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
import { ARArtifact } from '../schema/ar-artifact.js';
import { GeoCoordinates } from '../schema/geo-coordinates.js';

export interface ArtifactStore {
  addArtifact(artifact: ARArtifact): void;
  findRelevantArtifacts(nearbyMarkers: Marker[], geo: GeoCoordinates): ARArtifact[];
}
