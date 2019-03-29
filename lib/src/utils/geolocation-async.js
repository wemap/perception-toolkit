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
 * A convenience function that remaps the Geolocation API to a Promise.
 *
 * ```javascript
 * const location = await geolocation();
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
export async function geolocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((e) => resolve(e.coords), reject);
    });
}
//# sourceMappingURL=geolocation-async.js.map