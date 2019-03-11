/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { ArtifactDecoder } from './artifact-decoder.js';
import { JsonLd } from './schema/JsonLd.js';

// TODO: Consider merging from*Url functions and just branching on response content-type
export class ArtifactLoader {
  private decoder = new ArtifactDecoder();

  constructor() {
  }

  async fromHtmlUrl(url: URL|string) {
    // Note: according to MDN, can use XHR request to create Document direct from URL
    // This may be better, because could have document.location.href (etc) settings automatically?
    // Note: this already proved issue when getting .src property of script/link tags, since relative
    // Urls are based off this document root, not the fetched source.

    let response = await fetch(url.toString());
    let html = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    return this.fromDocument(doc, url);
  }

  async fromJsonUrl(url: URL|string) {
    let response = await fetch(url.toString());
    if (!response.ok) {
        throw Error(response.statusText);
    }
    let json = await response.json();
    return this.fromJson(json);
  }

  async fromDocument(doc: Document, url: URL|string) {
    let ret = [];

    let inline_scripts = doc.querySelectorAll("script[type='application/ld+json']:not([src])");
    for (let jsonld_script of inline_scripts) {
      ret.push(this.fromJson(JSON.parse(jsonld_script.textContent || "")));
    }

    let external_scripts = doc.querySelectorAll("script[type='application/ld+json'][src]");
    for (let jsonld_script of external_scripts) {
      const src = jsonld_script.getAttribute('src');
      if (!src) continue;
      ret.push(this.fromJsonUrl(new URL(src, /* base= */ url)));
    }

    let jsonld_links = doc.querySelectorAll("link[rel='alternate'][type='application/ld+json'][href]");
    for (let jsonld_link of jsonld_links) {
      const href = jsonld_link.getAttribute('href');
      if (!href) continue;
      ret.push(this.fromJsonUrl(new URL(href, /* base= */ url)));
    }

    return (await Promise.all(ret)).flat(1);
  }

  async fromJson(json: JsonLd) {
    return this.decoder.decode(json);
  }
};
