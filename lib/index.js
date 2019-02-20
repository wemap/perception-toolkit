/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// Detectors.
import * as BarcodeDetectors from './src/detectors/barcode.js';
export const detectors = {
    ...BarcodeDetectors,
};
// Elements.
import * as ActionButton from './src/elements/action-button/action-button.js';
import * as Card from './src/elements/card/card.js';
import * as DotLoader from './src/elements/dot-loader/dot-loader.js';
import * as NoSupportCard from './src/elements/no-support-card/no-support-card.js';
import * as OnboardingCard from './src/elements/onboarding-card/onboarding-card.js';
import * as StreamCapture from './src/elements/stream-capture/stream-capture.js';
export const elements = {
    ...ActionButton,
    ...Card,
    ...DotLoader,
    ...NoSupportCard,
    ...OnboardingCard,
    ...StreamCapture
};
// Support.
import * as BarcodeSupport from './src/support/barcode.js';
import * as DeviceSupport from './src/support/device-support.js';
import * as GeolocationSupport from './src/support/geolocation.js';
import * as GetUserMediaSupport from './src/support/get-user-media.js';
import * as IntersectionObserverSupport from './src/support/intersection-observer.js';
import * as WasmSupport from './src/support/wasm.js';
export const support = {
    ...BarcodeSupport,
    ...DeviceSupport,
    ...GeolocationSupport,
    ...GetUserMediaSupport,
    ...IntersectionObserverSupport,
    ...WasmSupport
};
// Utils.
import * as Clamp from './src/utils/clamp.js';
import * as DoubleRaf from './src/utils/double-raf.js';
import * as EnvironmentCamera from './src/utils/environment-camera.js';
import * as Fade from './src/utils/fade.js';
import * as Fire from './src/utils/fire.js';
import * as GeolocationAsync from './src/utils/geolocation-async.js';
import * as InjectScript from './src/utils/inject-script.js';
import * as Logger from './src/utils/logger.js';
import * as ResizeImage from './src/utils/resize-image.js';
export const utils = {
    ...Clamp,
    ...DoubleRaf,
    ...EnvironmentCamera,
    ...Fade,
    ...Fire,
    ...GeolocationAsync,
    ...InjectScript,
    ...Logger,
    ...ResizeImage
};
//# sourceMappingURL=index.js.map