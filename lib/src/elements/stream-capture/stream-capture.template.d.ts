/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
export declare const styles = "\n:host {\n  position: relative;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: #333;\n  animation: fadeIn 0.3s cubic-bezier(0, 0, 0.3, 1) forwards;\n}\n\ncanvas {\n  width: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  object-fit: contain;\n}\n\n#reticle {\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  position: absolute;\n  opacity: 0;\n  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);\n}\n";
export declare const html = "<svg id=\"reticle\" viewBox=\"0 0 133 100\"\n    xmlns=\"http://www.w3.org/2000/svg\">\n  <mask id=\"reticle-cut-out\">\n    <rect id=\"reticle-cut-out-outer\" width=\"133\" height=\"100\" x=\"0\" y=\"0\"\n        fill=\"#FFF\" />\n    <rect id=\"reticle-cut-out-inner\" x=\"29\" y=\"13\" width=\"75\" height=\"75\" rx=\"2\"\n        ry=\"2\" fill=\"#000\" />\n  </mask>\n  <rect id=\"reticle-box\" width=\"133\" height=\"100\" x=\"0\" y=\"0\"\n      fill=\"rgba(0,0,0,0.4)\" mask=\"url(#reticle-cut-out)\" />\n</svg>";
