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

  decode(jsonld) {
    return this._decodeUnknown(jsonld, { root: jsonld }).flat();
  }

  _decodeUnknown(jsonld, params) {
    if (Array.isArray(jsonld)) {
      return this._decodeArray(jsonld, params);
    }

    if (!('@type' in jsonld)) {
      return;
    }

    const type = jsonld['@type']
    if (typeof type !== 'string') {
      return;
    }

    switch (type) {
      case "DataFeed":
        return this._decodeDataFeed(Object.assign(params, { datafeed: jsonld }));
        break;

      case "ARArtifact":
        return this._decodeArArtifact(Object.assign(params, { arartifact: jsonld }));
        break;

      default:
        break; // We ignore syntax we don't understand, and move on
    }
  }

  _decodeArray(arr, params) {
      return arr.map((e) => this._decodeUnknown(e, params));
  }

  _decodeDataFeed(params) {
    const { root, datafeed } = params;

    const arr = datafeed["dataFeedElement"];
    if (!arr) return [];
    if (!Array.isArray(arr)) arr = [arr];

    return this._decodeArray(arr, params);
  }

  _decodeArArtifact(params) {
    return Object.assign(params);
  }
}
