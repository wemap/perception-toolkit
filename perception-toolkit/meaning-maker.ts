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
import { ArtifactDealer, NearbyResult, NearbyResultDelta } from '../src/artifacts/artifact-dealer';
import { ArtifactLoader } from '../src/artifacts/artifact-loader';
import { extractPageMetadata } from '../src/artifacts/extract-page-metadata.js';
import { ARArtifact } from '../src/artifacts/schema/ar-artifact';
import { GeoCoordinates } from '../src/artifacts/schema/geo-coordinates';
import { JsonLd } from '../src/artifacts/schema/json-ld';
import { LocalArtifactStore } from '../src/artifacts/stores/local-artifact-store';
import { fetchAsDocument } from '../src/utils/fetch-as-document';
import { ContentMetadataManager } from './content-metadata-manager';

type ShouldFetchArtifactsFromCallback = ((url: URL) => boolean);

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
  private readonly artloader = new ArtifactLoader();
  private readonly artstore = new LocalArtifactStore();
  private readonly artdealer = new ArtifactDealer();
  private readonly pageMetadataCache = new Map<URL, JsonLd>();

  constructor() {
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
   * Load artifact content for a json-ld file.
   * This could just a small set of Artifacts defined in an external script, but often this is used to load a large
   * set of Artifacts for an entire site ("artifact sitemap").
   */
  async loadArtifactsFromJsonldUrl(url: URL) {
    const artifacts = await this.artloader.fromJsonUrl(url);
    this.saveArtifacts(artifacts);
  }

  /**
   * Load artifact content from an html file.
   * This could be used to manualy crawl a site, but usually this is just used to index a single page, for which a URL
   * was discovered at runtime.  E.g. QRCode with URL in it, or an OCR-ed URL on a poster.
   */
  async loadArtifactsFromHtmlUrl(url: URL) {
    const artifacts = await this.artloader.fromHtmlUrl(url);
    this.saveArtifacts(artifacts);
    return artifacts;
  }

  /*
   * This will extract page metadata
   */
  async getPageMetadata(url: URL, doc?: Document): Promise<JsonLd | null> {
    if (this.pageMetadataCache.has(url)) {
      return this.pageMetadataCache.get(url) as JsonLd;
    }
    return this.tryExtractPageMetadata(url)
  }


  /*
   * Let meaning-maker know that a new marker was discovered in the environment.
   * Returns a list of results based on this new information.
   */
  async markerFound(marker: Marker, shouldFetchArtifactsFrom?: ShouldFetchArtifactsFromCallback | string[]):
    Promise<NearbyResultDelta> {
    if (!shouldFetchArtifactsFrom) {
      // If there's no callback provided, match to current origin.
      shouldFetchArtifactsFrom = (url: URL) => url.origin === window.location.origin;
    } else if (Array.isArray(shouldFetchArtifactsFrom)) {
      // If an array of strings, remap it.
      const origins = shouldFetchArtifactsFrom;
      shouldFetchArtifactsFrom = (url: URL) => !!origins.find(o => o === url.origin);
    }

    // If this marker is a URL, try loading artifacts from that URL
    const url = this.checkIsFetchableURL(marker.value, shouldFetchArtifactsFrom);
    if (url) {
      // TODO: fetchAsDocument here, pass that into loader.  Reuse doc below.

      const artifacts = await this.loadArtifactsFromHtmlUrl(url);
    }

    const results = await this.artdealer.markerFound(marker);

    // If any results have URL-only content -- try loading from the page itself
    for (const result of results.found) {
      // TODO: if this result is the same URL as the one we just fetched, re-use the doc.
      await this.attemptEnrichContentWithPageMetadata(result, shouldFetchArtifactsFrom);
    }
    // Do not enrich lost content.  Should only need target info.

    return results;
  }

  async markerLost(marker: Marker): Promise<NearbyResultDelta> {
    return this.artdealer.markerLost(marker);
  }

  async updateGeolocation(coords: GeoCoordinates): Promise<NearbyResultDelta> {
    return this.artdealer.updateGeolocation(coords);
  }

  private saveArtifacts(artifacts: ARArtifact[]) {
    for (const artifact of artifacts) {
      this.artstore.addArtifact(artifact);
    }
  }

  private checkIsFetchableURL(potentialUrl: string,
                              shouldFetchArtifactsFrom: ShouldFetchArtifactsFromCallback): URL | null {
    try {
      // This will throw if potentialUrl isn't a valid URL.
      // Do not supply a base url argument, since we do not want to support relative URLs,
      // and because that would turn lots of normal string values into valid relative URLs.
      const url = new URL(potentialUrl);
      if (shouldFetchArtifactsFrom(url)) {
        return url;
      }
    } catch (_) {
      // Fallthrough
    }
    return null;
  }

  private async tryExtractPageMetadata(
        potentialUrl: string,
        shouldFetchArtifactsFrom: ShouldFetchArtifactsFromCallback
      ): Promise<JsonLd | null> {
    const url = this.checkIsFetchableURL(potentialUrl, shouldFetchArtifactsFrom);
    if (url) {
      this.extractPageMetadata(url);
    }
    return null;
  }

  private async extractPageMetadata(url: URL): Promise<JsonLd | null> {
    const doc = await fetchAsDocument(url);
    if (doc) {
      const pageMetadata = await extractPageMetadata(doc, url);
      return pageMetadata;
    }
    return null;
  }

  private async attemptEnrichContentWithPageMetadata(
        result: NearbyResult,
        shouldFetchArtifactsFrom: ShouldFetchArtifactsFromCallback
      ): Promise<NearbyResult> {
    if (result.content) {
      if (typeof result.content === 'string') {
        // if arContent is a string, try to treat it as a URL
        const pageMetadata = await this.tryExtractPageMetadata(result.content, shouldFetchArtifactsFrom);
        if (pageMetadata) {
          // Override the string URL with the metadata object
          result.content = pageMetadata;
        }
      } else if ('url' in result.content && !('name' in result.content)) {
        // if arContent has a 'url' property, but lacks properties, check the page for missing metadata.
        // For now, make sure the @type's match exactly, so we only ever expand metadata.
        const pageMetadata = await this.tryExtractPageMetadata(result.content.url, shouldFetchArtifactsFrom);
        if (pageMetadata && pageMetadata['@type'] === result.content['@type']) {
          // Use the new metadata object, but keep all the existing property values.
          result.content = Object.assign(pageMetadata, result.content);
        }
      }
    }
    return result;
  }
}
