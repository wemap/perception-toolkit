/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
export * from './defs/barcode.js';
export * from './defs/lib.js';
export * from './defs/wasm-module.js';
export declare const detectors: {
    detectBarcodes(data: HTMLCanvasElement | ImageBitmap | ImageData, { context, forceNewDetector, polyfillRequired, polyfillPrefix }?: {
        context?: Window | undefined;
        forceNewDetector?: boolean | undefined;
        polyfillRequired?: boolean | undefined;
        polyfillPrefix?: string | undefined;
    }): Promise<import("./defs/barcode.js").Barcode[]>;
};
import * as ActionButton from './src/elements/action-button/action-button.js';
import * as Card from './src/elements/card/card.js';
import * as DotLoader from './src/elements/dot-loader/dot-loader.js';
import * as NoSupportCard from './src/elements/no-support-card/no-support-card.js';
import * as OnboardingCard from './src/elements/onboarding-card/onboarding-card.js';
import * as StreamCapture from './src/elements/stream-capture/stream-capture.js';
export declare const elements: {
    StreamCapture: typeof StreamCapture.StreamCapture;
    loadIntersectionObserverPolyfillIfNeeded(force?: boolean): Promise<boolean>;
    OnboardingCard: typeof OnboardingCard.OnboardingCard;
    NoSupportCard: typeof NoSupportCard.NoSupportCard;
    DotLoader: typeof DotLoader.DotLoader;
    Card: typeof Card.Card;
    ActionButton: typeof ActionButton.ActionButton;
};
import * as DeviceSupport from './src/support/device-support.js';
export declare const support: {
    WasmSupport: {
        name: string;
        supported: () => Promise<boolean>;
    };
    IntersectionObserverSupport: {
        name: string;
        supported: () => Promise<boolean>;
    };
    GetUserMediaSupport: {
        name: string;
        supported: () => Promise<boolean>;
    };
    GeolocationSupport: {
        name: string;
        supported: () => Promise<boolean>;
    };
    DeviceSupport: typeof DeviceSupport.DeviceSupport;
    BarcodeDetectorSupport: {
        name: string;
        supported: () => Promise<boolean>;
    };
};
import * as Logger from './src/utils/logger.js';
import * as ResizeImage from './src/utils/resize-image.js';
export declare const utils: {
    resize(img: HTMLImageElement, { width, height, format }?: {
        width?: number | undefined;
        height?: number | undefined;
        format?: ResizeImage.ResizeFormat | undefined;
    }): Promise<HTMLImageElement | ImageData>;
    ResizeFormat: typeof ResizeImage.ResizeFormat;
    DEFAULT_WIDTH: 100;
    DEFAULT_HEIGHT: 100;
    enableLogLevel(level: Logger.DEBUG_LEVEL): void;
    log(msg: any, level?: Logger.DEBUG_LEVEL, tag?: string | undefined): void;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    DEBUG_LEVEL: typeof Logger.DEBUG_LEVEL;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    injectScript(src: string): Promise<{}>;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    geolocation(): Promise<Coordinates>;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    fire(name: string, target: HTMLElement | Window, detail?: {} | undefined): void;
    fade(target: HTMLElement, { from, to, duration, ease }?: {
        from?: number | undefined;
        to?: number | undefined;
        duration?: number | undefined;
        ease?: ((value: number) => number) | undefined;
    }): Promise<void>;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    supportsEnvironmentCamera(devices: MediaDeviceInfo[]): Promise<boolean>;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    doubleRaf(): Promise<void>;
    /**
     * @license
     * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    clamp(value: number, min?: number, max?: number): number;
};
