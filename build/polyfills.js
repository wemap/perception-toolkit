/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const glob = require('glob').Glob;
const typescript = require('rollup-plugin-typescript');
const { basename } = require('path');
const rollup = require('rollup');

const promGlob = (path, opts = {}) => {
  return new Promise((resolve, reject) => {
    glob(path, opts, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(files);
    })
  });
}

async function build() {
  const options = {
    input: {
      plugins: [
        typescript({
          lib: ['dom', 'dom.iterable', 'es2015'],
          downlevelIteration: true
        })
      ]
    },

    output: {
      format: 'iife',
      name: 'Polyfills'
    }
  }
  const polyfills = await promGlob('src/polyfill/*.ts');
  for (const polyfill of polyfills) {
    const newFileName = basename(polyfill).replace(/ts$/, 'js');
    const file = `lib/polyfills/${newFileName}`;
    const bundle = await rollup.rollup({...options.input, input: polyfill});
    await bundle.write({...options.output, file});
  }
}

build();

