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
export async function supportsEnvironmentCamera(devices) {
    const cameras = devices.filter(t => t.kind === 'videoinput');
    return cameras.some((camera) => {
        if (!('getCapabilities' in camera)) {
            return false;
        }
        const capabilities = camera.getCapabilities();
        if (!capabilities.facingMode) {
            return false;
        }
        return capabilities.facingMode.find((f) => 'environment');
    });
}
//# sourceMappingURL=environment-camera.js.map