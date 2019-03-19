this.PerceptionToolkit = this.PerceptionToolkit || {};
this.PerceptionToolkit.main = (function (exports) {
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
  async function detectBarcodes(data, { context = window, forceNewDetector = false, polyfillRequired = false, polyfillPrefix = '' } = {}) {
      const loadPolyfill = polyfillRequired ||
          (context === window && !('BarcodeDetector' in context));
      if (loadPolyfill) {
          log('Using barcode detection polyfill', DEBUG_LEVEL.INFO, 'BarcodeDetector');
          await injectScript(`${polyfillPrefix}/lib/polyfills/barcode-detector.js`);
      }
      /* istanbul ignore else */
      if (!detector || forceNewDetector) {
          detector = new context.BarcodeDetector();
      }
      /* istanbul ignore else */
      if ('isReady' in detector) {
          await detector.isReady;
      }
      try {
          return await detector.detect(data);
      }
      catch (e) {
          // If the polyfill has loaded but there are still issues, exit.
          if (polyfillRequired) {
              return [];
          }
          log(`Detection failed: ${e.message}`, DEBUG_LEVEL.WARNING);
          return await detectBarcodes(data, {
              context,
              forceNewDetector,
              polyfillPrefix,
              polyfillRequired: true
          });
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
  const styles = `
:host {
  --baseline: 8px;
  --height: calc(var(--baseline) * 6);
  position: relative;
  display: flex;
  height: var(--height);
}

button {
  width: 100%;
  height: 100%;
  align-items: center;
  border: none;
  background: none;
  font-size: 15px;
  color: #888;
  cursor: pointer;
  white-space: nowrap;
  padding: var(--baseline) calc(var(--baseline) * 2);
}

button:focus,
button:hover {
  color: #222;
}
`;
  const html = `<button></button>`;

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
   * An action button for use with [[Card]] components.
   *
   * ```javascript
   * // Create an action button, give it a label and a click handler.
   * const button = new ActionButton();
   * button.label = 'Dismiss';
   * button.addEventListener('click', () => {
   *   card.close();
   * });
   *
   * // Now create a card, and append the button to it.
   * const card = new Card();
   * card.src = 'Card with Actions';
   * card.appendChild(button);
   * ```
   */
  class ActionButton extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          this.labelInternal = ActionButton.DEFAULT_LABEL;
          this.root = this.attachShadow({ mode: 'open' });
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      connectedCallback() {
          this.root.innerHTML = `<style>${styles}</style> ${html}`;
          this.render();
      }
      /**
       * Gets & sets the label for the instance.
       */
      get label() {
          return this.labelInternal;
      }
      set label(label) {
          this.labelInternal = label;
          this.render();
      }
      render() {
          const button = this.root.querySelector('button');
          if (!button) {
              return;
          }
          button.textContent = this.label;
      }
  }
  /**
   * The ActionButton's default tag name for registering with
   * `customElements.define`.
   */
  ActionButton.defaultTagName = 'action-button';
  /**
   * The ActionButton's default label.
   */
  ActionButton.DEFAULT_LABEL = 'Button';

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
  const styles$1 = `
:host {
  --baseline: 16px;
  --background: #FFF;
  --borderRadius: 5px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: calc(var(--baseline) * 2)
      calc(var(--baseline) * 2)
      calc(var(--baseline) * 1)
      calc(var(--baseline) * 2);

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
  white-space: nowrap;
}

#container.padded {
  padding: var(--padding);
}

#close {
  width: 24px;
  height: 24px;
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

#title {
  padding: var(--baseline);
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}

#description {
  padding: var(--baseline);
  font-size: 16px;
  font-weight: 400;
  min-height: calc(var(--baseline) * 2);
  margin: 0;
}

#image {
  background-color: #111;
  background-size: cover;
  background-position: center center;
  min-width: 300px;
  min-height: 210px;
  transition: background-image 1s ease-out;
}
`;
  // tslint:enable:max-line-length
  const html$1 = `
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
          this.root.innerHTML = `<style>${styles$1}</style> ${html$1}`;
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
          container.classList.remove('padded');
          if (this.srcIsString(this.src)) {
              container.textContent = this.src;
              container.classList.add('padded');
          }
          else if (this.srcIsCardData(this.src)) {
              this.renderCardData(this.src);
          }
          else if (this.srcIsUrl(this.src)) {
              const iframe = document.createElement('iframe');
              iframe.src = this.src.toString();
              iframe.setAttribute('sandbox', this.sandboxAttribute);
              iframe.style.border = 'none';
              iframe.id = 'external-content';
              iframe.width = (this.width || 0).toString();
              iframe.height = (this.height || 0).toString();
              container.appendChild(iframe);
          }
          else {
              container.textContent = 'Unexpected content';
          }
      }
      renderCardData(data) {
          const container = this.root.querySelector('#container');
          if (!container) {
              return;
          }
          container.innerHTML = '';
          if (data.name) {
              const title = document.createElement('h1');
              title.setAttribute('id', 'title');
              title.textContent = data.name;
              container.appendChild(title);
          }
          if (data.image) {
              const img = document.createElement('div');
              img.setAttribute('id', 'image');
              img.style.backgroundImage = `url(${data.image})`;
              container.appendChild(img);
          }
          if (data.description) {
              const description = document.createElement('div');
              description.setAttribute('id', 'description');
              description.textContent = data.description;
              container.appendChild(description);
          }
      }
      srcIsString(msg) {
          return typeof msg === 'string';
      }
      srcIsCardData(msg) {
          return typeof msg === 'object' && typeof msg.href === 'undefined';
      }
      srcIsUrl(msg) {
          return typeof msg === 'object' && typeof msg.href !== 'undefined';
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
  const styles$2 = `
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
  const html$2 = `
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
          this.root.innerHTML = `<style>${styles$2}</style> ${html$2}`;
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
  const IntersectionObserverSupport = {
      name: 'IntersectionObserver',
      supported: async () => {
          return 'IntersectionObserver' in self &&
              'IntersectionObserverEntry' in self;
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
  --background: #FFF;
  --borderRadius: 4px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: 8px 8px 36px 8px;
  --buttonBottomMargin: 8px;
  --buttonSideMargin: 4px;
  --buttonActiveColor: #444;
  --buttonHoverColor: #666;
  --buttonInactiveColor: #AAA;
  --contentBorderRadius: 0px;

  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  outline: none;

  padding: var(--padding);
  border-radius: var(--borderRadius);
  font-family: var(--fontFamily);
  background: var(--background);
}

#container {
  color: var(--color);
  overflow: hidden;
  border-radius: var(--contentBorderRadius);
  display: block;
  cursor: pointer;
}

slot {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

slot::-webkit-scrollbar {
  display: none;
}

::slotted(*) {
  flex: 1 0 auto;
  scroll-snap-align: start;
}

#buttons {
  display: flex;
  height: 20px;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: var(--buttonBottomMargin);
}

#buttons button {
  margin: 0 var(--buttonSideMargin);
  font-size: 0;
  width: 18px;
  height: 18px;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
}

#buttons button::after {
  content: '';
  background: var(--buttonInactiveColor);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#buttons button::after:hover {
  background: var(--buttonHoverColor);
}

#buttons button.active::after {
  background: var(--buttonActiveColor);
}
`;
  const html$3 = `
<div id="container">
  <slot></slot>
  </div>
<div id="buttons"></div>`;

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  const IO_POLYFILL_PATH = '/third_party/intersection-observer/intersection-observer-polyfill.js';
  /* istanbul ignore next: Not testing polyfill injection x-browser */
  /**
   * @ignore
   */
  async function loadIntersectionObserverPolyfillIfNeeded(force = false) {
      if (!force && await IntersectionObserverSupport.supported()) {
          return true;
      }
      try {
          await injectScript(IO_POLYFILL_PATH);
          // Force the polyfill to check every 300ms.
          IntersectionObserver.prototype.POLL_INTERVAL = 300;
          log('Loaded IntersectionObserver polyfill', DEBUG_LEVEL.INFO, 'Onboarding');
          return true;
      }
      catch (e) {
          log('Intersection Observer polyfill load failed', DEBUG_LEVEL.ERROR, 'Onboarding');
          return false;
      }
  }
  /**
   * Provides a mechanism for onboarding users to your experience. Each child node
   * of the element is assumed to be a discrete step in the process.
   *
   * ```html
   * <onboarding-card width="327" height="376" mode="scroll">
   *   <img src="images/step1.png" width="327" height="376">
   *   <img src="images/step2.png" width="327" height="376">
   *   <img src="images/step3.png" width="327" height="376">
   * </onboarding-card>
   * ```
   *
   * The element can be further customized via CSS properties:
   *
   * ```css
   * onboarding-card {
   *   --background: #FFF;
   *   --borderRadius: 4px;
   *   --color: #333;
   *   --fontFamily: 'Arial', 'Helvetica', sans-serif;
   *   --padding: 8px 8px 36px 8px;
   *   --buttonBottomMargin: 8px;
   *   --buttonSideMargin: 4px;
   *   --buttonActiveColor: #444;
   *   --buttonHoverColor: #666;
   *   --buttonInactiveColor: #AAA;
   *   --contentBorderRadius: 0px;
   * }
   * ```
   */
  class OnboardingCard extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          this.ready = loadIntersectionObserverPolyfillIfNeeded();
          this.root = this.attachShadow({ mode: 'open' });
          this.itemsInView = new Set();
          this.modeInternal = 'scroll';
          this.itemInternal = 0;
          this.itemMax = 0;
          this.widthInternal = 0;
          this.heightInternal = 0;
          this.onSlotChangeBound = this.onSlotChange.bind(this);
          this.onContainerClickBound = this.onContainerClick.bind(this);
          this.onButtonClickBound = this.onButtonClick.bind(this);
          this.onIntersectionBound = this.onIntersection.bind(this);
      }
      /**
       * @ignore
       *
       * The attributes supported by the card:
       * <ul>
       *  <li>`width`: The width of the card.</li>
       *  <li>`height`: The height of the card.</li>
       *  <li>`mode`: The mode of the card, `scroll` or `fade`.</li>
       * </ul>
       */
      static get observedAttributes() {
          return ['width', 'height', 'mode'];
      }
      /**
       * Gets & sets the width of the card.
       */
      get width() {
          return this.widthInternal;
      }
      set width(width) {
          if (Number.isNaN(width)) {
              width = 0;
          }
          this.setAttribute('width', width.toString());
      }
      /**
       * Gets & sets the height of the card.
       */
      get height() {
          return this.heightInternal;
      }
      set height(height) {
          if (Number.isNaN(height)) {
              height = 0;
          }
          this.setAttribute('height', height.toString());
      }
      /**
       * Gets the current item's index.
       */
      get item() {
          return this.itemInternal;
      }
      /**
       * Gets & sets the mode of the card. `scroll` autoscrolls between steps,
       * `fade` fades between steps.
       */
      get mode() {
          return this.modeInternal;
      }
      set mode(mode) {
          this.setAttribute('mode', mode);
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      connectedCallback() {
          // Await the polyfill then go ahead.
          this.ready.then(() => {
              this.root.innerHTML = `<style>${styles$3}</style> ${html$3}`;
              const slot = this.root.querySelector('slot');
              const container = this.root.querySelector('#container');
              const buttons = this.root.querySelector('#buttons');
              slot.addEventListener('slotchange', this.onSlotChangeBound);
              container.addEventListener('click', this.onContainerClickBound);
              buttons.addEventListener('click', this.onButtonClickBound);
              this.setAttribute('tabindex', '0');
              this.observer = new IntersectionObserver(this.onIntersectionBound, {
                  root: container,
                  rootMargin: '-5px',
                  threshold: 0
              });
              this.updateCardDimensions();
              this.observeChildren();
              // Call the slot change callback manually for Safari 12; it doesn't do it
              // automatically for the initial element connection.
              this.onSlotChange();
          });
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      disconnectedCallback() {
          const slot = this.root.querySelector('slot');
          const container = this.root.querySelector('#container');
          const buttons = this.root.querySelector('#buttons');
          slot.removeEventListener('slotchange', this.onSlotChangeBound);
          container.removeEventListener('click', this.onContainerClickBound);
          buttons.addEventListener('click', this.onButtonClickBound);
          this.unobserveChildren();
          this.root.innerHTML = ``;
      }
      /**
       * @ignore Only public because it's a Custom Element.
       */
      attributeChangedCallback(name, oldValue, newValue) {
          switch (name) {
              case 'width': {
                  const value = Number(newValue);
                  this.widthInternal = Number.isNaN(value) ? 0 : value;
                  break;
              }
              case 'height': {
                  const value = Number(newValue);
                  this.heightInternal = Number.isNaN(value) ? 0 : value;
                  break;
              }
              case 'mode':
                  this.modeInternal = newValue === 'fade' ? 'fade' : 'scroll';
                  break;
          }
          this.updateCardDimensions();
      }
      /**
       * Moves to the next step.
       */
      async next() {
          const from = this.itemInternal;
          this.itemInternal = clamp(this.itemInternal + 1, 0, this.itemMax - 1);
          await this.gotoItem({ from });
          // The user has hit the final item in the list.
          if (from === this.itemInternal) {
              fire(OnboardingCard.onboardingFinishedEvent, this, { item: this.itemInternal });
          }
      }
      /**
       * Jumps to a given item. Accepts an optional object with `from` and `to`
       * numbers indicating the indexes of the item to move from and to,
       * respectively. If not provided, `gotoItem` assumes that there is no `from`
       * and that it ought to go to the current item.
       */
      async gotoItem({ to = this.itemInternal, from = -1 } = {}) {
          const elements = this.getSlotElements();
          if (!elements[to] || (from !== -1 && !elements[from]) || from === to) {
              return;
          }
          if (this.mode === 'fade') {
              if (from !== -1) {
                  await fade(elements[from], { from: 1, to: 0 });
                  // Bring the faded out element back up to 1 so that scrolling still
                  // works as intended.
                  elements[from].style.opacity = '1';
              }
              elements[to].scrollIntoView();
              this.itemsInView.add(elements[to]);
              await fade(elements[to], { from: 0, to: 1 });
          }
          else {
              elements[to].scrollIntoView({ behavior: 'smooth' });
          }
          this.setLabel();
      }
      setLabel() {
          const elements = this.getSlotElements();
          if (!elements[this.item]) {
              return;
          }
          this.setAttribute('aria-label', elements[this.item].getAttribute('alt') ||
              'No description provided');
      }
      onContainerClick() {
          this.next();
      }
      async onButtonClick(e) {
          const buttons = this.root.querySelector('#buttons');
          let idx = Array.from(buttons.childNodes).indexOf(e.target);
          /* istanbul ignore if */
          if (idx === -1) {
              idx = 0;
          }
          const from = this.itemInternal;
          this.itemInternal = idx;
          await this.gotoItem({ from });
      }
      onIntersection(entries) {
          const elements = this.getSlotElements();
          for (const entry of entries) {
              if (entry.isIntersecting) {
                  this.itemsInView.add(entry.target);
              }
              else {
                  this.itemsInView.delete(entry.target);
              }
              // Whenever the set of visible elements dips to 1 find the element.
              if (this.itemsInView.size !== 1) {
                  continue;
              }
              const items = Array.from(this.itemsInView);
              this.itemInternal = elements.indexOf(items[0]);
              fire(OnboardingCard.itemChangedEvent, this, { item: this.itemInternal });
          }
          const buttons = this.root.querySelectorAll('#buttons button');
          for (const [bIdx, button] of buttons.entries()) {
              button.classList.toggle('active', bIdx === this.itemInternal);
          }
      }
      observeChildren() {
          const elements = this.getSlotElements();
          for (const element of elements) {
              this.observer.observe(element);
          }
      }
      unobserveChildren() {
          // TODO(paullewis): Fire this on mutation events.
          const elements = this.getSlotElements();
          for (const element of elements) {
              this.observer.observe(element);
          }
      }
      getSlotElements() {
          const slot = this.root.querySelector('slot');
          /* istanbul ignore if */
          if (!slot) {
              return [];
          }
          const supportsAssignedElements = 'assignedElements' in slot;
          /* istanbul ignore else */
          if (supportsAssignedElements) {
              return slot.assignedElements();
          }
          else {
              return slot.assignedNodes()
                  .filter((node) => node.nodeType === this.ELEMENT_NODE);
          }
      }
      onSlotChange() {
          const buttons = this.root.querySelector('#buttons');
          const elements = this.getSlotElements();
          this.itemMax = elements.length;
          /* istanbul ignore if */
          if (!buttons) {
              return;
          }
          // Create status / control buttons for each state.
          buttons.innerHTML = '';
          for (let i = 0; i < this.itemMax; i++) {
              const button = document.createElement('button');
              button.textContent = `${i + 1}`;
              buttons.appendChild(button);
          }
          this.setLabel();
      }
      updateCardDimensions() {
          const container = this.root.querySelector('#container');
          /* istanbul ignore if */
          if (!container) {
              return;
          }
          container.style.width = `${this.width}px`;
          container.style.height = `${this.height}px`;
      }
  }
  /**
   * The name of the event fired when the final item has been reached.
   */
  OnboardingCard.onboardingFinishedEvent = 'onboardingfinished';
  /**
   * The name of the event fired when the item changes.
   */
  OnboardingCard.itemChangedEvent = 'itemchanged';
  /**
   * The default tag name provided to `customElement.define`.
   */
  OnboardingCard.defaultTagName = 'onboarding-card';

  /**
   * @license
   * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  const styles$4 = `
:host {
  --baseline: 12px;
  position: fixed;
  display: block;
  top: 50%;
  left: 50%;
  min-width: 280px;
  padding: var(--baseline) calc(var(--baseline) * 2);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  color: #FFF;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  z-index: 2;
}
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
  const overlay = document.createElement('div');
  const root = overlay.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${styles$4}</style><span class="content"><slot></slot></span>`;
  /**
   * Shows an overlay message. If there is already an overlay message a second
   * call will update the message rather than create a new overlay.
   */
  function showOverlay(message, target = document.body) {
      overlay.textContent = message;
      target.appendChild(overlay);
      return overlay;
  }
  /**
   * Hides the overlay if there is one.
   */
  function hideOverlay() {
      overlay.remove();
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
  const styles$5 = `
:host {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #333;
  animation: fadeIn 0.3s cubic-bezier(0, 0, 0.3, 1) forwards;
  --baseline: 12px;
}

canvas {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: #111;
}

#reticle {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
}

#close {
  width: calc(var(--baseline) * 3);
  height: calc(var(--baseline) * 3);
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53M` +
      `y5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI` +
      `0Ij48cGF0aCBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuN` +
      `TkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDE` +
      `yeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=);
  background-color: #FFF;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.overlay {
  position: absolute;
  bottom: 50px;
  left: 50%;
  min-width: 280px;
  padding: var(--baseline) calc(var(--baseline) * 2);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  color: #FFF;
  transform: translateX(-50%);
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}
`;
  const html$4 = `<svg id="reticle" viewBox="0 0 133 100"
    xmlns="http://www.w3.org/2000/svg">
  <mask id="reticle-cut-out">
    <rect id="reticle-cut-out-outer" width="133" height="100" x="0" y="0"
        fill="#FFF" />
    <rect id="reticle-cut-out-inner" x="24" y="8" width="85" height="85" rx="2"
        ry="2" fill="#000" />
  </mask>
  <rect id="reticle-box" width="133" height="100" x="0" y="0"
      fill="rgba(0,0,0,0.4)" mask="url(#reticle-cut-out)" />
</svg>
<button id="close">Close</button>
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
          /**
           * Whether to pause the frame.
           */
          this.paused = false;
          this.root = this.attachShadow({ mode: 'open' });
          this.lastCapture = -1;
          this.root.innerHTML = `<style>${styles$5}</style> ${html$4}`;
          this.root.addEventListener('click', (evt) => {
              const clicked = evt.path ? evt.path[0] : evt.composedPath()[0];
              if (clicked.id !== 'close') {
                  return;
              }
              fire(StreamCapture.closeEvent, this);
          });
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
              if (!this.paused) {
                  this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth * scale, this.video.videoHeight * scale);
              }
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
              this.setReticleOrientation(this.canvas.height > this.canvas.width);
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
      setReticleOrientation(vertical) {
          const reticle = this.root.querySelector('#reticle');
          /* istanbul ignore if */
          if (!reticle) {
              return;
          }
          if (vertical) {
              reticle.setAttribute('viewBox', '0 0 100 133');
              const maskOuter = reticle.querySelector('#reticle-cut-out-outer');
              const maskInner = reticle.querySelector('#reticle-cut-out-inner');
              const reticleBox = reticle.querySelector('#reticle-box');
              /* istanbul ignore if */
              if (!maskOuter || !maskInner || !reticleBox) {
                  return;
              }
              maskOuter.setAttribute('width', '100');
              maskOuter.setAttribute('height', '133');
              maskInner.setAttribute('x', '8');
              maskInner.setAttribute('y', '24');
              reticleBox.setAttribute('width', '100');
              reticleBox.setAttribute('height', '133');
          }
          reticle.style.opacity = '1';
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
              this.root.appendChild(this.canvas);
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
   * The name for stop capture events.
   */
  StreamCapture.closeEvent = 'captureclose';

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
  /**
   * Vibrates the user's device if supported.
   */
  function vibrate(pattern = 200) {
      if (!('vibrate' in navigator)) {
          return;
      }
      navigator.vibrate(pattern);
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
   * Convert a marker type (barcode, qrcode, etc) and its value into a unique id
   *
   */
  function generateMarkerId(type, value) {
      return type + '__' + value;
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
  class ArtifactDealer {
      constructor() {
          this.artstores = [];
          this.nearbyMarkers = new Map();
          this.nearbyResults = new Set();
          this.currentGeolocation = {};
      }
      async addArtifactStore(artstore) {
          this.artstores.push(artstore);
          return this.generateDiffs();
      }
      async updateGeolocation(coords) {
          this.currentGeolocation = coords;
          return this.generateDiffs();
      }
      async markerFound(marker) {
          this.nearbyMarkers.set(generateMarkerId(marker.type, marker.value), marker);
          return this.generateDiffs();
      }
      async markerLost(marker) {
          this.nearbyMarkers.delete(generateMarkerId(marker.type, marker.value));
          return this.generateDiffs();
      }
      // TODO (#34): Change ArtStore's `findRelevantArtifacts` to be async
      // TODO (#33): Replace map+flat with flatMap once it is polyfilled for all platforms.
      async generateDiffs() {
          // 1. Using current context (geo, markers), ask artstores to compute relevant artifacts
          const pendingNearbyResults = new Set(this.artstores.map((artstore) => {
              return artstore.findRelevantArtifacts(Array.from(this.nearbyMarkers.values()), this.currentGeolocation);
          }).flat(1));
          // 2. Diff with previous list to compute new/old artifacts.
          //    New ones are those which haven't appeared before.
          //    Old ones are those which are no longer nearby.
          //    The remainder (intersection) are not reported.
          const newNearbyResults = [...pendingNearbyResults].filter(a => !this.nearbyResults.has(a));
          const oldNearbyresults = [...this.nearbyResults].filter(a => !pendingNearbyResults.has(a));
          const ret = {
              found: [],
              lost: []
          };
          // 3. Compute
          for (const { target, artifact } of newNearbyResults) {
              const content = artifact.arContent;
              ret.found.push({ target, content, artifact });
          }
          for (const { target, artifact } of oldNearbyresults) {
              const content = artifact.arContent;
              ret.lost.push({ target, content, artifact });
          }
          // 4. Update current set of nearbyResults.
          this.nearbyResults = pendingNearbyResults;
          return ret;
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
  /*
   * ArtifactDecoder accepts a jsonld block and will extract and return valid ARArtifacts
   *
   * */
  class ArtifactDecoder {
      decode(jsonld) {
          return this.decodeUnknown(jsonld).flat();
      }
      decodeUnknown(jsonld) {
          if (Array.isArray(jsonld)) {
              return this.decodeArray(jsonld);
          }
          if (!('@type' in jsonld) || typeof jsonld['@type'] !== 'string') {
              return [];
          }
          switch (jsonld['@type']) {
              case 'DataFeed':
                  return this.decodeDataFeed(jsonld);
              case 'ARArtifact':
                  return this.decodeArArtifact(jsonld);
              default:
                  return [];
          }
      }
      decodeArray(arr) {
          return arr.map(e => this.decodeUnknown(e)).flat();
      }
      decodeDataFeed(jsonld) {
          const elements = jsonld.dataFeedElement;
          if (!elements) {
              return [];
          }
          if (!Array.isArray(elements)) {
              return this.decodeUnknown(elements);
          }
          return this.decodeArray(elements);
      }
      decodeArArtifact(jsonld) {
          return [jsonld];
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
  // TODO: Consider merging from*Url functions and just branching on response content-type
  class ArtifactLoader {
      constructor() {
          this.decoder = new ArtifactDecoder();
      }
      // TODO (#35): Change ArtifactsLoader to only "index" URLs where Artifacts could actually exist
      async fromHtmlUrl(url) {
          // Note: according to MDN, can use XHR request to create Document direct from URL
          // This may be better, because could have document.location.href (etc) settings automatically?
          // Note: this already proved issue when getting .src property of script/link tags, since relative
          // Urls are based off this document root, not the fetched source.
          const response = await fetch(url.toString());
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          return this.fromDocument(doc, url);
      }
      async fromJsonUrl(url) {
          const response = await fetch(url.toString());
          if (!response.ok) {
              throw Error(response.statusText);
          }
          const json = await response.json();
          return this.fromJson(json);
      }
      async fromDocument(doc, url) {
          const ret = [];
          const inlineScripts = doc.querySelectorAll('script[type=\'application/ld+json\']:not([src])');
          for (const jsonldScript of inlineScripts) {
              ret.push(this.fromJson(JSON.parse(jsonldScript.textContent || '')));
          }
          const externalScripts = doc.querySelectorAll('script[type=\'application/ld+json\'][src]');
          for (const jsonldScript of externalScripts) {
              const src = jsonldScript.getAttribute('src');
              if (!src) {
                  continue;
              }
              ret.push(this.fromJsonUrl(new URL(src, /* base= */ url)));
          }
          const jsonldLinks = doc.querySelectorAll('link[rel=\'alternate\'][type=\'application/ld+json\'][href]');
          for (const jsonldLink of jsonldLinks) {
              const href = jsonldLink.getAttribute('href');
              if (!href) {
                  continue;
              }
              ret.push(this.fromJsonUrl(new URL(href, /* base= */ url)));
          }
          return (await Promise.all(ret)).flat(1);
      }
      async fromJson(json) {
          return this.decoder.decode(json);
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
  class LocalMarkerStore {
      constructor() {
          this.markers = new Map();
      }
      addMarker(artifact, barcode) {
          if (!barcode.text) {
              return;
          }
          this.markers.set(barcode.text, { target: barcode, artifact });
      }
      findRelevantArtifacts(markers) {
          const ret = [];
          for (const marker of markers) {
              if (!marker.value) {
                  continue;
              }
              const nearbyResult = this.markers.get(marker.value);
              if (nearbyResult) {
                  ret.push(nearbyResult);
              }
          }
          return ret;
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
  class LocalArtifactStore {
      constructor() {
          this.markerStore = new LocalMarkerStore();
      }
      addArtifact(artifact) {
          if (!artifact.arTarget) {
              return;
          }
          let targets = [];
          if (Array.isArray(artifact.arTarget)) {
              targets = artifact.arTarget;
          }
          else {
              targets = [artifact.arTarget];
          }
          for (const target of targets) {
              const targetType = target['@type'] || '';
              switch (targetType) {
                  case 'Barcode':
                      this.markerStore.addMarker(artifact, target);
                      break;
                  default:
                      break; // We ignore types we don't support, and move on
              }
          }
      }
      findRelevantArtifacts(nearbyMarkers, geo) {
          return this.markerStore.findRelevantArtifacts(nearbyMarkers);
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
  const artloader = new ArtifactLoader();
  const artstore = new LocalArtifactStore();
  const artdealer = new ArtifactDealer();
  artdealer.addArtifactStore(artstore);
  const detectedBarcodes = new Set();
  const barcodeDetect = 'barcodedetect';
  const cameraAccessDenied = 'cameraaccessdenied';
  // Register custom elements.
  customElements.define(StreamCapture.defaultTagName, StreamCapture);
  customElements.define(Card.defaultTagName, Card);
  customElements.define(ActionButton.defaultTagName, ActionButton);
  // Register events.
  window.addEventListener(StreamCapture.frameEvent, onCaptureFrame);
  window.addEventListener('offline', onConnectivityChanged);
  window.addEventListener('online', onConnectivityChanged);
  // While the onboarding begins, attempt a fake detection. If the polyfill is
  // necessary, or the detection fails, we should find out.
  const polyfillPrefix = window.PerceptionToolkit.config.root || '';
  const attemptDetection = detectBarcodes(new ImageData(1, 1), { polyfillPrefix });
  /**
   * Starts the user onboarding.
   */
  async function initialize(detectionMode = 'passive') {
      const onboarding = document.querySelector(OnboardingCard.defaultTagName);
      if (!onboarding) {
          beginDetection(detectionMode);
          return;
      }
      // When onboarding is finished, start the stream and remove the loader.
      onboarding.addEventListener(OnboardingCard.onboardingFinishedEvent, () => {
          onboarding.remove();
          beginDetection(detectionMode);
      });
  }
  /**
   * Initializes the main behavior.
   */
  async function beginDetection(detectionMode) {
      try {
          // Wait for the faked detection to resolve.
          await attemptDetection;
          // Start loading some artifacts.
          await loadInitialArtifacts();
          // Create the stream.
          await createStreamCapture(detectionMode);
      }
      catch (e) {
          log(e.message, DEBUG_LEVEL.ERROR, 'Barcode detection');
      }
  }
  /**
   * Load artifact content for initial set.
   */
  async function loadInitialArtifacts() {
      const artifactGroups = await Promise.all([
          artloader.fromDocument(document, document.URL),
          artloader.fromJsonUrl(new URL('./barcode-listing-sitemap.jsonld', document.URL)),
      ]);
      for (const artifacts of artifactGroups) {
          for (const artifact of artifacts) {
              artstore.addArtifact(artifact);
          }
      }
  }
  /**
   * Load artifact content from url on same originn, usually discovered from environment.
   */
  async function loadArtifactsFromSameOriginUrl(url) {
      // Test that this URL is not from another origin
      if (url.hostname !== window.location.hostname ||
          url.port !== window.location.port ||
          url.protocol !== window.location.protocol) {
          return;
      }
      const artifacts = await artloader.fromHtmlUrl(url);
      for (const artifact of artifacts) {
          artstore.addArtifact(artifact);
      }
  }
  /**
   * Whenever we find nearby content, show it
   */
  async function updateContentDisplay(contentDiff) {
      if (!window.PerceptionToolkit.config.cardContainer) {
          return;
      }
      const container = window.PerceptionToolkit.config.cardContainer;
      // Prevent multiple cards from showing.
      if (container.hasChildNodes()) {
          return;
      }
      for (const { target, content, artifact } of contentDiff.found) {
          // Create a card for every found barcode.
          const card = new Card();
          card.src = content;
          container.appendChild(card);
      }
  }
  /*
   * Handle Marker discovery
   */
  async function onMarkerFound(evt) {
      const { detail } = evt;
      const marker = { type: 'qrcode', value: detail };
      vibrate(200);
      // If this marker is a URL, try loading artifacts from that URL
      try {
          // Attempt to convert markerValue to URL.  This will throw if markerValue isn't a valid URL.
          // Do not supply a base url argument, since we do not want to support relative URLs,
          // and because that would turn lots of normal string values into valid relative URLs.
          const url = new URL(marker.value);
          await loadArtifactsFromSameOriginUrl(url);
      }
      catch (_) {
          // Do nothing if this isn't a valid URL
      }
      // Update the UI
      const contentDiffs = await artdealer.markerFound(marker);
      updateContentDisplay(contentDiffs);
  }
  let hintTimeout;
  const capture = new StreamCapture();
  /**
   * Creates the stream an initializes capture.
   */
  async function createStreamCapture(detectionMode) {
      if (detectionMode === 'passive') {
          capture.captureRate = 600;
      }
      else {
          showOverlay('Tap to capture');
          capture.addEventListener('click', async () => {
              capture.paused = true;
              showOverlay('Processing...');
              const imgData = await capture.captureFrame();
              fire(StreamCapture.frameEvent, capture, { imgData, detectionMode });
          });
      }
      capture.captureScale = 0.8;
      capture.addEventListener(StreamCapture.closeEvent, close);
      capture.addEventListener(barcodeDetect, onMarkerFound);
      const streamOpts = {
          video: {
              facingMode: 'environment'
          }
      };
      // Attempt to get access to the user's camera.
      try {
          let stream = await navigator.mediaDevices.getUserMedia(streamOpts);
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasEnvCamera = await supportsEnvironmentCamera(devices);
          capture.flipped = !hasEnvCamera;
          // Ensure the stream is stopped and started when the user changes tabs.
          let isRequestingNewStream = false;
          window.addEventListener('visibilitychange', async () => {
              if (isRequestingNewStream) {
                  return;
              }
              if (document.hidden) {
                  capture.stop();
              }
              else {
                  // Block multiple requests for a new stream.
                  isRequestingNewStream = true;
                  stream = await navigator.mediaDevices.getUserMedia(streamOpts);
                  isRequestingNewStream = false;
                  // Bail if the document is hidden again.
                  if (document.hidden) {
                      return;
                  }
                  // Ensure the capture is definitely stopped before starting a new one.
                  capture.stop();
                  capture.start(stream);
              }
          });
          capture.start(stream);
          document.body.appendChild(capture);
          hintTimeout = setTimeout(() => {
              showOverlay('Make sure the barcode is inside the box.');
          }, window.PerceptionToolkit.config.hintTimeout || 5000);
      }
      catch (e) {
          // User has denied or there are no cameras.
          fire(cameraAccessDenied, window);
      }
  }
  function close() {
      capture.stop();
      capture.remove();
      hideOverlay();
      clearTimeout(hintTimeout);
  }
  let isProcessingCapture = false;
  /**
   * Processes the image data captured by the StreamCapture class, and hands off
   * the image data to the barcode detector for processing.
   *
   * @param evt The Custom Event containing the captured frame data.
   */
  async function onCaptureFrame(evt) {
      // Prevent overloading the capture process.
      if (isProcessingCapture) {
          return;
      }
      isProcessingCapture = true;
      const capture = evt.target;
      const { detail } = evt;
      const { detectionMode, imgData } = detail;
      const barcodes = await detectBarcodes(imgData, { polyfillPrefix });
      for (const barcode of barcodes) {
          if (detectedBarcodes.has(barcode.rawValue)) {
              continue;
          }
          // Prevent multiple markers for the same barcode.
          detectedBarcodes.add(barcode.rawValue);
          fire(barcodeDetect, capture, barcode.rawValue);
      }
      if (barcodes.length > 0) {
          // Hide the hint if it's shown. Cancel it if it's pending.
          clearTimeout(hintTimeout);
          hideOverlay();
      }
      else if (detectionMode && detectionMode === 'active') {
          showOverlay('No barcodes found');
      }
      capture.paused = false;
      // Provide a cool-off before allowing another detection. This aids the case
      // where a recently-scanned barcode is mistakenly re-scanned, but with errors.
      setTimeout(() => {
          detectedBarcodes.clear();
          isProcessingCapture = false;
      }, 1000);
      // Hide the loader if there is one.
      const loader = document.querySelector(DotLoader.defaultTagName);
      if (!loader) {
          return;
      }
      loader.remove();
  }
  /**
   * Handles connectivity change for the user.
   */
  function onConnectivityChanged() {
      const connected = navigator.onLine;
      const capture = document.body.querySelector(StreamCapture.defaultTagName);
      if (!capture) {
          return;
      }
      if (!connected) {
          showOverlay('Currently offline. Please reconnect to the network.');
      }
      else {
          hideOverlay();
      }
  }

  exports.initialize = initialize;
  exports.close = close;
  exports.vibrate = vibrate;
  exports.Card = Card;
  exports.ActionButton = ActionButton;

  return exports;

}({}));
