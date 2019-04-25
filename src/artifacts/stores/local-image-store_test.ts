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

const { assert } = chai;

import { LocalImageStore } from './local-image-store.js';
import { ARArtifact, ARImageTarget } from '../schema/extension-ar-artifacts.js';

describe('LocalImageStore', () => {
  let localImageStore : LocalImageStore;

  const simpleImageTarget = {
    '@type': 'ARImageTarget',
    'name': 'Id1',
    'image': 'Fake URL'
  };
  const simpleArtifact = {
    arTarget: simpleImageTarget,
    arContent: 'Fake URL'
  };
  const imageObjectTarget: ARImageTarget = {
    '@type': 'ARImageTarget',
    'name': 'Id2',
    'image': {
      '@type': 'ImageObject',
      'contentUrl': 'Fake URL'
    }
  };
  const imageEncodingTarget: ARImageTarget = {
    '@type': 'ARImageTarget',
    'name': 'Id3',
    'encoding': {
      '@type': 'ImageObject',
      'contentUrl': 'Fake URL'
    }
  };
  const imageAssociatedMediaTarget: ARImageTarget = {
    '@type': 'ARImageTarget',
    'name': 'Id4',
    'associatedMedia': {
      '@type': 'ImageObject',
      'contentUrl': 'Fake URL'
    }
  };
  const complexImageTarget: ARImageTarget = {
    '@type': 'ARImageTarget',
    'name': 'Id5',
    'image': 'Fake URL',
    'encoding': [
      {
        '@type': 'ImageObject',
        'contentUrl': 'Fake URL'
      }, {
        '@type': 'MediaObject',
        'contentUrl': 'Fake URL',
        'encodingFormat': 'application/binary'
      }
    ],
    'associatedMedia': [
      {
        '@type': 'ImageObject',
        'contentUrl': 'Fake URL'
      }, {
        '@type': 'MediaObject',
        'contentUrl': 'Fake URL',
        'encodingFormat': 'application/binary'
      }
    ]
  };

  beforeEach(() => {
    localImageStore = new LocalImageStore();
  });

  it('accepts simple image target', () => {
    assert.doesNotThrow(() => {
      const addedImage = localImageStore.addImage(simpleArtifact, simpleImageTarget);
      assert.isTrue(addedImage);
    });
  });

  it('accepts image as ImageObject', () => {
    const artifact: ARArtifact = {
      arTarget: imageObjectTarget,
      arContent: 'Fake URL'
    };
    assert.doesNotThrow(() => {
      const addedImage = localImageStore.addImage(artifact, imageObjectTarget);
      assert.isTrue(addedImage);
    });
  });

  it('accepts single encoding', () => {
    const artifact: ARArtifact = {
      arTarget: imageEncodingTarget,
      arContent: 'Fake URL'
    };
    assert.doesNotThrow(() => {
      const addedImage = localImageStore.addImage(artifact, imageEncodingTarget);
      assert.isTrue(addedImage);
    });
  });

  it('accepts single associatedMedia', () => {
    const artifact: ARArtifact = {
      arTarget: imageAssociatedMediaTarget,
      arContent: 'Fake URL'
    };
    assert.doesNotThrow(() => {
      const addedImage = localImageStore.addImage(artifact, imageAssociatedMediaTarget);
      assert.isTrue(addedImage);
    });
  });

  it('accepts encoding and associatedMedia', () => {
    const artifact: ARArtifact = {
      arTarget: complexImageTarget,
      arContent: 'Fake URL'
    };
    assert.doesNotThrow(() => {
      const addedImage = localImageStore.addImage(artifact, complexImageTarget);
      assert.isTrue(addedImage);
    });
  });

  it('ignores malformed inputs', () => {
    assert.doesNotThrow(() => {
      const addedImage = localImageStore.addImage({}, {});
      assert.isFalse(addedImage);
    });
  });

  it('accepts multiple image targets', () => {
    assert.doesNotThrow(() => {
      assert.isTrue(localImageStore.addImage({}, simpleImageTarget));
      assert.isTrue(localImageStore.addImage({}, imageObjectTarget));
      assert.isTrue(localImageStore.addImage({}, imageEncodingTarget));
      assert.isTrue(localImageStore.addImage({}, imageAssociatedMediaTarget));
    });
  });

  describe('getDetectableImages', () => {
    it('returns all detectable images', () => {
      assert.isTrue(localImageStore.addImage({}, simpleImageTarget));
      assert.isTrue(localImageStore.addImage({}, imageObjectTarget));
      assert.isTrue(localImageStore.addImage({}, imageEncodingTarget));
      assert.isTrue(localImageStore.addImage({}, imageAssociatedMediaTarget));

      const detectableImages = localImageStore.getDetectableImages();
      assert.isArray(detectableImages);
      assert.lengthOf(detectableImages, 4);

      for (const { media } of detectableImages) {
        assert.isArray(media);
        assert.lengthOf(media, 1);
      }

      const idsOfImages = detectableImages.map((detectableImage) => detectableImage.id).sort();
      assert.deepEqual(idsOfImages, [
        simpleImageTarget.name,
        imageObjectTarget.name,
        imageEncodingTarget.name,
        imageAssociatedMediaTarget.name
      ]);
    });

    it('returns multiple media when available', () => {
      localImageStore.addImage({}, complexImageTarget);

      const detectableImages = localImageStore.getDetectableImages();
      assert.isArray(detectableImages);
      assert.lengthOf(detectableImages, 1);

      assert.isArray(detectableImages[0].media);
      assert.lengthOf(detectableImages[0].media, 5);
    });
  });

  describe('FindRelevantArtifacts', () => {
    beforeEach(() => {
      localImageStore.addImage(simpleArtifact, simpleImageTarget);
      localImageStore.addImage({}, { '@type': 'ARImageTarget', 'name': 'Id2', 'image': 'Fake URL' });
      localImageStore.addImage({}, { '@type': 'ARImageTarget', 'name': 'Id3', 'image': 'Fake URL' });
      localImageStore.addImage({}, { '@type': 'ARImageTarget', 'name': 'Id4', 'image': 'Fake URL' });
      localImageStore.addImage({}, { '@type': 'ARImageTarget', 'name': 'Id5', 'image': 'Fake URL' });
    });

    it('finds single image by value', () => {
      const results = localImageStore.findRelevantArtifacts([{ id: simpleImageTarget.name }]);
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].target, simpleImageTarget);
    });

    it('finds multiple images together', () => {
      const results = localImageStore.findRelevantArtifacts([
        { id: 'Id2' },
        { id: 'Id3' },
        { id: 'Id4' },
        { id: 'Id5' },
      ]);
      assert.lengthOf(results, 4);
    });

    it('doesnt find non-existant images', () => {
      const results = localImageStore.findRelevantArtifacts([
        { id: 'Id2' }, { id: 'Id3' }, // Should find
        { id: 'Id6' }, { id: 'Id7' }, // Should not find
      ]);
      assert.lengthOf(results, 2);
    });

    it('returns original artifact', () => {
      const results = localImageStore.findRelevantArtifacts([{ id: simpleImageTarget.name }]);
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].target, simpleImageTarget);
      assert.deepEqual(results[0].artifact, simpleArtifact);
    });

  });
});
