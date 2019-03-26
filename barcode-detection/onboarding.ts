/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { OnboardingCard } from '../src/elements/onboarding-card/onboarding-card.js';
import { fire } from '../src/utils/fire.js';
import { loadImages } from '../src/utils/load-images.js';

export async function startOnboardingProcess(images: string[]) {
  const { config } = window.PerceptionToolkit || { config: { root: '' } };
  const { root = '' } = config;
  const onboarding = new OnboardingCard({polyfillPrefix: root});
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
  const card = document.activeElement as OnboardingCard;
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
  const target = e.target as OnboardingCard;
  const tagName = OnboardingCard.defaultTagName.toUpperCase();
  if (!target || target.tagName !== tagName) {
    return;
  }

  target.remove();
  document.body.focus();
});

// Register the card element, and start the process.
customElements.define(OnboardingCard.defaultTagName, OnboardingCard);
