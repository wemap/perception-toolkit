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
export declare const styles = "\n:host {\n  --baseline: 8px;\n  --height: calc(var(--baseline) * 6);\n  position: relative;\n  display: flex;\n  height: var(--height);\n}\n\nbutton {\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  border: none;\n  background: none;\n  font-size: 15px;\n  color: #888;\n  cursor: pointer;\n  white-space: nowrap;\n  padding: var(--baseline) calc(var(--baseline) * 2);\n}\n\nbutton:focus,\nbutton:hover {\n  color: #222;\n}\n";
export declare const html = "<button></button>";
