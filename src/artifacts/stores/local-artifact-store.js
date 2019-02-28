import { LocalMarkerStore } from './local-marker-store.js';

/******************************************************************************/

// TODO: extend EventTarget and fire events whenever store changes
export class LocalArtifactStore {
  constructor() {
    this._markerStore = new LocalMarkerStore;
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
        this._markerStore.addArtifact(artifact, target);
        break;

      // TODO: Support other target types

      default:
        break; // We ignore syntax we don't understand, and move on
    }
  }

  findRelevantArtifacts(nearbyMarkers, geo) {
    return this._markerStore.findRelevantArtifacts(nearbyMarkers);
  }
};

/******************************************************************************/
