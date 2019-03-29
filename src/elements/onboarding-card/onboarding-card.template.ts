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
  --background: #FFF;
  --borderRadius: 4px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: 8px 8px 36px 8px;
  --buttonBottomMargin: 8px;
  --buttonSideMargin: 4px;
  --buttonActiveColor: #444;
  --buttonHoverColor: #666;
  --buttonInactiveColor: #AAA;
  --contentBorderRadius: 0px;

  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  outline: none;
  z-index: 1;
  overflow: auto;

  padding: var(--padding);
  border-radius: var(--borderRadius);
  font-family: var(--fontFamily);
  background: var(--background);
}

#container {
  color: var(--color);
  overflow: hidden;
  border-radius: var(--contentBorderRadius);
  display: block;
  cursor: pointer;
}

slot {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

slot::-webkit-scrollbar {
  display: none;
}

::slotted(*) {
  flex: 1 0 auto;
  scroll-snap-align: start;
}

#buttons {
  display: flex;
  height: 20px;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: var(--buttonBottomMargin);
}

#buttons button {
  margin: 0 var(--buttonSideMargin);
  font-size: 0;
  width: 18px;
  height: 18px;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
}

#buttons button::after {
  content: '';
  background: var(--buttonInactiveColor);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#buttons button::after:hover {
  background: var(--buttonHoverColor);
}

#buttons button.active::after {
  background: var(--buttonActiveColor);
}
`;

export const html = `
<div id="container">
  <slot></slot>
  </div>
<div id="buttons"></div>`;
