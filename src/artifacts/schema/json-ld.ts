import { Thing } from './core-schema-org';

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

export function typeIsJsonLd(type: any): type is JsonLd {
  if (!type) {
    return false;
  }
  const jsonld = type as JsonLd;
  return jsonld.hasOwnProperty('@type');
}

export interface JsonLd {
  '@type'?: string;
  [propName: string]: any; // string | boolean | number | JsonLd | JsonLd[]
}
