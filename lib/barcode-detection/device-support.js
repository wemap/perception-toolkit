/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { NoSupportCard } from '../src/elements/no-support-card/no-support-card.js';
import { DeviceSupport } from '../src/support/device-support.js';
import { GetUserMediaSupport } from '../src/support/get-user-media.js';
import { WasmSupport } from '../src/support/wasm.js';
export async function detectSupport() {
    const deviceSupport = new DeviceSupport();
    deviceSupport.addDetector(GetUserMediaSupport);
    const support = await deviceSupport.detect();
    if (!(support[GetUserMediaSupport.name] && support[WasmSupport.name])) {
        // Register custom elements.
        customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
        const noSupport = new NoSupportCard();
        document.body.appendChild(noSupport);
        return false;
    }
    return true;
}
//# sourceMappingURL=device-support.js.map