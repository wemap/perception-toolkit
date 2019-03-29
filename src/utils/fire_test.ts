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

const { assert } = chai;

import { fire } from './fire.js';

describe('Fire', () => {
  it('fires', (done) => {
    const evtName = 'customfireevent';
    window.addEventListener(evtName, () => done());
    fire(evtName, window);
  });

  it('bubbles', (done) => {
    const evtName = 'customfireevent';
    window.addEventListener(evtName, () => done());
    fire(evtName, document.body);
  });

  it('has data', (done) => {
    const evtName = 'customfireevent';
    window.addEventListener(evtName, (evt) => {
      const fooEvt = evt as CustomEvent<{foo: string}>;
      const { foo } = fooEvt.detail;
      assert.equal(foo, 'bar');
      done();
    });

    fire(evtName, document.body, { foo: 'bar' });
  });
});
