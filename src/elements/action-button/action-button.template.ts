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
}

button:focus,
button:hover {
  color: #222;
}
`;

export const html = `<button></button>`;
