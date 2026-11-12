# Sonacella landing page

The site is published with GitHub Pages from the `pages` branch.

The Sonacella Station Cards Edge extension has a separate policy at
`station-cards/privacy.html`, linked from the footer. Its ready-to-host source
comes from the extension's reviewed store kit; keep it separate from the
Android app policy at `privacy.html`.

## Page structure

- Keep the permanent `.hero` introduction separate from feature-specific content.
  It contains the product headline, store and Instagram links, and the promotional video.
  Permanent refers to its content role; it does not stick to the viewport on scroll.
- Add, reorder or update independent feature sections below the hero. Keep section IDs
  aligned with the header navigation. Radio uses `.feature-section`; MP3 and chapters
  use the existing `.feature` cards and screenshot galleries.
- Add new releases above older entries in the Releases section. Keep screenshots
  in `assets/releases/<version>/` so the main feature galleries can stay stable.
- Sonacella 1.0.9 reserves a portrait video area with a coming-soon message.
  When its promo is ready, replace the placeholder with the same local-poster,
  click-to-play markup used by the other release videos.
- The Station Cards section links to the public browser-extension user ZIP,
  installation/update instructions and SHA-256 in this repository's GitHub
  Releases. Keep its preview/manual-install status distinct from Android app
  availability and Edge Add-ons. Extension news belongs above older release
  entries and must identify the browser extension explicitly.
- The video initially displays the local `assets/promo-poster.jpg` cover. `video.js`
  creates the YouTube player only after the visitor activates the cover. There is no
  player, video playback or YouTube request on page load. Without JavaScript, the
  cover opens the video on YouTube. Replacing the promotional video requires updating
  the `data-video` ID and the YouTube links in `index.html`. The release demo
  uses the same click-to-play behavior with a local portrait cover and a Shorts
  fallback link.

Preview locally with `python -m http.server 8765 --bind 127.0.0.1`.
