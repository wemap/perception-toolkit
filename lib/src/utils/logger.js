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
export var DEBUG_LEVEL;
(function (DEBUG_LEVEL) {
    /**
     * All messages.
     */
    DEBUG_LEVEL[DEBUG_LEVEL["VERBOSE"] = 4] = "VERBOSE";
    /**
     * Info.
     */
    DEBUG_LEVEL[DEBUG_LEVEL["INFO"] = 3] = "INFO";
    /**
     * Warnings.
     */
    DEBUG_LEVEL[DEBUG_LEVEL["WARNING"] = 2] = "WARNING";
    /**
     * Errors.
     */
    DEBUG_LEVEL[DEBUG_LEVEL["ERROR"] = 1] = "ERROR";
    /**
     * No messages.
     */
    DEBUG_LEVEL[DEBUG_LEVEL["NONE"] = 0] = "NONE";
})(DEBUG_LEVEL || (DEBUG_LEVEL = {}));
/**
 * Enables logging at the given level. Note: by default debugging is disabled.
 */
export function enableLogLevel(level) {
    self.DEBUG = level;
}
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
export function log(msg, level = DEBUG_LEVEL.INFO, tag) {
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
function applyTagIfProvided(label, tag) {
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
//# sourceMappingURL=logger.js.map