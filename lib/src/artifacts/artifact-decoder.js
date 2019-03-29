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
import { flatMap } from '../utils/flat-map.js';
/*
 * ArtifactDecoder accepts a jsonld block and will extract and return valid ARArtifacts
 *
 * */
export class ArtifactDecoder {
    decode(jsonld) {
        return this.decodeUnknown(jsonld);
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
        return flatMap(arr, e => this.decodeUnknown(e));
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
//# sourceMappingURL=artifact-decoder.js.map