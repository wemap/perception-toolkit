(function () {
  'use strict';

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
   * A convenience function for injecting scripts into the document head. The
   * `Promise` will either `resolve` (successful load) or `reject` (script error).
   *
   * ```javascript
   * await injectScript('/path/to/some/javascript.js');
   * ```
   */
  function injectScript(src) {
      return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
      });
  }

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
  var DEBUG_LEVEL;
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
  function enableLogLevel(level) {
      self.DEBUG = level;
  }
  /**
   * Logs a message.
   *
   * ```javascript
   *
   * // Enable INFO and WARNING messages.
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
  function log(msg, level = DEBUG_LEVEL.INFO, tag) {
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

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  let detector;
  /**
   * Detects barcodes from image sources.
   */
  async function detect(data, { context = window, forceNewDetector = false, polyfillPrefix = '' } = {}) {
      if (context === window && !('BarcodeDetector' in context)) {
          log('Native barcode detector unavailable', DEBUG_LEVEL.WARNING, 'BarcodeDetector');
          await injectScript(`${polyfillPrefix}/lib/polyfills/barcode-detector.js`);
      }
      /* istanbul ignore else */
      if (!detector || forceNewDetector) {
          detector = new context.BarcodeDetector();
      }
      if ('isReady' in detector) {
          await detector.isReady;
      }
      try {
          return await detector.detect(data);
      }
      catch (e) {
          log(`Detection failed: ${e.message}`, DEBUG_LEVEL.WARNING);
          return [];
      }
  }

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
   * Clamps a number between `min` and `max` values. Both `min` and `max` are
   * optional.
   *
   * ```javascript
   * clamp(100, 0, 40);  // 40.
   * ```
   */
  function clamp(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
      return Math.max(min, Math.min(max, value));
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  function easeOut(value) {
      return 1 - Math.pow(1 - value, 3);
  }
  const animations = new WeakMap();
  /**
   * Fades an element using `requestAnimationFrame`. Takes a parameter detailing
   * the animation, which is an object containing `to` (`0 <= to <= 1`), `from`
   * (`0 <= to <= 1`), duration (milliseconds), and `ease` (a function that takes
   * a value between `0` and `1` and returns a new value, also between `0` and
   * `1`) properties.
   *
   * ```javascript
   * fade(someElement, { from: 1, to: 1, duration: 200, ease: (v) => v })
   * ```
   *
   * @param target The element to fade.
   */
  function fade(target, { from = 1, to = 0, duration = 250, ease = easeOut } = {}) {
      return new Promise((resolve) => {
          const existingAnimation = animations.get(target);
          if (existingAnimation) {
              cancelAnimationFrame(existingAnimation.id);
              animations.delete(target);
              existingAnimation.resolve();
          }
          target.style.opacity = from.toString();
          const start = self.performance.now();
          const update = () => {
              const now = self.performance.now();
              const time = clamp((now - start) / duration, 0, 1);
              const value = from + ((to - from) * ease(time));
              target.style.opacity = value.toString();
              if (time < 1) {
                  animations.set(target, { id: requestAnimationFrame(update), resolve });
              }
              else {
                  target.style.opacity = to.toString();
                  animations.delete(target);
                  resolve();
              }
          };
          animations.set(target, { id: requestAnimationFrame(update), resolve });
      });
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  // tslint:disable:max-line-length
  const styles = `
:host {
  --baseline: 8px;
  --background: #FFF;
  --borderRadius: 4px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: calc(var(--baseline) * 4)
      calc(var(--baseline) * 4)
      calc(var(--baseline) * 2)
      calc(var(--baseline) * 3);

  position: relative;
  display: inline-block;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--borderRadius);
  font-family: var(--fontFamily);
  background: var(--background);
  color: var(--color);
}

#container {
  padding: var(--padding);
  white-space: nowrap;
}

#close {
  width: calc(var(--baseline) * 3);
  height: calc(var(--baseline) * 3);
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=);
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
}

#close:hover {
  opacity: 1;
}

slot::slotted(*) {
  flex: 1;
  border-right: 1px solid #CCC;
}

slot::slotted(*:last-child) {
  border-right: none;
}

slot {
  display: flex;
  border-top: 1px solid #AAA;
}

:host(:empty) slot {
  border: none;
}
`;
  // tslint:enable:max-line-length
  const html = `
  <button id="close">Close</button>
  <div id="container"></div>
  <div id="slotted-content"><slot></slot></div>
`;

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
   * A data card for information output.
   *
   * ```javascript
   * // Text card.
   * const card = new Card();
   * card.src = 'Card Message';
   *
   * // Or iframe some content in. By default the card supports same-origin
   * // content.
   * card.src = new URL('http://example.com');
   * ```
   */
  class Card extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          /**
           * The duration of the card's fade animation when dismissed.
           */
          this.fadeDuration = 200;
          /**
           * The sandbox attributes to use for card sources that are iframed in. By
           * default the iframed content is assumed to be same origin but not allowed to
           * execute scripts.
           *
           * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
           */
          this.sandboxAttribute = 'allow-same-origin';
          this.srcInternal = '';
          this.root = this.attachShadow({ mode: 'open' });
          this.onClickBound = this.onClick.bind(this);
      }
      /**
       * Gets & sets the src for the card. If the src is a URL the content is
       * `iframe`'d in using a sandbox that disallows
       */
      get src() {
          return this.srcInternal;
      }
      set src(src) {
          this.srcInternal = src;
          this.render();
      }
      /**
       * Gets & sets the width of the card.
       */
      get width() {
          return this.widthInternal;
      }
      set width(width) {
          this.widthInternal = width;
          this.setDimensions();
      }
      /**
       * Gets & sets the height of the card.
       */
      get height() {
          return this.heightInternal;
      }
      set height(height) {
          this.heightInternal = height;
          this.setDimensions();
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      connectedCallback() {
          this.root.innerHTML = `<style>${styles}</style> ${html}`;
          this.render();
          this.setDimensions();
          this.addEventListener('click', this.onClickBound);
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      disconnectedCallback() {
          this.removeEventListener('click', this.onClickBound);
      }
      /**
       * Closes the card with an optional fade.
       */
      async close(fadeDuration = this.fadeDuration) {
          if (fadeDuration === 0) {
              this.remove();
              return;
          }
          await fade(this, { duration: fadeDuration });
          this.remove();
      }
      async onClick(evt) {
          const clicked = evt.path ? evt.path[0] : evt.composedPath()[0];
          if (clicked.id !== 'close') {
              return;
          }
          await this.close();
      }
      render() {
          const container = this.root.querySelector('#container');
          if (!container) {
              return;
          }
          if (this.srcIsString(this.src)) {
              container.textContent = this.src;
          }
          else if (typeof this.src === 'undefined') {
              container.textContent = 'Unexpected content';
          }
          else {
              const iframe = document.createElement('iframe');
              iframe.src = this.src.toString();
              iframe.setAttribute('sandbox', this.sandboxAttribute);
              iframe.style.border = 'none';
              iframe.id = 'external-content';
              iframe.width = (this.width || 0).toString();
              iframe.height = (this.height || 0).toString();
              container.appendChild(iframe);
          }
      }
      srcIsString(msg) {
          return typeof msg === 'string';
      }
      setDimensions() {
          const container = this.root.querySelector('#container');
          if (!container) {
              return;
          }
          if (this.widthInternal) {
              container.style.width = `${this.widthInternal}px`;
          }
          if (this.heightInternal) {
              container.style.height = `${this.heightInternal}px`;
          }
      }
  }
  /**
   * The Cards's default tag name for registering with `customElements.define`.
   */
  Card.defaultTagName = 'data-card';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  const styles$1 = `
:host {
  --color: #999;
  --dotSize: 8px;
  --dotMargin: 4px;
  display: flex;
}

.dot {
  border-radius: 50%;
  width: var(--dotSize);
  height: var(--dotSize);
  background: var(--color);
  margin: var(--dotMargin);
  animation: bounceHorizontal 1s infinite cubic-bezier(0, 0, 0.4, 1);
}

:host([vertical]) .dot {
  animation-name: bounceVertical;
}

.dot:nth-of-type(2) {
  animation-delay: 0.1s;
}

.dot:nth-of-type(3) {
  animation-delay: 0.2s;
}

.dot:nth-of-type(4) {
  animation-delay: 0.3s;
}

@keyframes bounceHorizontal {
  0% {
    transform: none;
  }

  50% {
    transform: translateX(-10px);
  }

  100% {
    transform: none;
  }
}

@keyframes bounceVertical {
  0% {
    transform: none;
    animation-timing-function: ease-in;
  }

  10% {
    transform: translateY(-4px);
    animation-timing-function: ease-in-out;
  }

  30% {
    transform: translateY(4px);
    animation-timing-function: ease-out;
  }

  40% {
    transform: none;
  }

  100% {
    transform: none;
  }
}
`;
  const html$1 = `
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>`;

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
   * A loader that uses animating dots.
   *
   * ```javascript
   * const loader = new DotLoader();
   * loader.style.setProperty('--color', '#FFF');
   *
   * // Vertical animation.
   * loader.setAttribute('vertical', 'vertical');
   * document.body.appendChild(loader);
   *
   * ```
   *
   * ## Configurable properties.
   *
   * ```css
   * dot-loader {
   *   --color: '#<CSS color>';
   *   --dotSize: '<CSS size>px';
   *   --dotMargin: '<CSS size>px';
   * }
   * ```
   */
  class DotLoader extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          this.root = this.attachShadow({ mode: 'open' });
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      connectedCallback() {
          this.root.innerHTML = `<style>${styles$1}</style> ${html$1}`;
      }
  }
  /**
   * The Loader's default tag name for registering with `customElements.define`.
   */
  DotLoader.defaultTagName = 'dot-loader';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  const styles$2 = `
:host {
  --baseline: 8px;
  --background: #FFF;
  --borderRadius: 4px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: calc(var(--baseline) * 4)
      calc(var(--baseline) * 4)
      calc(var(--baseline) * 2)
      calc(var(--baseline) * 3);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 80vw;
  text-align: center;
}

#container {
  padding: var(--padding);
  border-radius: var(--borderRadius);
  font-family: var(--fontFamily);
  background: var(--background);
  color: var(--color);
}
`;
  const html$2 = `<div id="container"></div>`;

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
   * A card to use when the browser does not support the various APIs your
   * experience requires.
   *
   * ```javascript
   * const noSupport = new NoSupportCard();
   * document.body.appendChild(noSupport);
   * ```
   */
  class NoSupportCard extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          /**
           * The message to share with users.
           */
          this.message = NoSupportCard.DEFAULT_MESSAGE;
          this.root = this.attachShadow({ mode: 'open' });
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      connectedCallback() {
          this.root.innerHTML = `<style>${styles$2}</style> ${html$2}`;
          const container = this.root.querySelector('#container');
          container.textContent = this.message;
      }
  }
  /**
   * The Card's default tag name for registering with `customElements.define`.
   */
  NoSupportCard.defaultTagName = 'no-support-card';
  /**
   * @ignore Only exposed for testing.
   */
  NoSupportCard.DEFAULT_MESSAGE = 'Sorry, this browser does not support the required features';

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
   * A convenience function for firing custom events.
   *
   * ```javascript
   * fire('eventname', someElement, {foo: 'bar'});
   * ```
   */
  function fire(name, target, detail) {
      const evt = new CustomEvent(name, { bubbles: true, detail });
      target.dispatchEvent(evt);
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  const styles$3 = `
:host {
  position: relative;
  display: flex;
}

canvas {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  left: 0;
}

#container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
`;
  const html$3 = `<div id="container"></div>`;

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
   * Provides an element that abstracts the capture of stream frames. For example,
   * given a `getUserMedia` video stream, this will -- if desired -- capture an
   * image from the stream, downsample it, and emit an event with the pixel data.
   *
   * **Note that, due to the internal reliance on `requestAnimationFrame`, the
   * capture element must be attached to the DOM, and the tab visible.**
   *
   * ```javascript
   * const capture = new StreamCapture();
   *
   * // Capture every 600ms at 50% scale.
   * capture.captureRate = 600;
   * capture.captureScale = 0.5;
   *
   * // Attempt to get the camera's stream and start monitoring.
   * const stream = await navigator.mediaDevices.getUserMedia({ video: true});
   * capture.start(stream);
   *
   * // Append and listen to captures.
   * document.body.appendChild(capture);
   * capture.addEventListener(StreamCapture.frameEvent, (e) => {
   *   const { imgData } = e.detail;
   *
   *   // Process the ImageData.
   * });
   * ```
   */
  class StreamCapture extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          /**
           * The sample scale, intended to go between `0` and `1` (though clamped only
           * to `0` in case you wish to sample at a larger scale).
           */
          this.captureScale = 0.5;
          /**
           * How often to capture the stream in ms, where `0` represents never.
           * Note that you can cause performance issues if `captureRate` is higher than
           * the speed at which the captured pixels can be processed.
           */
          this.captureRate = 0;
          /**
           * Whether to capture a PNG `HTMLImageElement` instead of `ImageData`
           * (the default).
           */
          this.capturePng = false;
          /**
           * Whether to flip the stream's image.
           */
          this.flipped = false;
          this.root = this.attachShadow({ mode: 'open' });
          this.lastCapture = -1;
          this.root.innerHTML = `<style>${styles$3}</style> ${html$3}`;
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      disconnectedCallback() {
          this.stop();
      }
      /**
       * Starts the capture of the stream.
       */
      start(stream) {
          if (this.stream) {
              throw new Error('Stream already provided. Stop the capture first.');
          }
          this.stream = stream;
          this.initElementsIfNecessary();
          const scale = clamp(this.captureScale, 0);
          const video = this.video;
          const update = (now) => {
              if (!this.video || !this.ctx) {
                  return;
              }
              this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth * scale, this.video.videoHeight * scale);
              if (this.captureRate !== 0 && now - this.lastCapture > this.captureRate) {
                  this.lastCapture = now;
                  this.captureFrame();
              }
              requestAnimationFrame((now) => update(now));
          };
          video.muted = true;
          video.srcObject = this.stream;
          video.play();
          video.addEventListener('playing', async () => {
              if (!this.video || !this.canvas || !this.ctx) {
                  return;
              }
              // There appears to be some form of condition where video playback can
              // commence without the video dimensions being populated in Chrome. As
              // such we attempt to wait some frames first.
              let frameCount = 5;
              let redoCheck = true;
              while (redoCheck) {
                  frameCount--;
                  await new Promise((resolve) => requestAnimationFrame(resolve));
                  redoCheck = frameCount > 0 &&
                      (this.video.videoWidth === 0 || this.video.videoHeight === 0);
              }
              // Should we arrive here without video dimensions we throw.
              /* istanbul ignore if */
              if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
                  throw new Error('Video has width or height of 0');
              }
              this.canvas.width = this.video.videoWidth * this.captureScale;
              this.canvas.height = this.video.videoHeight * this.captureScale;
              // Flip the canvas if -- say -- the camera is pointing at the user.
              if (this.flipped) {
                  this.ctx.translate(this.canvas.width * 0.5, 0);
                  this.ctx.scale(-1, 1);
                  this.ctx.translate(-this.canvas.width * 0.5, 0);
              }
              requestAnimationFrame((now) => {
                  update(now);
                  fire(StreamCapture.startEvent, this);
              });
          }, { once: true });
      }
      /**
       * Manually captures a frame. Intended to be used when `captureRate` is `0`.
       */
      async captureFrame() {
          /* istanbul ignore if */
          if (!this.ctx || !this.canvas) {
              throw new Error('Unable to capture frame');
          }
          return new Promise((resolve) => {
              const canvas = this.canvas;
              const ctx = this.ctx;
              let imgData;
              if (this.capturePng) {
                  imgData = new Image();
                  imgData.src = canvas.toDataURL('image/png');
                  imgData.onload = () => {
                      if (this.captureRate !== 0) {
                          fire(StreamCapture.frameEvent, this, { imgData });
                      }
                      resolve(imgData);
                  };
              }
              else {
                  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  if (this.captureRate !== 0) {
                      fire(StreamCapture.frameEvent, this, { imgData });
                  }
                  resolve(imgData);
              }
          });
      }
      /**
       * Stops the stream.
       */
      stop() {
          if (!this.stream || !this.ctx || !this.canvas) {
              return;
          }
          const tracks = this.stream.getTracks();
          for (const track of tracks) {
              track.stop();
          }
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.canvas.remove();
          this.video = undefined;
          this.stream = undefined;
          this.canvas = undefined;
          this.ctx = undefined;
          fire(StreamCapture.stopEvent, this);
      }
      initElementsIfNecessary() {
          /* istanbul ignore else */
          if (!this.canvas) {
              this.canvas = document.createElement('canvas');
              this.ctx = this.canvas.getContext('2d');
              /* istanbul ignore if */
              if (!this.ctx) {
                  throw new Error('Unable to create canvas context');
              }
              const container = this.root.querySelector('#container');
              /* istanbul ignore if */
              if (!container) {
                  throw new Error('Template error: unable to find container');
              }
              container.appendChild(this.canvas);
          }
          /* istanbul ignore else */
          if (!this.video) {
              this.video = document.createElement('video');
          }
      }
  }
  /**
   * The StreamCapture's default tag name for registering with
   * `customElements.define`.
   */
  StreamCapture.defaultTagName = 'stream-capture';
  /**
   * The name for captured frame events.
   */
  StreamCapture.frameEvent = 'captureframe';
  /**
   * The name for start capture events.
   */
  StreamCapture.startEvent = 'capturestarted';
  /**
   * The name for stop capture events.
   */
  StreamCapture.stopEvent = 'capturestopped';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  class DeviceSupport {
      constructor() {
          this.useEvents = false;
          this.detectors = new Map();
      }
      addDetector(detector) {
          const { name, supported } = detector;
          if (this.detectors.has(name)) {
              throw new Error(`${name} already added`);
          }
          this.detectors.set(name, supported);
      }
      removeDetector(name) {
          this.detectors.delete(name);
      }
      async detect() {
          const support = {};
          for (const [name, detector] of this.detectors) {
              support[name] = await detector();
          }
          if (this.useEvents) {
              fire(DeviceSupport.supportsEvent, self, support);
          }
          return support;
      }
  }
  DeviceSupport.supportsEvent = 'supports';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  var GetUserMediaSupport = {
      name: 'getUserMedia',
      supported: async () => {
          return 'mediaDevices' in self.navigator &&
              'getUserMedia' in self.navigator.mediaDevices;
      }
  };

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
   * Detects whether the user's device supports an environment-facing camera.
   *
   * **Note: calling this function will provide the user with a camera access
   * permission prompt, assuming one has not already been issued (such as for
   * `getUserMedia`). As such this API is best deferred until camera access has
   * been granted by the user.**
   *
   * ```javascript
   * const devices = await navigator.mediaDevices.enumerateDevices();
   * const supportsEnvironmentCamera =
   *    await EnvironmentCamera.supportsEnvironmentCamera(devices);
   * ```
   */
  async function supportsEnvironmentCamera(devices) {
      const cameras = devices.filter(t => t.kind === 'videoinput');
      return cameras.some((camera) => {
          if (!('getCapabilities' in camera)) {
              return false;
          }
          const capabilities = camera.getCapabilities();
          if (!capabilities.facingMode) {
              return false;
          }
          return capabilities.facingMode.find((f) => 'environment');
      });
  }

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  enableLogLevel(DEBUG_LEVEL.WARNING);
  const detectedBarcodes = new Set();
  let loader;
  /**
   * Processes the outcome of the device support testing.
   *
   * @param evt The supports event from the DeviceSupport class.
   */
  async function onSupports(evt) {
      const supportEvt = evt;
      if (!supportEvt.detail[GetUserMediaSupport.name]) {
          const noSupport = new NoSupportCard();
          document.body.appendChild(noSupport);
          return;
      }
      loader = new DotLoader();
      loader.style.setProperty('--color', '#FFF');
      document.body.appendChild(loader);
      createStreamCapture();
  }
  async function createStreamCapture() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const supportsEnvironmentCamera$$1 = await supportsEnvironmentCamera(devices);
      const capture = new StreamCapture();
      capture.captureRate = 600;
      capture.style.width = '100%';
      capture.captureScale = 0.6;
      capture.addEventListener('click', async () => {
          try {
              await capture.requestFullscreen();
          }
          catch (e) {
              // Unable to go full screen.
              console.warn(e);
          }
      });
      const streamOpts = {
          video: {
              facingMode: 'environment'
          }
      };
      // Attempt to get access to the user's camera.
      const stream = await navigator.mediaDevices.getUserMedia(streamOpts);
      capture.flipped = !supportsEnvironmentCamera$$1;
      capture.start(stream);
      document.body.appendChild(capture);
  }
  /**
   * Processes the image data captured by the StreamCapture class, and hands off
   * the image data to the barcode detector for processing.
   *
   * @param evt The Custom Event containing the captured frame data.
   */
  async function onCaptureFrame(evt) {
      if (loader) {
          loader.remove();
          loader = null;
      }
      const { detail } = evt;
      const { imgData } = detail;
      const barcodes = await detect(imgData);
      for (const barcode of barcodes) {
          if (detectedBarcodes.has(barcode.rawValue)) {
              continue;
          }
          // Prevent multiple markers for the same barcode.
          detectedBarcodes.add(barcode.rawValue);
          // Create a card for every found barcode.
          const card = new Card();
          card.src = barcode.rawValue;
          const container = createContainerIfRequired();
          container.appendChild(card);
      }
  }
  function createContainerIfRequired() {
      let detectedBarcodesContainer = document.querySelector('#container');
      if (!detectedBarcodesContainer) {
          detectedBarcodesContainer = document.createElement('div');
          detectedBarcodesContainer.id = 'container';
          document.body.appendChild(detectedBarcodesContainer);
      }
      return detectedBarcodesContainer;
  }
  // Register custom elements.
  customElements.define(StreamCapture.defaultTagName, StreamCapture);
  customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
  customElements.define(Card.defaultTagName, Card);
  customElements.define(DotLoader.defaultTagName, DotLoader);
  // Register events.
  window.addEventListener(DeviceSupport.supportsEvent, onSupports);
  window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);
  // Start the detection process.
  const deviceSupport = new DeviceSupport();
  deviceSupport.useEvents = true;
  deviceSupport.addDetector(GetUserMediaSupport);
  deviceSupport.detect();

}());
