/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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
