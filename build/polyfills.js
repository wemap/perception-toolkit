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

