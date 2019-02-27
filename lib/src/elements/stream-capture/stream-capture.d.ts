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
export declare class StreamCapture extends HTMLElement {
    /**
     * The StreamCapture's default tag name for registering with
     * `customElements.define`.
     */
    static defaultTagName: string;
    /**
     * The name for captured frame events.
     */
    static frameEvent: string;
    /**
     * The name for start capture events.
     */
    static startEvent: string;
    /**
     * The name for stop capture events.
     */
    static stopEvent: string;
    /**
     * The name for stop capture events.
     */
    static closeEvent: string;
    /**
     * The sample scale, intended to go between `0` and `1` (though clamped only
     * to `0` in case you wish to sample at a larger scale).
     */
    captureScale: number;
    /**
     * How often to capture the stream in ms, where `0` represents never.
     * Note that you can cause performance issues if `captureRate` is higher than
     * the speed at which the captured pixels can be processed.
     */
    captureRate: number;
    /**
     * Whether to capture a PNG `HTMLImageElement` instead of `ImageData`
     * (the default).
     */
    capturePng: boolean;
    /**
     * Whether to flip the stream's image.
     */
    flipped: boolean;
    private video;
    private stream;
    private canvas;
    private ctx;
    private root;
    private lastCapture;
    constructor();
    /**
     * @ignore Only public because it's a Custom Element.
     */
    disconnectedCallback(): void;
    /**
     * Starts the capture of the stream.
     */
    start(stream: MediaStream): void;
    /**
     * Manually captures a frame. Intended to be used when `captureRate` is `0`.
     */
    captureFrame(): Promise<ImageData | HTMLImageElement>;
    /**
     * Stops the stream.
     */
    stop(): void;
    private setReticleOrientation;
    private initElementsIfNecessary;
}
