
/******************************************************************************/

function generateMarkerId(value, type) {
  return type + '##' + value;
}

/******************************************************************************/

export class ArtifactDealer extends EventTarget {
  constructor() {
    super();

    this._artstores = [];

    this._currentGeolocation = null;
    this._nearbyMarkers = new Map;
    this._nearbyArtifacts = new Set;
  }

  addArtifactStore(artstore) {
    this._artstores.push(artstore);
    // TODO: Subscribe for artstore update events, call _generateEvents each update.

    this._generateEvents();
  }

  updateGeolocation(coords) {
    this._currentGeolocation = coords;
    this._generateEvents();
  }

  markerFound(value, type) {
    this._nearbyMarkers.set(generateMarkerId(value, type), { value, type });
    this._generateEvents();
  }

  markerLost(value, type) {
    this._nearbyMarkers.delete(generateMarkerId(value, type));
    this._generateEvents();
  }

  _generateEvents() {
    // 1. Using current context (geo, markers), ask artstores for eligible artifacts
    let pendingNearbyArtifacts = new Set(this._artstores.flatMap((artstore) => {
      return artstore.findRelevantArtifacts(
        Array.from(this._nearbyMarkers.values()),
        this._currentGeolocation
      );
    }));

    // 2. Diff with previous.  New ones are those which haven't appeared before.  Old ones are those which
    // are no longer nearby.  Intersection is not interesting.
    let newNearbyArtifacts = [...pendingNearbyArtifacts].filter(a => !this._nearbyArtifacts.has(a));
    let oldNearbyArtifacts = [...this._nearbyArtifacts].filter(a => !pendingNearbyArtifacts.has(a));

    // 3. Fire events
    // new artifacts =>'nearby-content-found' event
    for (let { target, artifact } of newNearbyArtifacts) {
      let content = artifact['arcontent'] || artifact['arContent'];

      this.dispatchEvent(
        new CustomEvent('nearby-content-found', { detail: { target, content }, bubbles: false })
      );
    }

    // old artifacts =>'nearby-content-lost' event
    for (let { target, artifact } of oldNearbyArtifacts) {
      let content = artifact['arcontent'] || artifact['arContent'];

      this.dispatchEvent(
        new CustomEvent('nearby-content-lost', { detail: { target, content }, bubbles: false })
      );
    }

    // 4. Update current set of nearbyArtifacts.
    this._nearbyArtifacts = pendingNearbyArtifacts;
  }

}

/******************************************************************************/
