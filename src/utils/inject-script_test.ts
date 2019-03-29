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

import { replace } from 'sinon';

const { assert } = chai;

import { injectScript } from './inject-script.js';

describe('Inject Script', () => {
  it('injects a script', async () => {
    const src = URL.createObjectURL(new Blob([]));
    await injectScript(src);
    URL.revokeObjectURL(src);

    assert.exists(document.head.querySelector(`script[src="${src}"]`));
  });
});
