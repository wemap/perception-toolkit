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
  --baseline: 12px;
  position: fixed;
  display: block;
  top: 50%;
  left: 50%;
  min-width: 280px;
  padding: var(--baseline) calc(var(--baseline) * 2);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  color: #FFF;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  z-index: 2;
}
`;
