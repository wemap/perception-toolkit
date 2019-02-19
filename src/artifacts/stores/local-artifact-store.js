import { LocalMarkerStore } from './local-marker-store.js';
import { LocalGeoStore } from './local-geo-store.js';

/******************************************************************************/

// TODO: extend EventTarget and fire events whenever store changes
export class LocalArtifactStore {
  constructor() {
    this._marker_store = new LocalMarkerStore;
    this._geo_store = new LocalGeoStore;
  }

  addArtifact(artifact) {
    let target = artifact['arTarget'] || artifact['artarget'];

    if (!target) {
      return;
    }

    let target_type = target['@type'] || '';
    target_type = target_type.toLowerCase().trim();

    switch (target_type) {
      case "barcode":
        this._marker_store.addArtifact(artifact, target);
        break;

      // TODO: Support other target types

      default:
        break; // We ignore syntax we don't understand, and move on
    }
  }

  findRelevantArtifacts(nearbyMarkers, geo) {
    return this._marker_store.findRelevantArtifacts(nearbyMarkers);
  }
};

/******************************************************************************/
