/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
export declare const styles = "\n:host {\n  --baseline: 8px;\n  --height: calc(var(--baseline) * 6);\n  position: relative;\n  display: flex;\n  height: var(--height);\n}\n\nbutton {\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  border: none;\n  background: none;\n  font-size: 15px;\n  color: #888;\n  cursor: pointer;\n  white-space: nowrap;\n  padding: var(--baseline) calc(var(--baseline) * 2);\n}\n\nbutton:focus,\nbutton:hover {\n  color: #222;\n}\n";
export declare const html = "<button></button>";
