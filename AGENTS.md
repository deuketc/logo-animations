# AGENTS.md

A guide for AI coding assistants working in this repo. For a human-facing
overview, see [README.md](README.md).

## What this repo is

**Micro Animations**: a personal collection of small animated logos, icons and
buttons. It's a static site on GitHub Pages:

- Live: https://deuketc.github.io/logo-animations/
- CodePen (the code is shared there too): https://codepen.io/charlesduquette

## Hard rules

- **No frameworks, bundlers or build step.** Plain HTML, CSS and JS only. Load
  libraries from a CDN, or vendor them into `script/lib/`. Don't add
  `package.json` dependencies for the site itself.
- **Use relative links between pages** (`logos/js/index.html`, `../../css/style.css`)
  so the site works locally and under the `/logo-animations/` path on Pages.
  The only absolute URLs are in the social share tags (see below).
- **Don't put page-specific styles in `css/style.css`.** Every animation page
  shares it. Put page-specific CSS in that page's `<style>` block. Landing page
  styles go in `css/home.css`.
- **Keep the design clean and minimal** so the animations stand out.
- **Don't commit or push unless asked.**

## Layout

```
index.html              Landing page: intro + grid of all animations
css/home.css            Landing page styles
css/style.css           Shared styles for animation pages (.wrapper centres content)
logos/<name>/           One folder per animation (folder name = caption + alt text)
  index.html            The animation page, including its share tags
  ani-<name>.js         GSAP animation (SVG pages only)
  <name>.riv            Rive export (Rive pages only)
  thumb.png             800x800 square, used in the landing page grid
  social.png            1200x630, used as the share preview image
script/lib/             Vendored GSAP plugins (DrawSVG, MotionPath, MorphSVG, MotionPathHelper)
svg/, ai/               Source artwork (SVG, Illustrator)
tools/capture.js        Generates thumb.png / social.png from a page
```

## The two kinds of animation

### SVG + GSAP (iag, js, react, redux)

- The logo is inline `<svg id="ani-svg">` inside `<div class="wrapper">`.
- GSAP 3.9.1 loads from cdnjs. Plugins load from `../../script/lib/`.
- The animation lives in `ani-<name>.js`: usually a `gsap.timeline({ paused: true })`
  played on `mouseenter` (and sometimes reversed on `mouseleave`).
- **IAG is the exception:** it plays its intro on load (`iagtl.play()`), so its
  first frame is mostly blank. Captures need `--eval "iagtl.progress(1).pause()"`.
- Template to copy: `logos/js/`.

### Rive (submit-button, beaker)

- `<canvas id="rive-canvas">`, plus a `.placeholder` element that shows until
  the `.riv` loads, or if it fails to load. The canvas gets the `is-loaded`
  class in `onLoad`, and CSS then hides the placeholder.
- The runtime is `@rive-app/canvas`, pinned to a version on unpkg. All setup
  code is **inline in `index.html`**, not in a separate JS file. Set
  `RIVE_FILE` and `STATE_MACHINE` at the top of the script.
- **Always keep `autoBind: true`.** The Rive files use data binding (view
  models) instead of state machine inputs. Without `autoBind`, the animation
  plays but hover and click do nothing. Example: `button_submit.riv` has a view
  model with `isHovered` (boolean) and `isClicked` (trigger), and no inputs.
- Call `resizeDrawingSurfaceToCanvas()` in `onLoad` and on window `resize`.
- Pages have a dark background set in their own `<style>`: `#282828`
  (submit-button) or `#313131` (beaker).
- **`.riv` files need http.** They won't load from `file://`. Use `npx serve`
  or `tools/capture.js`, which runs its own server.
- **Rive watermark:** the current exports play a Rive "R" watermark intro (the
  extra "Watermark" / "NuRive…" artboards). Any screenshot taken too early shows
  a black square with the Rive logo. Wait several seconds of *real* time.
- Template to copy: `logos/beaker/`.

#### Debugging a Rive file that "doesn't work"

Load the file and inspect `r.contents` (artboards, animations, state machines,
inputs) and `r.viewModelCount` / `r.defaultViewModel().properties`. Then fire
synthetic `pointermove` / `pointerdown` / `pointerup` events on the canvas and
log `onStateChange`. This is how the missing `autoBind` problem was found. Most
likely causes, in order:

1. `autoBind` is missing.
2. The `STATE_MACHINE` name is wrong.
3. The page was opened from `file://`.
4. `RIVE_FILE` doesn't match the file name.

## Adding a new animation (checklist)

1. Create `logos/<name>/`. Use a short, lowercase, hyphenated name; it becomes
   the caption and alt text.
2. Copy the matching template's `index.html` (`logos/beaker/` for Rive,
   `logos/js/` for GSAP) and change the `<title>`, the content and the script.
   - Rive: set `RIVE_FILE` and `STATE_MACHINE`, and update the placeholder.
   - GSAP: add `ani-<name>.js` and include only the plugins you use.
3. Update the **share tags** in `<head>` (see below).
4. Generate the images:
   `node tools/capture.js <name>` writes `thumb.png` and `social.png`. **Open
   the images and check them**: they should show the finished logo, not a blank
   intro frame, a Rive watermark or the placeholder.
5. Add a grid item to the root `index.html`. Order is the owner's choice; new
   items have been added near the top or the end.
   ```html
   <li>
     <a class="card" href="logos/<name>/index.html">
       <img src="logos/<name>/thumb.png" alt="<name>" loading="lazy" />
       <span class="caption"><name></span>
     </a>
   </li>
   ```
6. Add a row to the animations table in `README.md`.

## Social share tags

Each animation page's `<head>` has this block, right after `<title>`. Copy it
from an existing page and change the name, description and folder:

```html
<title>Beaker | Micro Animations</title>
<meta name="description" content="An interactive animated beaker, built in Rive." />
<link rel="canonical" href="https://deuketc.github.io/logo-animations/logos/beaker/" />

<!-- Open Graph (Facebook, LinkedIn and most other sites) -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Micro Animations" />
<meta property="og:title" content="Beaker | Micro Animations" />
<meta property="og:description" content="An interactive animated beaker, built in Rive." />
<meta property="og:url" content="https://deuketc.github.io/logo-animations/logos/beaker/" />
<meta property="og:image" content="https://deuketc.github.io/logo-animations/logos/beaker/social.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Beaker animation preview" />

<!-- X / Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Beaker | Micro Animations" />
<meta name="twitter:description" content="An interactive animated beaker, built in Rive." />
<meta name="twitter:image" content="https://deuketc.github.io/logo-animations/logos/beaker/social.png" />
<meta name="twitter:image:alt" content="Beaker animation preview" />
```

Rules:

- Image and page URLs **must be absolute** (`https://deuketc.github.io/logo-animations/...`).
  Social sites can't resolve relative paths.
- The share image is **`social.png` (1200x630)**, not `thumb.png`.
- Title format: `<Name> | Micro Animations`. Description: one short sentence
  saying what it is and what it's built with.
- Previews only work after a push, once Pages has published. To check one:
  Facebook [Sharing Debugger](https://developers.facebook.com/tools/debug/)
  ("Scrape Again" to refresh its cache), LinkedIn
  [Post Inspector](https://www.linkedin.com/post-inspector/), and for X, paste
  the link into the post composer.

## Image capture tool

```sh
node tools/capture.js <folder> [thumb|social|both] [--wait ms] [--eval js] [--out dir]
```

- Needs Node 22+ and Chrome or Edge (or set `CHROME_PATH`).
- Serves the repo locally, opens the page in headless Chrome over the DevTools
  protocol, shrinks the logo to suit the frame, waits in real time (default
  8000 ms), then screenshots.
- Use `--out <dir>` to preview the images somewhere else before overwriting
  the real ones.
- Known invocations:
  - `node tools/capture.js iag both --eval "iagtl.progress(1).pause()" --wait 3000`
  - `node tools/capture.js beaker` and `node tools/capture.js submit-button`
    (keep the default wait, for the Rive watermark)
  - `js`, `react`, `redux`: the defaults work. Their resting state is the full logo.
- The output line says `RIVE NOT LOADED (placeholder shown)` if the `.riv`
  failed to load. Don't use that image.
- Don't use `chrome --screenshot` with `--virtual-time-budget` for these
  pages. Virtual time doesn't advance the animations, so you get the first
  frame: blank for IAG, the watermark for Rive.

## Verifying changes

There are no tests. To verify:

- Serve the repo (`npx serve`) and load the changed pages. Rive pages must
  reach the `is-loaded` state.
- For Rive interactions, check hover and click actually change state.
- Look at any regenerated PNGs before keeping them.
- Check new or edited share tags use absolute URLs and point at `social.png`.
