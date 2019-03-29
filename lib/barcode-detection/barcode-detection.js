/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Card } from '../src/elements/index.js';
import { DeviceSupport } from '../src/support/device-support.js';
import { GetUserMediaSupport } from '../src/support/get-user-media.js';
import { WasmSupport } from '../src/support/wasm.js';
import { injectScript } from '../src/utils/inject-script.js';
/**
 * Load all the basics.
 */
const load = new Promise(async (resolve) => {
    const { config } = window.PerceptionToolkit;
    const { root = '', showLoaderDuringBoot = true } = config;
    // Detect the necessary support.
    const deviceSupport = new DeviceSupport();
    deviceSupport.addDetector(GetUserMediaSupport);
    deviceSupport.addDetector(WasmSupport);
    const support = await deviceSupport.detect();
    // If everything necessary is supported, inject the loader and show it if
    // desired.
    if (support[GetUserMediaSupport.name] && support[WasmSupport.name]) {
        await injectScript(`${root}/lib/bundled/barcode-detection/loader.min.js`);
        // Only show the loader if requested.
        if (showLoaderDuringBoot) {
            const { showLoader } = window.PerceptionToolkit.loader;
            showLoader();
        }
        // Conditionally load the onboarding.
        if (config.onboarding && config.onboardingImages) {
            // Start by checking if the user has seen the onboarding before.
            await injectScript(`${root}/third_party/idb-keyval/idb-keyval-iife.min.js`);
            const { idbKeyval } = window;
            const onboarded = await idbKeyval.get('onboarded');
            if (!onboarded) {
                await injectScript(`${root}/lib/bundled/barcode-detection/onboarding.min.js`);
            }
        }
        resolve(true);
    }
    else {
        resolve(false);
    }
});
(async function addEventListeners() {
    const supported = await load;
    const { hideLoader, showLoader } = window.PerceptionToolkit.loader;
    const { config } = window.PerceptionToolkit;
    const { buttonVisibilityClass = 'visible' } = config;
    const getStarted = config.button ? config.button :
        config.buttonSelector ? document.body.querySelector(config.buttonSelector) :
            null;
    hideLoader();
    if (!getStarted) {
        return;
    }
    getStarted.classList.toggle(buttonVisibilityClass, supported);
    // When getStarted is clicked, load the experience.
    getStarted.addEventListener('click', (e) => {
        // If the button was visible and the user clicked it, show the no support
        // card here.
        if (!supported) {
            if (!customElements.get(Card.defaultTagName)) {
                customElements.define(Card.defaultTagName, Card);
            }
            const noSupport = new Card();
            noSupport.classList.add('no-support');
            noSupport.src =
                'Sorry, this browser does not support the required features';
            document.body.appendChild(noSupport);
            return;
        }
        showLoader();
        getStarted.classList.remove(buttonVisibilityClass);
        initializeExperience();
    });
    // When captureclose is fired, show the button again.
    window.addEventListener('captureclose', () => {
        getStarted.classList.add(buttonVisibilityClass);
    });
})();
let mainHasLoaded;
/**
 * Initialize the experience.
 */
export async function initializeExperience() {
    const supported = await load;
    if (!supported) {
        return;
    }
    const { idbKeyval } = window;
    const { showLoader, hideLoader } = window.PerceptionToolkit.loader;
    const { config } = window.PerceptionToolkit;
    const { root = '', sitemapUrl, detectionMode } = config;
    if (config && config.onboardingImages && config.onboarding) {
        // Recall whether the user has done onboarding before.
        const onboarded = await idbKeyval.get('onboarded');
        if (!onboarded) {
            hideLoader();
            const { startOnboardingProcess } = window.PerceptionToolkit.onboarding;
            await startOnboardingProcess(config.onboardingImages);
            // Store for next time.
            await idbKeyval.set('onboarded', true);
        }
    }
    showLoader();
    // Load the main experience if necessary.
    if (!mainHasLoaded) {
        mainHasLoaded =
            await injectScript(`${root}/lib/bundled/barcode-detection/main.min.js`);
    }
    const { initialize } = window.PerceptionToolkit.main;
    initialize({ detectionMode, sitemapUrl });
}
//# sourceMappingURL=barcode-detection.js.map