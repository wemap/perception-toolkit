# Simple Config Demo

This demo showcases the simplest way to load Perception Toolkit.  Start by taking a look at [`index.html`](./index.html).

## Instructions

First, print out (or, open on a second screen) these real world targets:
* [barcode.gif](./pages/barcode.gif), which targets [pages/barcode.html](./pages/barcode.html).
* [lighthouse.jpg](./pages/lighthouse.jpg), which targets [pages/lighthouse.html](./pages/lighthouse.html).
* [life-before-google.jpeg](./pages/life-before-google.jpeg), which targets [pages/life-before-google.html](./pages/life-before-google.html).

Next, open the page which hosts the Perception Toolkit:
1. Run `npm run build && npm run serve`
2. Open [`https://localhost:8080/demo/simple/index.html`](https://localhost:8080/demo/simple/index.html)
3. Hit "Getting Started" and follow the onboarding steps.
4. Scan the targets you printed!

## How does it work?

1. Dig in to the script on [`index.html`](./index.html) to see how the `PerceptionToolkit` is created.
2. Take look at the configuration value `artifactSources: [ ... ]`, which tells PerceptionToolkit that there are pages with camera targets defined.
3. Finally, look at the [pages](./pages/) themselves, to see how they define `ARArtifact`'s as structured data.

## Bonus: Dig In!

1. Try changing the Barcode `text` property to some other Barcode value (try using an existing product!), and refresh the page.
2. Try changing the property values of `WebPage` to see the Card content change when you scan the barcode.

Sorry, creating your own image targets requires a bit of pre-processing work, which we will dig into later.
