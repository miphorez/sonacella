# Sonacella landing page

The site is published with GitHub Pages from the `pages` branch.

## Page structure

- Keep the permanent `.hero` introduction separate from feature-specific content.
  It contains the product headline, store and Instagram links, and the promotional video.
  Permanent refers to its content role; it does not stick to the viewport on scroll.
- Add, reorder or update independent feature sections below the hero. Keep section IDs
  aligned with the header navigation. Radio uses `.feature-section`; MP3 and chapters
  use the existing `.feature` cards and screenshot galleries.
- Add new releases above older entries in the Releases section. Keep screenshots
  in `assets/releases/<version>/` so the main feature galleries can stay stable.
- The video initially displays the local `assets/promo-poster.jpg` cover. `video.js`
  creates the YouTube player only after the visitor activates the cover. There is no
  player, video playback or YouTube request on page load. Without JavaScript, the
  cover opens the video on YouTube. Replacing the promotional video requires updating
  both the `data-video` ID and fallback link in `index.html`.

Preview locally with `python -m http.server 8765 --bind 127.0.0.1`.
