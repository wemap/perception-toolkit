/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { CardData } from '../elements/card/card.js';

type QuerySelector = string;
type ElementProcessorFn = (element: Element) => string|null;
type ExtractionRule = [ QuerySelector, ElementProcessorFn ];
type ExtractionRules = ExtractionRule[];

function processRulesUntilFirstMatch(doc: Document, rules: ExtractionRules): string|undefined {
  for (const [selector, elementProcessorFn] of rules) {
    const element = document.querySelector(selector);
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
    ['title', (el) => el.textContent],
    ['meta[property="og:title"]', (el) => el.getAttribute('content')],
  ]);
}
function extractDescription(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['meta[name="description"]', (el) => el.getAttribute('content')],
    ['meta[itemprop="description"]', (el) => el.getAttribute('content')],
    ['meta[property="og:description"]', (el) => el.getAttribute('content')],
  ]);
}
function extractImage(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['meta[itemprop="image"]', (el) => el.getAttribute('content')],
    ['meta[property="og:image:secure_url"]', (el) => el.getAttribute('content')],
    ['meta[property="og:image:url"]', (el) => el.getAttribute('content')],
    ['meta[property="og:image"]', (el) => el.getAttribute('content')],
  ]);
}

// TODO: turn relative URLs into absolute URLs?
export async function extractCardDataFromDoc(doc: Document, url: URL): Promise<CardData | null> {
  const ret: CardData = {};

  ret.name = extractTitle(doc);
  ret.description = extractDescription(doc);
  ret.image = extractImage(doc);
  ret.url = url.toString();

  return ret;
}

export async function extractCardDataFromPage(url: URL): Promise<CardData | null> {
  const response = await fetch(url.toString());
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return extractCardDataFromDoc(doc, url);
}
