/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/**
 * Represents the debug level for logging.
 */
export declare enum DEBUG_LEVEL {
    /**
     * All messages.
     */
    VERBOSE = 4,
    /**
     * Info.
     */
    INFO = 3,
    /**
     * Warnings.
     */
    WARNING = 2,
    /**
     * Errors.
     */
    ERROR = 1,
    /**
     * No messages.
     */
    NONE = 0
}
/**
 * Enables logging at the given level. Note: by default debugging is disabled.
 */
export declare function enableLogLevel(level: DEBUG_LEVEL): void;
/**
 * Logs a message.
 *
 * ```javascript
 *
 * // Enable ERROR and WARNING messages.
 * enableLogLevel(DEBUG_LEVEL.WARNING);
 *
 * // Ignored.
 * log('Bar!', DEBUG_LEVEL.INFO);
 *
 * // A tagged message.
 * log('Foo!', DEBUG_LEVEL.WARNING, 'some tag');
 *
 * // A non-tagged message.
 * log('Baz!', DEBUG_LEVEL.ERROR)
 * ```
 */
export declare function log(msg: any, level?: DEBUG_LEVEL, tag?: string): void;
