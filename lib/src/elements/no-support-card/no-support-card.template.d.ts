/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
export declare const styles = "\n:host {\n  --baseline: 8px;\n  --background: #FFF;\n  --borderRadius: 4px;\n  --color: #333;\n  --fontFamily: 'Arial', 'Helvetica', sans-serif;\n  --padding: calc(var(--baseline) * 2)\n      calc(var(--baseline) * 4)\n      calc(var(--baseline) * 2)\n      calc(var(--baseline) * 3);\n\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  max-width: 80vw;\n  text-align: center;\n}\n\n#container {\n  padding: var(--padding);\n  border-radius: var(--borderRadius);\n  font-family: var(--fontFamily);\n  background: var(--background);\n  color: var(--color);\n}\n";
export declare const html = "<div id=\"container\"></div>";
