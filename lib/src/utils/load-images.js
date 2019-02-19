/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
export async function loadImages(paths) {
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
//# sourceMappingURL=load-images.js.map