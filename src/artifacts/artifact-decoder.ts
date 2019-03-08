/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export interface ArtifactParams {
  root? : object;
  datafeed? : object;
  arartifact? : object;
};

export interface JsonLd {
  '@type' : string;
  [propName: string]: any; // string | boolean | number | JsonLd | Array<JsonLd>
};

/*
 * ArtifactDecoder accepts a jsonld block and will extract and return valid ARArtifacts
 *
 * TODO: parsing is done manually and not using a JSON-LD library.
 * As such, parsing is not enforce correct formatting, does not do even do simple transformations, etc.
 * Only perfectly formed inputs work.
 *
 * TODO: Consider defining custom interface types for each supported JSON-LD @type.
 * Implement a FromJSON function for each, which handles variations.
 *
 * */
export class ArtifactDecoder {
  constructor() {
  }

  decode(jsonld: JsonLd): Array<ArtifactParams> {
    return this.decodeUnknown(jsonld, { root: jsonld }).flat(Number.MAX_SAFE_INTEGER);
  }

  private decodeUnknown(jsonld: JsonLd | Array<JsonLd>, params: ArtifactParams): Array<ArtifactParams> {
    if (Array.isArray(jsonld)) {
      return this.decodeArray(jsonld, params);
    }

    if (!('@type' in jsonld) || typeof jsonld['@type'] !== 'string') {
      return [];
    }

    switch (jsonld['@type'] as string) {
      case "DataFeed":
        return this.decodeDataFeed(jsonld, params);

      case "ARArtifact":
        return this.decodeArArtifact(jsonld, params);

      default:
        return [];
    }
  }

  private decodeArray(arr: Array<JsonLd>, params: ArtifactParams): Array<ArtifactParams> {
    return arr.map(e => this.decodeUnknown(e, params)).flat();
  }

  private decodeDataFeed(jsonld: JsonLd, params: ArtifactParams): Array<ArtifactParams> {
    params = Object.assign(params, { datafeed: jsonld });

    const elements = jsonld.dataFeedElement;
    if (!elements) return [];
    if (!Array.isArray(elements)) return this.decodeUnknown(elements, params);;

    return this.decodeArray(elements, params);
  }

  private decodeArArtifact(jsonld: JsonLd, params: ArtifactParams): Array<ArtifactParams> {
    params = Object.assign(params, { arartifact: jsonld });
    return [params];
  }
}
