/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { fire } from '../../utils/fire.js';
import { html, styles } from './camera-capture.template.js';

export class CameraCapture extends HTMLElement {
  static defaultTagName = 'camera-capture';
  static frameEvent = 'captureframe';
  static startEvent = 'capturestarted';
  static stopEvent = 'capturestopped';

  captureScale = 0.5;
  captureRate = 0;
  capturePng = false;
  flipped = false;

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
  }

  disconnectedCallback() {
    this.stop();
  }

  start(stream: MediaStream) {
    if (this.stream) {
      throw new Error('Stream already provided. Stop the capture first.');
    }

    this.stream = stream;
    this.initElementsIfNecessary();

    const video = this.video!;
    const update = (now: number) => {
      if (!this.video || !this.ctx) {
        return;
      }

      this.ctx.drawImage(this.video, 0, 0,
          this.video.videoWidth * this.captureScale,
          this.video.videoHeight * this.captureScale);

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
      while(redoCheck) {
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

      // If the camera does not support the environment camera it will need to
      // be flipped to look correct.
      if (this.flipped) {
        this.ctx.translate(this.canvas.width * 0.5, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-this.canvas.width * 0.5, 0);
      }

      requestAnimationFrame((now) => {
        update(now);
        fire(CameraCapture.startEvent, this);
      });
    }, { once: true });
  }

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
            fire(CameraCapture.frameEvent, this, {imgData});
          }

          resolve(imgData);
        };
      } else {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (this.captureRate !== 0) {
          fire(CameraCapture.frameEvent, this, {imgData});
        }

        resolve(imgData);
      }
    });
  }

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

    fire(CameraCapture.stopEvent, this);
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
