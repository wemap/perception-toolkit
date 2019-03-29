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
export const styles = `
:host {
  --baseline: 8px;
  --height: calc(var(--baseline) * 6);
  position: relative;
  display: flex;
  height: var(--height);
}

button {
  width: 100%;
  height: 100%;
  align-items: center;
  border: none;
  background: none;
  font-size: 15px;
  color: #888;
  cursor: pointer;
  white-space: nowrap;
  padding: var(--baseline) calc(var(--baseline) * 2);
}

button:focus,
button:hover {
  color: #222;
}
`;
export const html = `<button></button>`;
//# sourceMappingURL=action-button.template.js.map