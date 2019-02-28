import { ArtifactDecoder } from './artifact-decoder.js';

// TODO: Generate events, rather than return lists, to support endless streams
// TODO: Consider merging from*Url functions and just branching on response content-type
export class ArtifactLoader {
  private _decoder = new ArtifactDecoder();

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

  async fromJson(json: object) {
    return this._decoder.decode(json);
  }
};
