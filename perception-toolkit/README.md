# Barcode Detection

This folder contains the bundles and 'entry point' for the Barcode Detection
experience.

## Entry Point

We also provide the `barcode-detection.ts` entry point file. This file takes
responsibility for loading the bundles (see below).

In order to include the Barcode Detector in your page, therefore, you add the
following script to your page:

```html
<script src="/lib/bundled/barcode-detection/barcode-detection.min.js"></script>
```

## Configuration

There are a number of options that you can use to configure the behaviour of the
experience.

```html
<script>
  window.PerceptionToolkit = window.PerceptionToolkit || {};
  window.PerceptionToolkit.config = {
    // The button to use for starting the capture.
    button: document.getElementById('get-started'),

    // Whether to show an onboarding flow.
    onboarding: true,

    // The images to use for onboarding. These should all be
    // the same dimensions.
    onboardingImages: [
      '/demo/images/step1.jpg',
      '/demo/images/step2.jpg',
      '/demo/images/step3.jpg'
    ],

    // The time to wait in milliseconds before showing a hint
    // to the user during capture.
    hintTimeout: 7000
  };
</script>
```

**Please note: you should place this block _above_ the entry point's `script`.**

## Bundles

The experience is separated into bundles to support progressive loading. For example, the main experience is loaded while the onboarding is in process. There are four bundles.

1. `loader.ts`: handles the UI for loading.
2. `device-support.ts`: handles testing the device for `getUserMedia` and WebAssembly support.
3. `onboarding.ts`: handles the onboarding interface.
4. `main.ts`: handles the main logic of capturing frames and detecting barcodes.

Each of these bundles is compiled and available in `lib/bundled/barcode-detection`
as minified JavaScript. As each file loads it puts its API onto `window.PerceptionToolkit`.

