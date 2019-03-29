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
import { clamp } from './clamp.js';
/* istanbul ignore next */
export class Speech {
    constructor() {
        this.message = '';
        this.autoplay = false;
        this.utterance = new SpeechSynthesisUtterance();
    }
    get voices() {
        return speechSynthesis.getVoices();
    }
    configure({ voiceIndex = 0, volume = 1, rate = 1, pitch = 2, lang = 'en-US' } = {}) {
        voiceIndex = clamp(voiceIndex, 0, this.voices.length);
        volume = clamp(volume, 0, 1);
        rate = clamp(volume, 0.1, 10);
        pitch = clamp(volume, 0, 2);
        this.utterance.voice = this.voices[voiceIndex];
        this.utterance.volume = volume;
        this.utterance.rate = rate;
        this.utterance.pitch = pitch;
        this.utterance.lang = lang;
    }
    say(message) {
        if (message) {
            this.message = message;
        }
        this.utterance.text = this.message;
        speechSynthesis.cancel();
        speechSynthesis.speak(this.utterance);
    }
}
//# sourceMappingURL=speech.js.map