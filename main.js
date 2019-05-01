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

const puppeteer = require('puppeteer');

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

function isSitemapXml(response) {
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

async function visitUrls({ start, followLinks, remap, verbose } = opts) {
  const jsonLdFound = new Map();
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
            const text = obj.arTarget.text || obj.arTarget.name;

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

      } else if (isSitemapXml(response)) {
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
      for (let foundUrl of foundUrls) {
        if (remap) {
          const foundOrigin = new URL(foundUrl).origin;
          foundUrl = foundUrl.replace(foundOrigin, remap);
        }

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

module.exports = {
  visitUrls
};
