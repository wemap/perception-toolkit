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

import { spy } from 'sinon';
import { DEBUG_LEVEL, enableLogLevel, log } from './logger.js';

describe('log', () => {
  let consoleLogSpy: sinon.SinonSpy;
  let consoleWarnSpy: sinon.SinonSpy;
  let consoleErrorSpy: sinon.SinonSpy;
  beforeEach(() => {
    consoleLogSpy = spy(console, 'log');
    consoleWarnSpy = spy(console, 'warn');
    consoleErrorSpy = spy(console, 'error');
  });

  afterEach(() => {
    consoleLogSpy.restore();
    consoleWarnSpy.restore();
    consoleErrorSpy.restore();
    enableLogLevel(DEBUG_LEVEL.NONE);
  });

  it('ignores logs by default', async () => {
    log('foo', DEBUG_LEVEL.ERROR);
    assert.isFalse(consoleLogSpy.called);
    assert.isFalse(consoleWarnSpy.called);
    assert.isFalse(consoleErrorSpy.called);
  });

  it('observes the correct logging level', async () => {
    enableLogLevel(DEBUG_LEVEL.WARNING);
    log('foo', DEBUG_LEVEL.ERROR);
    log('foo', DEBUG_LEVEL.WARNING);
    log('foo', DEBUG_LEVEL.INFO);
    assert.isFalse(consoleLogSpy.called);
    assert.isTrue(consoleWarnSpy.called);
    assert.isTrue(consoleErrorSpy.called);
  });

  it('is verbose', async () => {
    enableLogLevel(DEBUG_LEVEL.VERBOSE);
    log('foo', DEBUG_LEVEL.INFO);
    log('foo', DEBUG_LEVEL.WARNING);
    log('foo', DEBUG_LEVEL.ERROR);
    assert.isTrue(consoleLogSpy.called);
    assert.isTrue(consoleWarnSpy.called);
    assert.isTrue(consoleErrorSpy.called);
  });

  it('does not tag the message', async () => {
    enableLogLevel(DEBUG_LEVEL.INFO);
    log('foo', DEBUG_LEVEL.INFO);
    assert.isTrue(consoleLogSpy.withArgs('INFO:', 'foo').calledOnce);
  });

  it('tags the message', async () => {
    enableLogLevel(DEBUG_LEVEL.INFO);
    log('foo', DEBUG_LEVEL.INFO, 'bar');
    assert.isTrue(consoleLogSpy.withArgs('INFO [bar]:', 'foo').calledOnce);
  });
});
