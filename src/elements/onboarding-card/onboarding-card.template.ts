/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export const styles = `
:host {
  --background: #FFF;
  --borderRadius: 4px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: 8px 16px;

  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;

  padding: var(--padding);
  border-radius: var(--borderRadius);
  font-family: var(--fontFamily);
  background: var(--background);
}

#container {
  color: var(--color);
  overflow: hidden;
  display: block;
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
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

export const html = `
<div id="container">
  <slot></slot>
  </div>
<div id="buttons"></div>`;
