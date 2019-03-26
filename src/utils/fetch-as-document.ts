/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export async function fetchAsDocument(url: URL | string): Promise<Document|null> {
  // Note: according to MDN, can use XHR request to create Document direct from URL
  // This may be better, because could have document.location.href (etc) settings automatically?
  // Note: this already proved issue when getting .src property of script/link tags, since relative
  // Urls are based off this document root, not the fetched source.

  const response = await fetch(url.toString());
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return doc;
}