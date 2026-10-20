import { media } from './media.js';
import { friends, friendNames } from './illustrations.js';

// Both the matching game and character gallery use the same original image.
export function characterArt(name) {
  const path = media.characters[name];
  return path
    ? `<img class="character-photo" src="${encodeURI(import.meta.env.BASE_URL + path)}" alt="${friendNames[name]}" decoding="async" draggable="false">`
    : friends[name];
}
