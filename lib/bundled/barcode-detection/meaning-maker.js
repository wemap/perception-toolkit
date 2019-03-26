this.PerceptionToolkit = this.PerceptionToolkit || {};
this.PerceptionToolkit.meaningMaker = (function (exports) {
  'use strict';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  /**
   * Convert a marker type (barcode, qrcode, etc) and its value into a unique id
   *
   */
  function generateMarkerId(type, value) {
      return type + '__' + value;
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  class ArtifactDealer {
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
          const pendingNearbyResults = new Set(this.artstores.map((artstore) => {
              return artstore.findRelevantArtifacts(Array.from(this.nearbyMarkers.values()), this.currentGeolocation);
          }).flat(1));
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

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  /*
   * ArtifactDecoder accepts a jsonld block and will extract and return valid ARArtifacts
   *
   * */
  class ArtifactDecoder {
      decode(jsonld) {
          return this.decodeUnknown(jsonld).flat();
      }
      decodeUnknown(jsonld) {
          if (Array.isArray(jsonld)) {
              return this.decodeArray(jsonld);
          }
          if (!('@type' in jsonld) || typeof jsonld['@type'] !== 'string') {
              return [];
          }
          switch (jsonld['@type']) {
              case 'DataFeed':
                  return this.decodeDataFeed(jsonld);
              case 'ARArtifact':
                  return this.decodeArArtifact(jsonld);
              default:
                  return [];
          }
      }
      decodeArray(arr) {
          return arr.map(e => this.decodeUnknown(e)).flat();
      }
      decodeDataFeed(jsonld) {
          const elements = jsonld.dataFeedElement;
          if (!elements) {
              return [];
          }
          if (!Array.isArray(elements)) {
              return this.decodeUnknown(elements);
          }
          return this.decodeArray(elements);
      }
      decodeArArtifact(jsonld) {
          return [jsonld];
      }
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  // TODO: Consider merging from*Url functions and just branching on response content-type
  class ArtifactLoader {
      constructor() {
          this.decoder = new ArtifactDecoder();
      }
      // TODO (#35): Change ArtifactsLoader to only "index" URLs where Artifacts could actually exist
      async fromHtmlUrl(url) {
          // Note: according to MDN, can use XHR request to create Document direct from URL
          // This may be better, because could have document.location.href (etc) settings automatically?
          // Note: this already proved issue when getting .src property of script/link tags, since relative
          // Urls are based off this document root, not the fetched source.
          const response = await fetch(url.toString());
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          return this.fromElement(doc, url);
      }
      async fromJsonUrl(url) {
          const response = await fetch(url.toString());
          if (!response.ok) {
              throw Error(response.statusText);
          }
          const json = await response.json();
          return this.fromJson(json);
      }
      async fromElement(el, url) {
          const ret = [];
          const inlineScripts = el.querySelectorAll('script[type=\'application/ld+json\']:not([src])');
          for (const jsonldScript of inlineScripts) {
              ret.push(this.fromJson(JSON.parse(jsonldScript.textContent || '')));
          }
          const externalScripts = el.querySelectorAll('script[type=\'application/ld+json\'][src]');
          for (const jsonldScript of externalScripts) {
              const src = jsonldScript.getAttribute('src');
              if (!src) {
                  continue;
              }
              ret.push(this.fromJsonUrl(new URL(src, /* base= */ url)));
          }
          const jsonldLinks = el.querySelectorAll('link[rel=\'alternate\'][type=\'application/ld+json\'][href]');
          for (const jsonldLink of jsonldLinks) {
              const href = jsonldLink.getAttribute('href');
              if (!href) {
                  continue;
              }
              ret.push(this.fromJsonUrl(new URL(href, /* base= */ url)));
          }
          return (await Promise.all(ret)).flat(1);
      }
      async fromJson(json) {
          return this.decoder.decode(json);
      }
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  class LocalMarkerStore {
      constructor() {
          this.markers = new Map();
      }
      addMarker(artifact, barcode) {
          if (!barcode.text) {
              return;
          }
          this.markers.set(barcode.text, { target: barcode, artifact });
      }
      findRelevantArtifacts(markers) {
          const ret = [];
          for (const marker of markers) {
              if (!marker.value) {
                  continue;
              }
              const nearbyResult = this.markers.get(marker.value);
              if (nearbyResult) {
                  ret.push(nearbyResult);
              }
          }
          return ret;
      }
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  class LocalArtifactStore {
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

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
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
  class MeaningMaker {
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

  exports.MeaningMaker = MeaningMaker;

  return exports;

}({}));
