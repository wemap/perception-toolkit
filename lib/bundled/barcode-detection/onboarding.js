this.PerceptionToolkit = this.PerceptionToolkit || {};
this.PerceptionToolkit.onboarding = (function (exports) {
  'use strict';

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
  const IntersectionObserverSupport = {
      name: 'IntersectionObserver',
      supported: async () => {
          return 'IntersectionObserver' in self &&
              'IntersectionObserverEntry' in self;
      }
  };

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
   * A convenience function for firing custom events.
   *
   * ```javascript
   * fire('eventname', someElement, {foo: 'bar'});
   * ```
   */
  function fire(name, target, detail) {
      const evt = new CustomEvent(name, { bubbles: true, detail });
      target.dispatchEvent(evt);
      return evt;
  }

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
  const styles = `
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
  z-index: 1;
  overflow: auto;

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
  const html = `
<div id="container">
  <slot></slot>
  </div>
<div id="buttons"></div>`;

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
  const IO_POLYFILL_PATH = '/third_party/intersection-observer/intersection-observer-polyfill.js';
  /* istanbul ignore next: Not testing polyfill injection x-browser */
  /**
   * @ignore
   */
  async function loadIntersectionObserverPolyfillIfNeeded({ force = false, polyfillPrefix = '' }) {
      if (!force && await IntersectionObserverSupport.supported()) {
          return true;
      }
      try {
          await injectScript(`${polyfillPrefix}${IO_POLYFILL_PATH}`);
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
      constructor({ polyfillPrefix = '' } = {}) {
          super();
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
          this.ready = loadIntersectionObserverPolyfillIfNeeded({ polyfillPrefix });
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
              this.root.innerHTML = `<style>${styles}</style> ${html}`;
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
  async function loadImages(paths) {
      const images = paths.map((path) => {
          return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = path;
              img.onerror = reject;
              img.onload = () => resolve(img);
          });
      });
      return await Promise.all(images);
  }

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
  async function startOnboardingProcess(images) {
      const { config } = window.PerceptionToolkit || { config: { root: '' } };
      const { root = '' } = config;
      const onboarding = new OnboardingCard({ polyfillPrefix: root });
      await onboarding.ready;
      onboarding.mode = 'fade';
      const stepImages = await loadImages(images);
      for (const stepImage of stepImages) {
          // Assume each image ought to be at 50%, which is the case here because the
          // images are at 2x for high dpi screens.
          stepImage.width = stepImage.naturalWidth * 0.5;
          stepImage.height = stepImage.naturalHeight * 0.5;
          // Update the onboarding element's dimensions.
          if (onboarding.width === 0 || onboarding.height === 0) {
              onboarding.width = stepImage.width;
              onboarding.height = stepImage.height;
          }
          onboarding.appendChild(stepImage);
      }
      document.body.appendChild(onboarding);
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
              fire(OnboardingCard.onboardingFinishedEvent, card);
              break;
          default: return;
      }
  });
  window.addEventListener(OnboardingCard.onboardingFinishedEvent, (e) => {
      const target = e.target;
      const tagName = OnboardingCard.defaultTagName.toUpperCase();
      if (!target || target.tagName !== tagName) {
          return;
      }
      target.remove();
      document.body.focus();
  });
  // Register the card element, and start the process.
  customElements.define(OnboardingCard.defaultTagName, OnboardingCard);

  exports.startOnboardingProcess = startOnboardingProcess;

  return exports;

}({}));
