# Micro Animations

A collection of small animated logos, icons and buttons, made in my spare time.

**Live site:** https://deuketc.github.io/logo-animations/
**Code on CodePen:** https://codepen.io/charlesdeukett

Each animation lives on its own page, and the landing page shows them all as a
grid of thumbnails. It's a plain static site: no frameworks and no build step,
just HTML, CSS and a little JavaScript, hosted on GitHub Pages.

## The animations

| Animation     | Built with | Interaction                      |
| ------------- | ---------- | -------------------------------- |
| Submit button | Rive       | Hover and click                  |
| Beaker        | Rive       | Interactive (Rive state machine) |
| IAG           | SVG + GSAP | Plays on load, replays on hover  |
| JavaScript    | SVG + GSAP | Hover                            |
| React         | SVG + GSAP | Follows the mouse                |
| Redux         | SVG + GSAP | Hover                            |

## How it's built

- **SVG + GSAP:** the logo is drawn as inline SVG in the page's `index.html`
  and animated with [GSAP](https://gsap.com/), which loads from a CDN. The
  GSAP plugins it uses (DrawSVG, MotionPath) are in `script/lib/`.
- **Rive:** the animation is designed in [Rive](https://rive.app/) and exported
  as a `.riv` file. The page plays it with Rive's web runtime
  (`@rive-app/canvas`, loaded from a CDN). The setup code is inline in the
  page's `index.html`. `autoBind: true` is turned on, so interactions that use
  Rive's data binding (view models) work.

## Folder structure

```
.
├── index.html            Landing page (grid of all animations)
├── css/
│   ├── home.css          Landing page styles
│   └── style.css         Shared styles for the animation pages
├── logos/
│   └── <name>/           One folder per animation
│       ├── index.html    The animation page
│       ├── ani-<name>.js GSAP animation (SVG animations only)
│       ├── <name>.riv    Rive file (Rive animations only)
│       ├── thumb.png     Square thumbnail for the landing page grid
│       └── social.png    1200×630 preview image for social sharing
├── tools/capture.js      Generates thumb.png and social.png from a page
├── AGENTS.md             Guide for AI coding assistants (CLAUDE.md points to it)
├── script/lib/           GSAP plugins
├── svg/                  Source SVG artwork
└── ai/                   Source Illustrator files
```

## Running it locally

Use a local web server rather than opening the files directly. Rive pages
won't load their `.riv` files from disk. Also, the landing page links to
folders (`logos/js/`), and only a server opens a folder's `index.html`
automatically. From the repo folder, run:

```sh
npx serve
```

Then open the address it prints (usually http://localhost:3000).

## Adding a new animation

1. **Create a folder** in `logos/`, for example `logos/my-button/`. The folder
   name is used as the caption and alt text on the landing page.
2. **Add `index.html`.** The easiest start is to copy an existing page of the
   same type: `logos/beaker/` for Rive, `logos/js/` for SVG + GSAP. For Rive,
   set `RIVE_FILE` and `STATE_MACHINE` at the top of the script.
3. **Add the images:**
   - `thumb.png`: square, 800×800, for the landing page grid.
   - `social.png`: 1200×630, the preview image shown when the page is shared.

   The capture tool makes both from the page itself (needs Node 22+ and Chrome
   or Edge):

   ```sh
   node tools/capture.js my-button
   ```

   Check the images afterwards. If an animation plays an intro on load, jump to
   its last frame with `--eval`, e.g.
   `node tools/capture.js iag --eval "iagtl.progress(1).pause()"`.

4. **Update the share tags** in the page's `<head>`: the title, description,
   page URL and image URL. These must be full addresses starting with
   `https://deuketc.github.io/logo-animations/`.
5. **Add a grid item** to the root `index.html`:

   ```html
   <li>
     <a class="card" href="logos/my-button/">
       <img src="logos/my-button/thumb.png" alt="my-button" loading="lazy" />
       <span class="caption">my-button</span>
     </a>
   </li>
   ```

## Sharing on social media

Every animation page has Open Graph and X (Twitter) tags, so a shared link shows
a title, a description and the folder's `social.png` as the preview image. The
previews only work for pages that have been pushed and published.

To check or refresh a preview:

- **Facebook:** [Sharing Debugger](https://developers.facebook.com/tools/debug/).
  Use "Scrape Again" after changing an image, because Facebook caches previews.
- **LinkedIn:** [Post Inspector](https://www.linkedin.com/post-inspector/)
- **X:** paste the link into a new post and look at the preview before posting.

## License

Code is released under the [MIT License](LICENSE). The logos of third-party
brands (IAG, JavaScript, React, Redux) belong to their owners and are used here
only for personal, non-commercial animation practice.
