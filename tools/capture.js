#!/usr/bin/env node
/*
 * Capture thumb.png and/or social.png for an animation folder.
 *
 * Usage:
 *   node tools/capture.js <folder> [thumb|social|both] [options]
 *
 * Examples:
 *   node tools/capture.js beaker
 *   node tools/capture.js iag both --eval "iagtl.progress(1).pause()"
 *   node tools/capture.js submit-button social --wait 10000
 *
 * Options:
 *   --wait <ms>   Real time to wait after load before capturing (default 8000).
 *                 Rive files can play a watermark intro first, so keep this
 *                 generous for Rive pages.
 *   --eval <js>   JavaScript to run in the page just before capturing, e.g. to
 *                 jump a GSAP timeline to its final frame.
 *   --out <dir>   Where to write the PNGs (default: the animation's folder).
 *
 * Outputs:
 *   thumb.png   800x800  (square, for the landing page grid)
 *   social.png  1200x630 (for Open Graph / X share previews)
 *
 * How it works: serves the repo on a local port (Rive needs http, not file://),
 * opens the page in headless Chrome over the DevTools protocol, resizes the
 * logo to suit the frame, waits in real time, then screenshots.
 *
 * Needs Node 22+ (built-in WebSocket) and Google Chrome or Microsoft Edge.
 * Set CHROME_PATH to use a different browser binary.
 */

const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const SIZES = {
  // css width/height, device scale factor, logo size in css px
  thumb: { w: 500, h: 500, dpr: 1.6, svgH: 440, riveW: 460 },
  social: { w: 1200, h: 630, dpr: 1, svgH: 520, riveW: 560 },
};

// ---------- args ----------
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const waitMs = Number(opt("wait", "8000"));
const evalJs = opt("eval", "");
const outOpt = opt("out", "");
const [folder, kind = "both"] = args;

if (!folder || !["thumb", "social", "both"].includes(kind)) {
  console.error(
    "Usage: node tools/capture.js <folder> [thumb|social|both] [--wait ms] [--eval js] [--out dir]"
  );
  process.exit(1);
}
const pageDir = path.join(ROOT, "logos", folder);
if (!fs.existsSync(path.join(pageDir, "index.html"))) {
  console.error(`No logos/${folder}/index.html found.`);
  process.exit(1);
}
const outDir = outOpt ? path.resolve(outOpt) : pageDir;

// ---------- browser ----------
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    console.error("Couldn't find Chrome or Edge. Set CHROME_PATH.");
    process.exit(1);
  }
  return found;
}

// ---------- tiny static server ----------
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".riv": "application/octet-stream",
};
function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("not found");
      }
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      });
      res.end(data);
    });
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server))
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (u) =>
  new Promise((res, rej) =>
    http
      .get(u, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res(JSON.parse(d)));
      })
      .on("error", rej)
  );

async function capture(server, size, outFile) {
  const port = 9300 + Math.floor(Math.random() * 600);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "capture-"));
  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--hide-scrollbars",
      `--window-size=${size.w},${size.h}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    let targets;
    for (let i = 0; i < 75 && !targets; i++) {
      try {
        targets = await getJSON(`http://127.0.0.1:${port}/json`);
      } catch {
        await sleep(200);
      }
    }
    if (!targets) throw new Error("Chrome didn't start");

    const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
    let id = 0;
    const pending = {};
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending[msg.id]) pending[msg.id](msg);
    };
    await new Promise((r) => (ws.onopen = r));
    const send = (method, params = {}) =>
      new Promise((res, rej) => {
        const i = ++id;
        pending[i] = (msg) => (msg.error ? rej(new Error(msg.error.message)) : res(msg.result));
        ws.send(JSON.stringify({ id: i, method, params }));
      });

    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: size.w,
      height: size.h,
      deviceScaleFactor: size.dpr,
      mobile: false,
    });

    // Resize the logo for the frame before the page's own scripts run, so
    // Rive sizes its drawing surface correctly from the start.
    const css =
      "html,body{overflow:hidden}" +
      `#ani-svg{width:auto!important;height:${size.svgH}px!important;max-width:none!important}` +
      `#rive-canvas{width:${size.riveW}px!important}`;
    await send("Page.addScriptToEvaluateOnNewDocument", {
      source: `document.addEventListener("DOMContentLoaded",()=>{const s=document.createElement("style");s.textContent=${JSON.stringify(css)};document.head.appendChild(s);});`,
    });

    await send("Page.navigate", {
      url: `http://127.0.0.1:${server.address().port}/logos/${folder}/index.html`,
    });
    await sleep(waitMs);

    if (evalJs) {
      const r = await send("Runtime.evaluate", { expression: evalJs });
      if (r.exceptionDetails) console.warn("  --eval threw:", r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      await sleep(400);
    }

    const state = await send("Runtime.evaluate", {
      expression: "(() => { const c = document.getElementById('rive-canvas'); return c ? (c.classList.contains('is-loaded') ? 'rive loaded' : 'RIVE NOT LOADED') : 'svg page'; })()",
      returnByValue: true,
    });

    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(outFile, Buffer.from(shot.data, "base64"));
    console.log(`  saved ${path.relative(process.cwd(), outFile)}  (${state.result.value})`);
    ws.close();
  } finally {
    chrome.kill();
    await sleep(500);
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {}
  }
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const server = await startServer();
  try {
    const kinds = kind === "both" ? ["thumb", "social"] : [kind];
    console.log(`Capturing logos/${folder} (${kinds.join(" + ")}), waiting ${waitMs}ms...`);
    for (const k of kinds) {
      await capture(server, SIZES[k], path.join(outDir, `${k}.png`));
    }
  } finally {
    server.close();
  }
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
