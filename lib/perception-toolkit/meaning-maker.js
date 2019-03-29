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
import { ArtifactDealer } from '../src/artifacts/artifact-dealer';
import { ArtifactLoader } from '../src/artifacts/artifact-loader';
import { LocalArtifactStore } from '../src/artifacts/stores/local-artifact-store';
/*
 * MeaningMaker binds the Artifacts components with the rest of the Perception Toolkit.
 * It providess a good set of default behaviours, and can be replaced with alternative
 * strategies in some demos.
 *
 * Things MeaningMaker does:
 * * Creates a default Artifact Loader, Store, and Dealer.
 * * Loads Artifacts from Document automatically on init.
 * * Attempts to index Pages automatically when Markers are URLs.
 */
export class MeaningMaker {
    constructor() {
        this.artloader = new ArtifactLoader();
        this.artstore = new LocalArtifactStore();
        this.artdealer = new ArtifactDealer();
        this.artdealer.addArtifactStore(this.artstore);
    }
    /**
     * Load artifact content for initial set.
     */
    async init() {
        const artifacts = await this.artloader.fromElement(document, document.URL);
        this.saveArtifacts(artifacts);
    }
    /**
     * Load artifact content for initial set.
     */
    async loadArtifactsFromJsonldUrl(url) {
        const artifacts = await this.artloader.fromJsonUrl(url);
        this.saveArtifacts(artifacts);
    }
    /**
     * Load artifact content from url on same origin, usually discovered from environment.
     */
    async loadArtifactsFromSameOriginUrl(url) {
        // Ensure this URL is on same origin
        if (url.hostname !== window.location.hostname ||
            url.port !== window.location.port ||
            url.protocol !== window.location.protocol) {
            return;
        }
        const artifacts = await this.artloader.fromHtmlUrl(url);
        for (const artifact of artifacts) {
            this.artstore.addArtifact(artifact);
        }
    }
    async markerFound(marker) {
        // If this marker is a URL, try loading artifacts from that URL
        try {
            // Attempt to convert markerValue to URL.  This will throw if markerValue isn't a valid URL.
            // Do not supply a base url argument, since we do not want to support relative URLs,
            // and because that would turn lots of normal string values into valid relative URLs.
            const url = new URL(marker.value);
            await this.loadArtifactsFromSameOriginUrl(url);
        }
        catch (_) {
            // Do nothing if this isn't a valid URL
        }
        return this.artdealer.markerFound(marker);
    }
    async markerLost(marker) {
        return this.artdealer.markerLost(marker);
    }
    async updateGeolocation(coords) {
        return this.artdealer.updateGeolocation(coords);
    }
    saveArtifacts(artifacts) {
        for (const artifact of artifacts) {
            this.artstore.addArtifact(artifact);
        }
    }
}
//# sourceMappingURL=meaning-maker.js.map