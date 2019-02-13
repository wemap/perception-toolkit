/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export enum DEBUG_LEVEL {
  NONE = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  VERBOSE = 4
}

export function enableLogLevel(level: DEBUG_LEVEL) {
  (self as any).DEBUG = level;
}

declare const DEBUG: DEBUG_LEVEL;

export function log(msg: any, level: DEBUG_LEVEL = DEBUG_LEVEL.INFO,
                    tag?: string) {
  if (typeof DEBUG === 'undefined' || level > DEBUG) {
    return;
  }

  const label = applyTagIfProvided(level, tag);
  switch (level) {
    case DEBUG_LEVEL.ERROR:
      console.error(label, msg);
      break;

    case DEBUG_LEVEL.WARNING:
      console.warn(label, msg);
      break;

    default:
      console.log(label, msg);
      break;
  }
}

function applyTagIfProvided(label: DEBUG_LEVEL, tag?: string) {
  let labelStr = '';
  switch (label) {
    case DEBUG_LEVEL.WARNING:
      labelStr = 'WARNING';
      break;

    case DEBUG_LEVEL.ERROR:
      labelStr = 'ERROR';
      break;

    default:
      labelStr = 'INFO';
      break;
  }

  if (!tag) {
    return `${labelStr}:`;
  }

  return `${labelStr} [${tag}]:`;
}
