/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { ARArtifact } from './schema/ar-artifact.js';
import { JsonLd } from './schema/json-ld.js';

/*
 * ArtifactDecoder accepts a jsonld block and will extract and return valid ARArtifacts
 *
 * */
export class ArtifactDecoder {
  decode(jsonld: JsonLd): ARArtifact[] {
    return this.decodeUnknown(jsonld).flat();
  }

  private decodeUnknown(jsonld: JsonLd | JsonLd[]): ARArtifact[] {
    if (Array.isArray(jsonld)) {
      return this.decodeArray(jsonld);
    }

    if (!('@type' in jsonld) || typeof jsonld['@type'] !== 'string') {
      return [];
    }

    switch (jsonld['@type'] as string) {
      case 'DataFeed':
        return this.decodeDataFeed(jsonld);

      case 'ARArtifact':
        return this.decodeArArtifact(jsonld);

      default:
        return [];
    }
  }

  private decodeArray(arr: JsonLd[]): ARArtifact[] {
    return arr.map(e => this.decodeUnknown(e)).flat();
  }

  private decodeDataFeed(jsonld: JsonLd): ARArtifact[] {
    const elements = jsonld.dataFeedElement;
    if (!elements) {
      return [];
    }
    if (!Array.isArray(elements)) {
      return this.decodeUnknown(elements);
    }

    return this.decodeArray(elements);
  }

  private decodeArArtifact(jsonld: JsonLd): ARArtifact[] {
    return [jsonld as ARArtifact];
  }
}
