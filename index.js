#!/usr/bin/env node

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

const path = require('path');
const fs = require('fs');
const argv = require('yargs')
    .option('start', {
      alias: 's'
    })
    .option('dest', {
      alias: 'd',
      default: './sitemap.jsonld'
    })
    .option('follow-links', {
      alias: 'f',
      default: true,
      type: 'boolean'
    })
    .option('verbose', {
      alias: 'v',
      default: false,
      type: 'boolean'
    })
    .option('remap', {
      alias: 'r',
      type: 'string'
    })
    .argv;

if (!argv.start) {
  console.error('Must provide a start URL');
  process.exit(1);
}

if (!argv.start) {
  console.error('Must provide a dest path');
  process.exit(1);
}

const { visitUrls } = require('./main.js');

(async function (opts) {
  const { dest, verbose } = opts;
  const jsonLds = await visitUrls(opts);
  const targets = Array.from(jsonLds.values());
  if (targets.length === 0) {
    if (verbose) {
      console.warn('Did not find any targets');
    }
    process.exit(0);
  }

  const contents = JSON.stringify(targets, null, 2);
  const destPath = path.join(process.cwd(), dest);
  if (verbose) {
    console.log(`[Write]: ${destPath}`);
  }

  fs.writeFile(destPath, contents, 'utf8', (err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    process.exit(0);
  });
})(argv);
