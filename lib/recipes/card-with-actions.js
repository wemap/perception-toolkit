/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { ActionButton } from '../src/elements/action-button/action-button.js';
import { Card } from '../src/elements/card/card.js';
customElements.define(Card.defaultTagName, Card);
customElements.define(ActionButton.defaultTagName, ActionButton);
const card = new Card();
card.src = 'Card with Actions';
const button = new ActionButton();
button.label = 'Dismiss';
button.addEventListener('click', () => {
    card.close();
});
const uselessButton = new ActionButton();
uselessButton.label = 'I do nothing';
card.appendChild(button);
card.appendChild(uselessButton);
const container = document.querySelector('#container');
container.appendChild(card);
//# sourceMappingURL=card-with-actions.js.map