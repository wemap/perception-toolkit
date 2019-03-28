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

const fs = require('fs');
const puppeteer = require('puppeteer');
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
    .argv;

if (!argv.start) {
  console.error('Must provide a start URL');
  process.exit(1);
}

if (!argv.start) {
  console.error('Must provide a dest path');
  process.exit(1);
}

let browserInstance;
async function getBrowser() {
  if (browserInstance) {
    return browserInstance;
  }

  browserInstance = await puppeteer.launch();
  return browserInstance;
}

async function closeBrowser() {
  await browserInstance.close();
  browserInstance = undefined;
}

function isHtml(response) {
  let isHtml = false;

  const headers = response.headers();
  for (const header of Object.keys(headers)) {
    if (header.toLowerCase() === 'content-type') {
      isHtml = /text\/html/.test(headers[header]);
      break;
    }
  }

  return isHtml;
}

function isSitemapXML(response) {
  let isSitemap = response.url().endsWith('sitemap.xml');

  const headers = response.headers();
  for (const header of Object.keys(headers)) {
    if (header.toLowerCase() === 'content-type') {
      isSitemap = isSitemap && /xml/.test(headers[header]);
      break;
    }
  }

  return isSitemap;
}

function getPageUrls() {
  const currentOrigin = window.location.origin;
  const linkedUrls = document.querySelectorAll('a');

  // Ensure we only get links from the current origin.
  return Array.from(linkedUrls)
      .filter((l) => new URL(l.href).origin === currentOrigin)
      .map((l) => l.href);
}

function getSitemapUrls() {
  const linkedUrls = document.querySelectorAll('loc');
  return Array.from(linkedUrls).map((l) => l.textContent);
}

function getJsonLd() {
  const jsonLd =
      document.querySelectorAll('script[type="application/json+ld"]');
  const jsonLds = Array.from(jsonLd);

  const jsonLdValues = jsonLds.map((l) => {
    // If the JSON-LD is linked, fetch it.
    if (l.hasAttribute('src')) {
      return fetch(l.getAttribute('src')).then(r => r.text());
    } else {  // Return it as-is.
      return Promise.resolve(l.textContent);
    }
  })

  return Promise.all(jsonLdValues);
}

function generateJsonLdFromPage() {
  let description = '';
  let image = '';
  let title = '';
  document.querySelectorAll('meta').forEach(meta => {
    const item = meta.getAttribute('itemprop') || meta.getAttribute('name');

    switch (item) {
      case 'twitter:title':
      case 'name':
        title = meta.getAttribute('content');
        break;

      case 'twitter:image':
      case 'image':
        image = meta.getAttribute('content');
        break;

      case 'twitter:description':
      case 'description':
        description = meta.getAttribute('content');
        break;

      default: break;
    }
  });

  return {
    "@type": "WebPage",
    "url": window.location.toString(),
    "name": title || document.title,
    "image": image || '',
    "description": description || ''
  };
}

async function visitUrls() {
  const jsonLdFound = new Map();
  const { start, followLinks, verbose } = argv;
  const toVisit = new Set();
  const haveVisited = new Set();

  const visitUrl = async (url) => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    let foundUrls = [];
    try {
      if (verbose) {
        console.log(`[Visit]: ${url}`);
      }

      haveVisited.add(url);
      toVisit.delete(url);

      const response = await page.goto(url);
      if (isHtml(response)) {  // HTML Pages.
        // Get any embedded JSON-LD.
        const jsonLd = await page.evaluate(getJsonLd);
        for (const json of jsonLd) {
          try {
            const obj = JSON.parse(json);
            const text = obj.arTarget.text;

            if (verbose) {
              console.log(`[Target]: ${text}`);
            }

            // If there is no arContent, generate it.
            if (!('arContent' in obj)) {
              obj.arContent = await page.evaluate(generateJsonLdFromPage);
            }

            if (!jsonLdFound.has(text)) {
              jsonLdFound.set(text, obj);
            }

          } catch (e) {
            console.warn(`Malformed JSON-LD in ${url}`);
          }
        }

        // Ask the page for new URLs.
        foundUrls = await page.evaluate(getPageUrls);

      } else if (isSitemapXML(response)) {
        // Ask the sitemap for new URLs.
        foundUrls = await page.evaluate(getSitemapUrls);
      } else {
        throw new Error(`URL is not HTML or a sitemap.xml: ${url}`);
      }
    } catch (e) {
      // Failed to get URL - keep rolling.
    } finally {
      await page.close();
    }

    // Append any additional links found.
    if (followLinks) {
      let addedCount = 0;
      for (const foundUrl of foundUrls) {
        if (haveVisited.has(foundUrl)) {
          continue;
        }

        toVisit.add(foundUrl);
        addedCount++;
      }

      if (verbose && addedCount > 0) {
        console.log(`[Added URLs]: ${addedCount}`);
      }
    }

    if (toVisit.size === 0) {
      return;
    }

    return await visitUrl(Array.from(toVisit)[0]);
  }

  await visitUrl(start);
  await closeBrowser();

  return jsonLdFound;
}

(async function () {
  const jsonLds = await visitUrls();
  const { dest, verbose } = argv;
  const targets = Array.from(jsonLds.values());
  if (targets.length === 0) {
    if (verbose) {
      console.warn('Did not find any targets');
    }
    process.exit(0);
  }

  const contents = JSON.stringify(targets, null, 2);
  fs.writeFile(dest, contents, 'utf8', (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    process.exit(0);
  });
})();
