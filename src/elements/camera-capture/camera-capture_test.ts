/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const { assert } = chai;

import { isImageData } from '../../utils/is-image-data.js';
import { CameraCapture } from './camera-capture.js';
customElements.define(CameraCapture.defaultTagName, CameraCapture);

function mockCameraStream() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 400;
  canvas.height = 400;

  // Draw a pink left half, and a green right half.
  const render = () => {
    ctx.fillStyle = `#F0F`;
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = `#0F0`;
    ctx.fillRect(200, 0, 200, 200);
  };

  return {
    render,
    stream: canvas.captureStream()
  };
}

describe('CaptureCamera', function() {
  let capture: CameraCapture;
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
    capture = new CameraCapture();
    const mock = mockCameraStream();
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

    capture.addEventListener(CameraCapture.startEvent, async () => {
      const imgData = await capture.captureFrame();
      assert.equal(imgData.width, 400 * capture.captureScale);
      assert.equal(imgData.height, 400 * capture.captureScale);

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

    capture.addEventListener(CameraCapture.startEvent, async () => {
      const imgData = await capture.captureFrame();
      assert.equal(imgData.width, 400 * capture.captureScale);
      assert.equal(imgData.height, 400 * capture.captureScale);

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

    capture.addEventListener(CameraCapture.frameEvent, (evt) => {
      const { detail } = evt as CustomEvent<{imgData: ImageData}>;
      const { imgData } = detail;

      assert.equal(imgData.width, 400 * capture.captureScale);
      assert.equal(imgData.height, 400 * capture.captureScale);
      assert.isAbove(imgData.data[0], 250);

      done();
    });
  });

  it('emits image element frame events', (done) => {
    capture.start(stream);
    capture.capturePng = true;
    capture.captureRate = 100;

    capture.addEventListener(CameraCapture.frameEvent, (evt) => {
      const { detail } = evt as CustomEvent<{imgData: HTMLImageElement}>;
      const { imgData } = detail;

      assert.equal(imgData.naturalWidth, 400 * capture.captureScale);
      assert.equal(imgData.naturalHeight, 400 * capture.captureScale);

      done();
    });
  });

  it('flips the capture if necessary', (done) => {
    capture.flipped = true;
    capture.start(stream);

    capture.addEventListener(CameraCapture.startEvent, async () => {
      const imgData = await capture.captureFrame();
      assert.equal(imgData.width, 400 * capture.captureScale);
      assert.equal(imgData.height, 400 * capture.captureScale);

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
      capture.addEventListener(CameraCapture.stopEvent, () => {
        done();
      });
      capture.remove();
    }, 100);
  });
});
