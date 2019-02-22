/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { clamp } from './clamp.js';

/* istanbul ignore next */
export class Speech {
  message: string = '';
  autoplay = false;
  private utterance = new SpeechSynthesisUtterance();

  get voices() {
    return speechSynthesis.getVoices();
  }

  configure({
      voiceIndex = 0,
      volume = 1,
      rate = 1,
      pitch = 2,
      lang = 'en-US'
    } = {}) {

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

  say(message?: string) {
    if (message) {
      this.message = message;
    }

    this.utterance.text = this.message;
    speechSynthesis.cancel();
    speechSynthesis.speak(this.utterance);
  }
}
