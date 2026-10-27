# HappyNest — A Little World for Rutuprajna

A five-page static friendship surprise built with plain HTML, CSS, and JavaScript. It has a welcome page, the Bekhudi player, two chocolate surprises, a personal best-friend letter, and a respectful Shree Jagannath prayer. There is no build step or package installation.

## Pages

- `index.html` — welcome and introduction.
- `music.html` — Bekhudi from *Teraa Surroor* (2016), with the custom accessible player.
- `surprises.html` — independent Dairy Milk Silk and KitKat message reveals.
- `letter.html` — the best-friend letter with an accessible envelope disclosure.
- `jagannath.html` — devotional artwork and an original prayer ending in “Jai Jagannath.”

Every page has the same responsive navigation and loads directly by filename. Page links and media use project-relative paths.

## Artwork map

| Page or use | Local image |
| --- | --- |
| Welcome hero | `assets/images/A Little World Made for You.png` |
| Welcome reminder background | `assets/images/Dreamy Blossom Lakeside Terrace.png` (lazy-loaded, softened image layer with a cream overlay) |
| Bekhudi page | `assets/images/Good Music, Better Days at Sunset.png` |
| Dairy Milk Silk gift | `assets/images/Cadbury Silk Sweetness Gift Arrangement.png` |
| KitKat gift | `assets/images/A Cosy KitKat Friendship Gift Arrangement.png` |
| Letter page | `assets/images/Dreamy Friendship Letter by Sunset.png` |
| Section separators | `assets/images/Romantic Watercolour Floral Heart Divider.png` (transparent, decorative, shown at a restrained size) |
| Shree Jagannath page | `assets/images/Jagannath Temple Devotional Watercolour Scene.png` |

`assets/images/Pastel Romantic Sticker Icon Collection.png` is a composite reference sheet, so it is not shown as an icon or navigation element. Its small blossom and musical-note motifs inform restrained CSS accents. The lakeside terrace remains a lazy-loaded supporting image in the welcome reminder section; it is not used on the devotional page.

The music source is `assets/audio/Bekhudi Teraa Surroor 320 Kbps.mp3` (14,013,628 bytes, about 13.4 MiB). The original MP3 in the project root is preserved.

## Run locally

From this folder, start Python's static server:

```sh
python -m http.server 8000
```

Open <http://localhost:8000/> and use the shared navigation to visit each page. You can also open `music.html`, `surprises.html`, `letter.html`, or `jagannath.html` directly on the local server.

## Checks

From the project folder, run the JavaScript syntax check:

```sh
node --check script.js
```

You can also use a local HTML validator or browser developer tools to check page structure, console errors, responsive layouts, and keyboard interaction. Test the audio on a browser that supports MP3 playback. The site has no package-based test runner.

## Before deployment

The website has not been published. Check the chosen host's file and bandwidth limits for the 13.4 MiB MP3, and confirm the rights needed to distribute it. The pages use local images and audio, system font stacks, and no frameworks or package dependencies.

## GitHub Pages (when ready)

After pushing the project to GitHub, open the repository's **Settings → Pages**, choose **Deploy from a branch**, select `main` and the repository root (`/`), then save. GitHub Pages will publish the static files; wait for its deployment status before sharing the site. This project has not been deployed as part of this release preparation.
