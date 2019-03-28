/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { JsonLd } from './schema/json-ld.js';

type QuerySelector = string;
type ElementProcessorFn = (element: Element) => string|null;
type ExtractionRule = [ QuerySelector, ElementProcessorFn ];
type ExtractionRules = ExtractionRule[];

function processRulesUntilFirstMatch(doc: Document, rules: ExtractionRules): string|undefined {
  for (const [selector, elementProcessorFn] of rules) {
    const element = doc.querySelector(selector);
    if (!element) {
      continue;
    }
    const val = elementProcessorFn(element);
    if (val !== undefined && val !== null) {
      return val;
    }
  }
}

function extractTitle(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['head[itemscope][itemtype="http://schema.org/WebPage"] *[itemprop="name"]', (el) => el.getAttribute('content')],
    ['title', (el) => el.textContent],
    ['meta[property="og:title"]', (el) => el.getAttribute('content')],
  ]);
}

function extractDescription(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['head[itemscope][itemtype="http://schema.org/WebPage"] *[itemprop="description"]',
        (el) => el.getAttribute('content')],
    ['meta[name="description"]', (el) => el.getAttribute('content')],
    ['meta[property="og:description"]', (el) => el.getAttribute('content')],
  ]);
}

function extractImage(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['head[itemscope][itemtype="http://schema.org/WebPage"] *[itemprop="image"]',
        (el) => el.getAttribute('content') || el.getAttribute('href')],
    ['meta[property="og:image:secure_url"]', (el) => el.getAttribute('content')],
    ['meta[property="og:image:url"]', (el) => el.getAttribute('content')],
    ['meta[property="og:image"]', (el) => el.getAttribute('content')],
  ]);
}

function addPropertyIfDefined(obj: JsonLd, prop: string, value: any|undefined) {
  if (value !== undefined) {
    obj[prop] = value;
  }
}

// TODO: turn relative URLs into absolute URLs?
export async function extractPageMetadata(doc: Document, url: URL|string = doc.URL): Promise<JsonLd> {
  const ret: JsonLd = {
    '@type': 'WebPage',
    'url': url.toString(),
  };
  addPropertyIfDefined(ret, 'name', extractTitle(doc));
  addPropertyIfDefined(ret, 'description', extractDescription(doc));
  addPropertyIfDefined(ret, 'image', extractImage(doc));

  return ret;
}
