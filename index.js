#!/usr/bin/env node

/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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
