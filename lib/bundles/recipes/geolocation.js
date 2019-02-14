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
  const html$1 = `<div id="container"></div>`;

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
          this.root.innerHTML = `<style>${styles$1}</style> ${html$1}`;
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
  var GeolocationSupport = {
      name: 'geolocation',
      supported: async () => {
          return 'geolocation' in self.navigator;
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
   * A convenience function that remaps the Geolocation API to a Promise.
   *
   * ```javascript
   * const location = await geolocation();
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
   */
  async function geolocation() {
      return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((e) => resolve(e.coords), reject);
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
   * Processes the outcome of the device support testing.
   *
   * @param evt The supports event from the DeviceSupport class.
   */
  async function onSupports(evt) {
      const supportEvt = evt;
      if (!(supportEvt.detail[GeolocationSupport.name])) {
          const noSupport = new NoSupportCard();
          document.body.appendChild(noSupport);
          return;
      }
      const container = createContainerIfRequired();
      const card = new Card();
      card.src = 'Obtaining location...';
      container.appendChild(card);
      try {
          const { latitude, longitude } = await geolocation();
          card.src = `Lat: ${latitude}, Lng: ${longitude}`;
      }
      catch (err) {
          card.src = err.message;
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
  customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
  customElements.define(Card.defaultTagName, Card);
  // Register events.
  window.addEventListener(DeviceSupport.supportsEvent, onSupports);
  // Start the detection process.
  const deviceSupport = new DeviceSupport();
  deviceSupport.useEvents = true;
  deviceSupport.addDetector(GeolocationSupport);
  deviceSupport.detect();

}());
