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
import { ARArtifact } from './schema/ar-artifact.js';
import { JsonLd } from './schema/json-ld.js';

// TODO: Consider merging from*Url functions and just branching on response content-type
export class ArtifactLoader {
  private readonly decoder = new ArtifactDecoder();

  // TODO (#35): Change ArtifactsLoader to only "index" URLs where Artifacts could actually exist
  async fromHtmlUrl(url: URL|string): Promise<ARArtifact[]> {
    // Note: according to MDN, can use XHR request to create Document direct from URL
    // This may be better, because could have document.location.href (etc) settings automatically?
    // Note: this already proved issue when getting .src property of script/link tags, since relative
    // Urls are based off this document root, not the fetched source.

    const response = await fetch(url.toString());
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return this.fromElement(doc, url);
  }

  async fromJsonUrl(url: URL|string): Promise<ARArtifact[]> {
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    return this.fromJson(json);
  }

  async fromElement(el: NodeSelector, url: URL|string): Promise<ARArtifact[]> {
    const ret = [];

    const inlineScripts = el.querySelectorAll('script[type=\'application/ld+json\']:not([src])');
    for (const jsonldScript of inlineScripts) {
      ret.push(this.fromJson(JSON.parse(jsonldScript.textContent || '')));
    }

    const externalScripts = el.querySelectorAll('script[type=\'application/ld+json\'][src]');
    for (const jsonldScript of externalScripts) {
      const src = jsonldScript.getAttribute('src');
      if (!src) { continue; }
      ret.push(this.fromJsonUrl(new URL(src, /* base= */ url)));
    }

    const jsonldLinks = el.querySelectorAll('link[rel=\'alternate\'][type=\'application/ld+json\'][href]');
    for (const jsonldLink of jsonldLinks) {
      const href = jsonldLink.getAttribute('href');
      if (!href) { continue; }
      ret.push(this.fromJsonUrl(new URL(href, /* base= */ url)));
    }

    return (await Promise.all(ret)).flat(1);
  }

  async fromJson(json: JsonLd): Promise<ARArtifact[]> {
    return this.decoder.decode(json);
  }
}
