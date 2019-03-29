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
export declare const styles = "\n:host {\n  --background: #FFF;\n  --borderRadius: 4px;\n  --color: #333;\n  --fontFamily: 'Arial', 'Helvetica', sans-serif;\n  --padding: 8px 8px 36px 8px;\n  --buttonBottomMargin: 8px;\n  --buttonSideMargin: 4px;\n  --buttonActiveColor: #444;\n  --buttonHoverColor: #666;\n  --buttonInactiveColor: #AAA;\n  --contentBorderRadius: 0px;\n\n  position: relative;\n  align-items: center;\n  justify-content: center;\n  display: flex;\n  flex-direction: column;\n  outline: none;\n  z-index: 1;\n  overflow: auto;\n\n  padding: var(--padding);\n  border-radius: var(--borderRadius);\n  font-family: var(--fontFamily);\n  background: var(--background);\n}\n\n#container {\n  color: var(--color);\n  overflow: hidden;\n  border-radius: var(--contentBorderRadius);\n  display: block;\n  cursor: pointer;\n}\n\nslot {\n  display: flex;\n  overflow-x: scroll;\n  scroll-snap-type: x mandatory;\n  scrollbar-width: none;\n}\n\nslot::-webkit-scrollbar {\n  display: none;\n}\n\n::slotted(*) {\n  flex: 1 0 auto;\n  scroll-snap-align: start;\n}\n\n#buttons {\n  display: flex;\n  height: 20px;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  bottom: var(--buttonBottomMargin);\n}\n\n#buttons button {\n  margin: 0 var(--buttonSideMargin);\n  font-size: 0;\n  width: 18px;\n  height: 18px;\n  position: relative;\n  background: none;\n  border: none;\n  cursor: pointer;\n}\n\n#buttons button::after {\n  content: '';\n  background: var(--buttonInactiveColor);\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\n#buttons button::after:hover {\n  background: var(--buttonHoverColor);\n}\n\n#buttons button.active::after {\n  background: var(--buttonActiveColor);\n}\n";
export declare const html = "\n<div id=\"container\">\n  <slot></slot>\n  </div>\n<div id=\"buttons\"></div>";
