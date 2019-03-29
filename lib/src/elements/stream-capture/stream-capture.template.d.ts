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
export declare const styles: string;
export declare const html = "<svg id=\"reticle\" viewBox=\"0 0 133 100\"\n    xmlns=\"http://www.w3.org/2000/svg\">\n  <mask id=\"reticle-cut-out\">\n    <rect id=\"reticle-cut-out-outer\" width=\"133\" height=\"100\" x=\"0\" y=\"0\"\n        fill=\"#FFF\" />\n    <rect id=\"reticle-cut-out-inner\" x=\"24\" y=\"8\" width=\"85\" height=\"85\" rx=\"2\"\n        ry=\"2\" fill=\"#000\" />\n  </mask>\n  <rect id=\"reticle-box\" width=\"133\" height=\"100\" x=\"0\" y=\"0\"\n      fill=\"rgba(0,0,0,0.4)\" mask=\"url(#reticle-cut-out)\" />\n</svg>\n<button id=\"close\">Close</button>\n";
