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
const minify = require('minify');
const fs = require('fs');

const promFsWrite = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

const promFsRead = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, contents) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(contents);
    });
  });
}

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

async function buildBarcodeDetection() {
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
      format: 'iife'
    }
  }

  // Barcode Detection.
  const inputs = await promGlob('barcode-detection/*.ts');
  for (const input of inputs) {
    const newFileName = basename(input).replace(/ts$/, 'js');
    const moduleName = newFileName.replace(/\.js$/, '')
        .replace(/-(.)/, (v) => v.toUpperCase().substr(1));

    // Rollup parts.
    const name = `PerceptionToolkit.${moduleName}`;
    const file = `lib/bundled/barcode-detection/${newFileName}`;
    const bundle = await rollup.rollup({...options.input, input});
    await bundle.write({...options.output, file, name});
  }
}

async function minifyBarcodeDetection() {
  const files = await promGlob('lib/bundled/**/*.js', { ignore: '*.min.js' });
  const minifiedFiles = await Promise.all(files.map(file => minify(file)));
  await minifiedFiles.map((fileContents, idx) => {
    const newFileName = files[idx].replace(/js$/, 'min.js');
    return promFsWrite(newFileName, fileContents);
  });
}

async function build() {
  await buildBarcodeDetection();
  await minifyBarcodeDetection();
}

build();

