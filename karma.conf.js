/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

module.exports = function(config) {
  const options = {
    basePath: "",

    files: [
      'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      {
        pattern: 'src/**/*.ts'
      }
    ],

    reporters: ["dots", "karma-typescript"],

    preprocessors: {
      'src/**/*.ts': ['karma-typescript']
    },

    frameworks: ["detectBrowsers", "mocha", "chai", "karma-typescript"],

    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: /_test.tsx?$/
      }
    },

    detectBrowsers: {
      postDetection(availableBrowsers) {
        const browsers = ["ChromeHeadless"];

        if (availableBrowsers.includes("Safari")) {
          browsers.push("Safari");
        }

        if (availableBrowsers.includes("Firefox")) {
          browsers.push("Firefox");
        }

        return browsers;
      }
    },

    plugins: [
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-safari-launcher",
      "karma-detect-browsers",
      "karma-mocha",
      "karma-chai",
      "karma-typescript"
    ],

    singleRun: true,
  };

  config.set(options);
};
