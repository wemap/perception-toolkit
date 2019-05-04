# Simple Config Demo

This demo showcases the best way to load multiple artifact sources into the Perception Toolkit.  See [`index.html`](./index.html) for details.

Instead of loading many HTML pages on startup, load a single concise JSON+LD file.

## Instructions

TODO, similar to other demos, but with more targets.

## How does it work?

1. First, look at this JSON+LD [`ar-artifact-map.jsonld`](./ar-artifact-map.jsonld) file, to see how a list of artifacts are defined.
2. Dig in to the script on [`index.html`](./index.html) to see how the `PerceptionToolkit` is created, and
3. Take look at how the `<script type="application/ld+json" src=...>` artifact map is embeded in the `<head>`, which tells PerceptionToolkit that there are a bunch of artifacts to look for.
