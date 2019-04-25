# Perception Toolkit



This toolkit provides a set of components and utilities for developers to add an augmented experience to their website. For example, a primary use-case supported is the ability to detect barcodes (in -- say -- a real-world store) with the user's device camera, and to show them extended information on a given product.

Included in this toolkit is:

* Device Support Detection
  * Barcode Detector
  * getUserMedia and environment camera
  * Geolocation
  * Wasm
* Detectors
  * Barcode Detector (native / ZXing)
  * QR Codes (native / ZXing)
  * Geolocation (native)
  * (TODO) Planar Image
  * (TODO) ML Image Classification
* UI
  * Loader
  * Card
  * User onboarding
* Utilities
  * Stream capture (i.e. `getUserMedia` to image conversion)
  * Logging
  * Image resizing

## Installation

1. TODO.

The intended use is detailed under `demo/`, where you can see how to set up barcode detection and the display of values to the end user.

## Development

1. `git clone https://github.com/PolymerLabs/perception-toolkit`
1. `npm i`
1. `npm run build`
1. `npm run serve`
1. [Open the demo page at localhost:8080](http://localhost:8080)

## Building

`npm run build`

## Testing

`npm test`

_Note:_ coverage data can be found in the generated `coverage/` directory located in the project root.

## API Docs

`npm run docs`

_Note:_ docs can be found in the generated `docs` directory located in the project root.
