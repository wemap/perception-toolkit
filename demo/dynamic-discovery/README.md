# Simple Config Demo

This demo showcases a more advanced way to load multiple artifact sources into the Perception Toolkit, by waiting to discover them in the wild using URL Markers.

Instead of loading many HTML pages on startup (like in the simple demo), or a single large JSON+LD file (like in the artifact-map demo), we now load only what we need upon first discovery.  This tactic only works for URL based Markers such as QR-Codes.

## Instructions

1. Similar to other demos, pages and target images are in [`products/`](./products/) directory.  Print out targets, or open on a second screen.
2. Run `npm run build && npm run serve`
3. Open [`https://localhost:8080/demo/dynamic-discovery/index.html`](https://localhost:8080/demo/dynamic-discovery/index.html)
4. Scan the qr-codes.

## How does it work?

In previous demos, the real-world target to content relationship were loaded on startup, because the toolkit needs to know what to look for.  In this demo, we start with nothing, but still detect QR Codes.  If the QR Code is a URL, we fetch() load ARArtifacts.