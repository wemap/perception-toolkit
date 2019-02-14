/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/**
 * Detects whether the user's device supports an environment-facing camera.
 *
 * **Note: calling this function will provide the user with a camera access
 * permission prompt, assuming one has not already been issued (such as for
 * `getUserMedia`). As such this API is best deferred until camera access has
 * been granted by the user.**
 *
 * ```javascript
 * const devices = await navigator.mediaDevices.enumerateDevices();
 * const supportsEnvironmentCamera =
 *    await EnvironmentCamera.supportsEnvironmentCamera(devices);
 * ```
 */
export declare function supportsEnvironmentCamera(devices: MediaDeviceInfo[]): Promise<boolean>;
