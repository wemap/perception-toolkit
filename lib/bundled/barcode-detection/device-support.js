this.Toolkit = this.Toolkit || {};
this.Toolkit.deviceSupport = (function (exports) {
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
  --baseline: 8px;
  --background: #FFF;
  --borderRadius: 4px;
  --color: #333;
  --fontFamily: 'Arial', 'Helvetica', sans-serif;
  --padding: calc(var(--baseline) * 2)
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
  const html = `<div id="container"></div>`;

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
          this.root.innerHTML = `<style>${styles}</style> ${html}`;
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
  const GetUserMediaSupport = {
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
  const WasmSupport = {
      name: 'wasm',
      supported: async () => {
          return 'WebAssembly' in self;
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
  async function detectSupport() {
      const deviceSupport = new DeviceSupport();
      deviceSupport.addDetector(GetUserMediaSupport);
      deviceSupport.addDetector(WasmSupport);
      const support = await deviceSupport.detect();
      if (!(support[GetUserMediaSupport.name] && support[WasmSupport.name])) {
          // Register custom elements.
          customElements.define(NoSupportCard.defaultTagName, NoSupportCard);
          const noSupport = new NoSupportCard();
          document.body.appendChild(noSupport);
          return false;
      }
      return true;
  }

  exports.detectSupport = detectSupport;

  return exports;

}({}));
