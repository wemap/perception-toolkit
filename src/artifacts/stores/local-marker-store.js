/******************************************************************************/

function generateMarkerId(value, type) {
  return type + '##' + value;
}

/******************************************************************************/

export class LocalMarkerStore {
  constructor() {
    this._markers = new Map;
  }

  addArtifact(artifact,  marker) {
    // TODO: handle types
    let marker_value = marker.text;

    this._markers.set(marker_value, { target: marker, artifact });
  }

  findRelevantArtifacts(nearbyMarkers) {
    let ret = [];
    for (let nearbyMarker of nearbyMarkers) {
      let targetAndArtifact = this._markers.get(nearbyMarker.value);
      if (targetAndArtifact) ret.push(targetAndArtifact);
    }
    return ret;
  }
}
