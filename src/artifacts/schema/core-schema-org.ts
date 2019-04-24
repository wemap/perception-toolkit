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

import { JsonLd, typeIsJsonLd } from './json-ld.js';

export function typeIsThing(type: any): type is Thing {
  const thing = type as Thing;
  // TODO: should validate @type is within Thing hierarchy.  Almost everything is a Thing.
  return typeIsJsonLd(thing);
}

export interface Thing extends JsonLd {
  name?: string;
  url?: string;
  image?: string | URL | ImageObject;
  description?: string;
  disambiguatingDescription?: string;
  alternateName?: string;
}

export interface CreativeWork extends Thing {
  about?: Thing;
  text?: string;
  encoding?: MediaObject | MediaObject[];
  associatedMedia?: MediaObject | MediaObject[]; // Synonym for encoding
  encodingFormat?: string | URL;
}

export interface WebPage extends CreativeWork {
  primaryImageOfPage?: ImageObject;
  significantLink?: string | URL;
}

export interface MediaObject extends CreativeWork {
  contentUrl?: string | URL;
  contentSize?: number;
  encodingFormat?: string | URL;

}
export interface ImageObject extends MediaObject {

}

export interface Barcode extends ImageObject {
  /* use `text` property of CreativeWork */
}

export interface Intangible extends Thing {
}

export interface StructuredValue extends Intangible {
}

export interface GeoCoordinates extends StructuredValue {
  address?: string; // PostalAddress
  addressCountry?: string; // Country
  elevation?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  postalCode?: string;
}
