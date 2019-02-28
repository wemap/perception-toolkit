/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { clamp } from '../../utils/clamp.js';
import { fire } from '../../utils/fire.js';
import { DEBUG_LEVEL, log } from '../../utils/index.js';
import { html, styles } from './stream-capture.template.js';

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
export class StreamCapture extends HTMLElement {
  /**
   * The StreamCapture's default tag name for registering with
   * `customElements.define`.
   */
  static defaultTagName = 'stream-capture';

  /**
   * The name for captured frame events.
   */
  static frameEvent = 'captureframe';

  /**
   * The name for start capture events.
   */
  static startEvent = 'capturestarted';

  /**
   * The name for stop capture events.
   */
  static stopEvent = 'capturestopped';

  /**
   * The name for stop capture events.
   */
  static closeEvent = 'captureclose';

  /**
   * The sample scale, intended to go between `0` and `1` (though clamped only
   * to `0` in case you wish to sample at a larger scale).
   */
  captureScale = 0.5;

  /**
   * How often to capture the stream in ms, where `0` represents never.
   * Note that you can cause performance issues if `captureRate` is higher than
   * the speed at which the captured pixels can be processed.
   */
  captureRate = 0;

  /**
   * Whether to capture a PNG `HTMLImageElement` instead of `ImageData`
   * (the default).
   */
  capturePng = false;

  /**
   * Whether to flip the stream's image.
   */
  flipped = false;

  private overlay: HTMLDivElement | undefined;
  private video: HTMLVideoElement | undefined;
  private stream: MediaStream | undefined;
  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private root = this.attachShadow({ mode: 'open' });
  private lastCapture = -1;

  /* istanbul ignore next */
  constructor() {
    super();

    this.root.innerHTML = `<style>${styles}</style> ${html}`;
    this.root.addEventListener('click', (evt) => {
      const clicked =
        evt.path ? evt.path[0] : evt.composedPath()[0] as HTMLElement;
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
  start(stream: MediaStream) {
    if (this.stream) {
      throw new Error('Stream already provided. Stop the capture first.');
    }

    this.stream = stream;
    this.initElementsIfNecessary();

    const scale = clamp(this.captureScale, 0);
    const video = this.video!;
    const update = (now: number) => {
      if (!this.video || !this.ctx) {
        return;
      }

      this.ctx.drawImage(this.video, 0, 0,
          this.video.videoWidth * scale,
          this.video.videoHeight * scale);

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
   * Shows an overlay message. If there is already an overlay message a second
   * call will update the message rather than create a new overlay.
   */
  showOverlay(message: string) {
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('overlay');
    }

    this.overlay.textContent = message;
    this.root.appendChild(this.overlay);
  }

  /**
   * Hides the overlay if there is one.
   */
  hideOverlay() {
    if (!this.overlay) {
      return;
    }

    this.overlay.remove();
  }

  /**
   * Manually captures a frame. Intended to be used when `captureRate` is `0`.
   */
  async captureFrame(): Promise<ImageData | HTMLImageElement> {
    /* istanbul ignore if */
    if (!this.ctx || !this.canvas) {
      throw new Error('Unable to capture frame');
    }

    return new Promise((resolve) => {
      const canvas = this.canvas!;
      const ctx = this.ctx!;
      let imgData: ImageData | HTMLImageElement;
      if (this.capturePng) {
        imgData = new Image();
        imgData.src = canvas.toDataURL('image/png');
        imgData.onload = () => {
          if (this.captureRate !== 0) {
            fire(StreamCapture.frameEvent, this, {imgData});
          }

          resolve(imgData);
        };
      } else {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (this.captureRate !== 0) {
          fire(StreamCapture.frameEvent, this, {imgData});
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

  private setReticleOrientation(vertical: boolean) {
    const reticle = this.root.querySelector('#reticle') as HTMLElement;
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

  private initElementsIfNecessary() {
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
