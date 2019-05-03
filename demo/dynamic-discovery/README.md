# Simple Config Demo

This demo showcases a more advanced way to load multiple artifact sources into the Perception Toolkit, by waiting to discover them in the wild using URL Markers.  See [`index.html`](./index.html) for details.

Instead of loading many HTML pages on startup, or even a single large JSON+LD file, only load what we need upon first discovery.  This tactic only works for URL based markers such as QR-Codes.

## Instructions

TODO, similar to other demos, but with more targets.

## How does it work?

TODO, similar to other demos, but uses a QR Code with URL to product page, and that product page has an `arTarget` with the exact same URL as the `Barcode.text` value.
