# Sonacella landing page

The site is published with GitHub Pages from the `pages` branch.

The Sonacella Station Cards Edge extension has a separate policy at
`station-cards/privacy.html`, linked from the footer. Its ready-to-host source
comes from the extension's reviewed store kit; keep it separate from the
Android app policy at `privacy.html`.

## Page structure

- Keep the permanent `.hero` introduction separate from feature-specific content.
  It contains the product headline, store and social-profile links, and the promotional video.
  Instagram, Pinterest, Telegram news and the community chat share the wrapping
  `.social-links` row. Pinterest and both Telegram destinations are also linked in
  the footer; keep their URLs consistent in both places. The official Telegram
  channel is `https://t.me/sonacella`; the chat for station cards, questions and
  discoveries is `https://t.me/SonacellaChat`.
  Permanent refers to its content role; it does not stick to the viewport on scroll.
- Add, reorder or update independent feature sections below the hero. Keep section IDs
  aligned with the header navigation. Radio uses `.feature-section`; MP3 and chapters
  use the existing `.feature` cards and screenshot galleries.
- Add new releases above older entries in the Releases section. Keep screenshots
  in `assets/releases/<version>/` so the main feature galleries can stay stable.
- The independent `#station-collection` section after Radio presents the approved
  30-second "Pick a card. Find your sound." promo (`OEMSV_mZwo4`), links to the
  Instagram station cards and explains QR image import. Its local portrait poster
  is extracted at 24.5 seconds from the approved final video. It shares the existing
  click-to-play player and YouTube fallback; it is separate from release news and
  the browser extension installation instructions.
- `releases.js` shows one release at a time, newest first, with Newer/Older buttons,
  a live position/version label and horizontal touch swipes. Navigation stops at
  either end; there is no automatic advance. Keep each release ID stable for direct
  links. Opening a release hash selects that card; `#releases` selects the newest.
  Switching cards stops an embedded release video and restores its cover. The
  current Google Play download link stays outside the carousel. Without JavaScript,
  all release entries remain readable and navigation controls stay hidden.
- Sonacella 1.0.9 includes the station QR import promo (`j-g4IMO2Xp0`) with
  a local poster extracted from the approved final video. It uses the same
  click-to-play behavior and YouTube fallback link as the other release videos.
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
