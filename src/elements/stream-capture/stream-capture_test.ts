/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
}

const { assert } = chai;

import { isImageData } from '../../utils/is-image-data.js';
import { StreamCapture } from './stream-capture.js';
customElements.define(StreamCapture.defaultTagName, StreamCapture);

const width = 400;
const height = 402;
function mockInputStream() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  // Draw a pink left half, and a green right half.
  const render = () => {
    ctx.fillStyle = `#F0F`;
    ctx.fillRect(0, 0, width * 0.5, height);
    ctx.fillStyle = `#0F0`;
    ctx.fillRect(width * 0.5, 0, width * 0.5, height);
  };

  return {
    render,
    stream: canvas.captureStream()
  };
}

describe('StreamCapture', function() {
  let capture: StreamCapture;
  let stream: MediaStream;
  let streamRequiresUpdate = false;
  let render: () => void;

  // Force an update to the stream, otherwise Safari considers the video
  // to be in some way ended.
  const updateStream = () => {
    render();
    if (!streamRequiresUpdate) {
      return;
    }

    requestAnimationFrame(() => updateStream());
  };

  beforeEach(() => {
    capture = new StreamCapture();
    const mock = mockInputStream();
    stream = mock.stream;
    render = mock.render;
    streamRequiresUpdate = true;

    requestAnimationFrame(() => updateStream());
  });

  afterEach(() => {
    streamRequiresUpdate = false;
    capture.stop();
  });

  it('captures images', (done) => {
    capture.start(stream);

    capture.addEventListener(StreamCapture.startEvent, async () => {
      const imgData = await capture.captureFrame();
      assert.equal(imgData.width, width * capture.captureScale);
      assert.equal(imgData.height, height * capture.captureScale);

      if (isImageData(imgData)) {
        assert.isAbove(imgData.data[0], 250);
      } else {
        assert.fail('Expected image data');
      }

      done();
    });
  });

  it('creates image elements', (done) => {
    capture.start(stream);
    capture.capturePng = true;

    capture.addEventListener(StreamCapture.startEvent, async () => {
      const imgData = await capture.captureFrame();
      assert.equal(imgData.width, width * capture.captureScale);
      assert.equal(imgData.height, height * capture.captureScale);

      if (isImageData(imgData)) {
        assert.fail('Expected PNG data');
      } else {
        assert.equal(imgData.tagName, 'IMG');
      }
      done();
    });
  });

  it('emits imageData frame events', (done) => {
    capture.start(stream);
    capture.captureRate = 100;

    capture.addEventListener(StreamCapture.frameEvent, (evt) => {
      const { detail } = evt as CustomEvent<{imgData: ImageData}>;
      const { imgData } = detail;

      assert.equal(imgData.width, width * capture.captureScale);
      assert.equal(imgData.height, height * capture.captureScale);
      assert.isAbove(imgData.data[0], 250);

      done();
    });
  });

  it('emits image element frame events', (done) => {
    capture.start(stream);
    capture.capturePng = true;
    capture.captureRate = 100;

    capture.addEventListener(StreamCapture.frameEvent, (evt) => {
      const { detail } = evt as CustomEvent<{imgData: HTMLImageElement}>;
      const { imgData } = detail;

      assert.equal(imgData.naturalWidth, width * capture.captureScale);
      assert.equal(imgData.naturalHeight, height * capture.captureScale);

      done();
    });
  });

  it('flips the capture if necessary', (done) => {
    capture.flipped = true;
    capture.start(stream);

    capture.addEventListener(StreamCapture.startEvent, async () => {
      const imgData = await capture.captureFrame();
      assert.equal(imgData.width, width * capture.captureScale);
      assert.equal(imgData.height, height * capture.captureScale);

      if (isImageData(imgData)) {
        // Right hand side is green, so confirm the G and R components.
        assert.isBelow(imgData.data[0], 5);
        assert.isAbove(imgData.data[1], 250);
      } else {
        assert.fail('Expected image data');
      }

      done();
    });
  });

  it('throws if started twice', () => {
    capture.start(stream);
    assert.throws(() => {
      capture.start(stream);
    });
  });

  it('stops when disconnected', (done) => {
    capture.start(stream);
    document.body.appendChild(capture);

    setTimeout(() => {
      capture.addEventListener(StreamCapture.stopEvent, () => {
        done();
      });
      capture.remove();
    }, 100);
  });

  it('shows and hides overlays', () => {
    const message = 'Hello, World';
    capture.start(stream);
    document.body.appendChild(capture);

    capture.showOverlay(message);

    assert.exists(capture.shadowRoot!.querySelector('.overlay'));
    assert.equal(capture.shadowRoot!.querySelector('.overlay').textContent,
        message);

    capture.hideOverlay();
    assert.notExists(capture.shadowRoot!.querySelector('.overlay'));
  });

  it('handles hiding non-existent overlays', () => {
    assert.doesNotThrow(() => capture.hideOverlay());
  });
});
