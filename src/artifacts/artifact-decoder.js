/******************************************************************************/

/*
 * decoder accepts a jsonld block and will walk its tree emitting events
 * whenever if finds a new DataFeed, ArArtifact, or certain types of Anchors
 *
 * Events:
 * - 'data-feed-found'
 * - 'artifact-found'
 *
 * Each event will include references to:
 * - the root jsonld originally provided,
 * - the enclosing DataFeed and/or ArArtifact, when applicable.
 *
 * TODO: parsing is done manually and not using a JSON-LD library.
 * As such, parsing is not enforcing correct formatting, does not support case insensitivity,
 * does not do even simple transformations, etc.  Only perfectly formed inputs work.
 *
 * TODO: Consider defining custom interface types for each supported JSON-LD @type.
 * Implement a FromJSON function for each, which handles variations.
 *
 * TODO: Events refer only back to a single root artifact or datafeed.  While the decoder
 * does support nested DataFeeds, you will not know about grandparent DataFeeds from
 * fired events.
 *
 * */
export class ArtifactDecoder extends EventTarget {
  constructor() {
    super();
  }

  decode(jsonld) {
    //this._makeCaseInsensitive(jsonld);
    this._decodeUnknown(jsonld, { root: jsonld });
  }

/*
  _makeCaseInsensitive(jsonld) {
    // TODO: this isn't working well, and, doesn't work for "prop in obj" checks anyway.
    Object.defineProperty(jsonld, "getProp", {
      value: (prop) => {
        for (let key in this) {
          if (key.toLowerCase() == prop.toLowerCase()) {
            return this[key];
          }
        }
      }
    });

    Object.defineProperty(jsonld, "setProp", {
      value: (prop, val) => {
        for (let key in this) {
          if (key.toLowerCase() == prop.toLowerCase()) {
            this[key] = val;
            return val;
          }
        }
        this[prop] = val;
        return val;
      }
    });
  }
*/
  _decodeUnknown(jsonld, params) {
    if (Array.isArray(jsonld)) {
      for (let e of jsonld) {
        this._decodeUnknown(e, Object.assign(params));
      }
      return;
    }

    if (!('@type' in jsonld)) {
      //console.warn("Json-ld does not contain @type");
      return;
    }

    let type = jsonld['@type']

    if (typeof type !== 'string') {
      //console.warn("Json-ld @type is not string");
      return;
    }

    type = type.toLowerCase().trim();

    switch (type) {
      case "datafeed":
        this._decodeDataFeed(Object.assign(params, { datafeed: jsonld }));
        break;

      case "arartifact":
        this._decodeArArtifact(Object.assign(params, { arartifact: jsonld }));
        break;

      default:
        break; // We ignore syntax we don't understand, and move on
    }
  }

  _decodeDataFeed(params) {
    let { root, datafeed } = params;

    this.dispatchEvent(new CustomEvent('data-feed-found', { detail: Object.assign({}, params) }));

    for (let dataFeedElement of (datafeed["dataFeedElement"] || [])) {
      this._decodeUnknown(dataFeedElement, params);
    }
  }

  _decodeArArtifact(params) {
    let { root, datafeed, arartifact } = params;

    this.dispatchEvent(new CustomEvent('artifact-found', { detail: Object.assign({}, params) }));
  }

  // TODO: _decodeTarget should fire events specific to the target type.
  // We specifically want to handle QrCode, Barcode, Augmented Image, etc
/*
  _decodeTarget(params) {
    let { root, datafeed, arartifact, landmark } = params;

    // http://schema.org/GeoCoordinates
    let { address, addressCountry, elevation, latitude, longitude, postalCode } = nearby;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    if (latitude && longitude) {
      // Optional elevation
      // types are Number or Text
      [latitude, longitude,  elevation]
    }

    if (address) {
      // Optional addressCountry, postalCode
      // types are Text or http://schema.org/PostalAddress
      [address, addressCountry, postalCode]
    }
  }

  _decodeAsset(rootld, nodeld) {
  }
  */
}

/******************************************************************************/

