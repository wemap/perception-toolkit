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
