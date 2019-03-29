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
export declare const styles = "\n:host {\n  --baseline: 8px;\n  --background: #FFF;\n  --borderRadius: 4px;\n  --color: #333;\n  --fontFamily: 'Arial', 'Helvetica', sans-serif;\n  --padding: calc(var(--baseline) * 2)\n      calc(var(--baseline) * 4)\n      calc(var(--baseline) * 2)\n      calc(var(--baseline) * 3);\n\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  max-width: 80vw;\n  text-align: center;\n}\n\n#container {\n  padding: var(--padding);\n  border-radius: var(--borderRadius);\n  font-family: var(--fontFamily);\n  background: var(--background);\n  color: var(--color);\n}\n";
export declare const html = "<div id=\"container\"></div>";
