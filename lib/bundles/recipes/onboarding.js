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
  const styles = `
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
  const html = `
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
          this.root.innerHTML = `<style>${styles}</style> ${html}`;
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
  const styles$1 = `
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
  const html$1 = `
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
   */
  class OnboardingCard extends HTMLElement {
      /* istanbul ignore next */
      constructor() {
          super();
          this.modeInternal = 'scroll';
          this.itemInternal = 0;
          this.itemMax = 0;
          this.widthInternal = 0;
          this.heightInternal = 0;
          this.root = this.attachShadow({ mode: 'open' });
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
          this.root.innerHTML = `<style>${styles$1}</style> ${html$1}`;
          const slot = this.root.querySelector('slot');
          const container = this.root.querySelector('#container');
          const buttons = this.root.querySelector('#buttons');
          slot.addEventListener('slotchange', this.onSlotChangeBound);
          container.addEventListener('click', this.onContainerClickBound);
          buttons.addEventListener('click', this.onButtonClickBound);
          this.setAttribute('tabindex', '0');
          this.observer = new IntersectionObserver(this.onIntersectionBound, {
              root: container,
              rootMargin: '-1px'
          });
          this.updateCardDimensions();
          this.observeChildren();
          // Call the slot change callback manually for Safari 12; it doesn't do it
          // automatically for the initial element connection.
          this.onSlotChange();
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
              fire(OnboardingCard.onboardingFinishedEvent, this, { id: this.itemInternal });
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
              }
              elements[to].scrollIntoView();
              await fade(elements[to], { from: 0, to: 1 });
          }
          else {
              elements[to].scrollIntoView({ behavior: 'smooth' });
          }
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
              if (!entry.isIntersecting) {
                  continue;
              }
              this.itemInternal = elements.indexOf(entry.target);
              fire(OnboardingCard.itemChangedEvent, this, { id: this.itemInternal });
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
  var IntersectionObserverSupport = {
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
  let loader;
  const IO_POLYFILL_PATH = '/third_party/intersection-observer/intersection-observer-polyfill.js';
  /**
   * Processes the outcome of the device support testing.
   *
   * @param evt The supports event from the DeviceSupport class.
   */
  async function onSupports(evt) {
      loader = new DotLoader();
      loader.style.setProperty('--color', '#FFF');
      document.body.appendChild(loader);
      const supportEvt = evt;
      if (!(supportEvt.detail[IntersectionObserverSupport.name])) {
          await injectScript(IO_POLYFILL_PATH);
          // Force the polyfill to check every 300ms.
          IntersectionObserver.prototype.POLL_INTERVAL = 300;
          console.log('Loaded polyfill: IntersectionObserver');
      }
      // Wait to confirm that IntersectionObservers are in place before registering
      // the Onboarding Card element.
      customElements.define(OnboardingCard.defaultTagName, OnboardingCard);
      const card = document.querySelector(OnboardingCard.defaultTagName);
      if (!card) {
          return;
      }
      card.focus();
      loader.remove();
  }
  window.addEventListener('keyup', (e) => {
      const card = document.activeElement;
      if (card.tagName !== OnboardingCard.defaultTagName.toUpperCase()) {
          return;
      }
      switch (e.key) {
          case ' ':
              card.next();
              break;
          case 'Escape':
              card.remove();
              break;
          default: return;
      }
  });
  window.addEventListener(DeviceSupport.supportsEvent, onSupports);
  window.addEventListener(OnboardingCard.onboardingFinishedEvent, (e) => {
      e.target.remove();
  });
  // Register the dot loader.
  customElements.define(DotLoader.defaultTagName, DotLoader);
  // Start the detection process.
  const deviceSupport = new DeviceSupport();
  deviceSupport.useEvents = true;
  deviceSupport.addDetector(IntersectionObserverSupport);
  deviceSupport.detect();

}());
