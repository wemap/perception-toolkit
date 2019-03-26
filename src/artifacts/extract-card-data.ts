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
  let ret = undefined;

  for (const [selector, elementProcessorFn] of rules) {
    const element = document.querySelector(selector);
    if (!element) {
      continue;
    }
    ret = elementProcessorFn(element);
    if (ret !== null) {
      return ret;
    }
  }
  return ret;
}

function extractTitle(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['meta[property="og:title"]', (el) => el.getAttribute('content')],
    ['title', (el) => el.textContent],
  ]);
}
function extractDescription(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['meta[property="og:description"]', (el) => el.getAttribute('content')],
    ['meta[name="description"]', (el) => el.getAttribute('content')],
    ['meta[itemprop="description"]', (el) => el.getAttribute('content')],
  ]);
}
function extractImage(doc: Document): string|undefined {
  return processRulesUntilFirstMatch(doc, [
    ['title', (el) => el.textContent]
  ]);
}

export async function extractCardData(url: URL): Promise<CardData | null> {
  const ret: CardData = {};

  const response = await fetch(url.toString());
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  ret.name = extractTitle(doc);
  ret.description = extractDescription(doc);
  ret.image = extractImage(doc);
  ret.url = url.toString();

  return ret;
}