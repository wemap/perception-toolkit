# Simple Config Demo

This demo showcases the simplest way to load Perception Toolkit in [`index.html`](./index.html).

## Instructions

1. Print out [barcode.gif](./products/barcode.gif), which represents the [product page](./products/product.html).
2. Run `npm run build && npm run serve`
3. Open [`https://localhost:8080/demo/1-simple-config/index.html`](https://localhost:8080/demo/1-simple-config/index.html)
4. Hit "Getting Started" and follow the onboarding instructions.
5. Scan the barcode!

## How does it work?

1. Dig in to the script on [`index.html`](./index.html) to see how the `PerceptionToolkit` is created.
2. Take look at the configuration value `artifactSources: ['./products/product.html']`, which tells PerceptionToolkit that there is a result defined on that product page.
3. Finally, the [product page](./products/product.html) defines an `ARArtifact` as structured data.  This links the Barcode you printed to the page content itself.

## Bonus: Dig In!

1. Try changing the Barcode `text` property to some other Barcode value (try using an existing product!), and refresh the page.
2. Try changing the property values of `WebPage` to see the Card content change when you scan the barcode.
