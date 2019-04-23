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

import { CreativeWork, ImageObject, MediaObject, Thing } from './core-schema-org.js';

export type ARTargetTypes = string | URL | Thing;
export type ARContentTypes = string | URL | CreativeWork;

export interface ARArtifact extends CreativeWork {
  arTarget?: ARTargetTypes | ARTargetTypes[];
  arContent?: ARContentTypes | ARContentTypes[];
}

export interface ARImageTarget extends CreativeWork {
  // Use name, description, image from Thing
  // Use encoding, associatedMedia from CreativeWork
}