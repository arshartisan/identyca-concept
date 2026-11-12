#!/usr/bin/env node
/**
 * Renders smooth, frame-exact showcase videos of the home page.
 *
 *   node scripts/record-showcase.mjs                       # desktop + mobile from the Vercel deploy
 *   node scripts/record-showcase.mjs --only desktop --url http://localhost:3000 --out ./showcase
 *
 * How it stays smooth: the page never runs on wall-clock time. Playwright's fake
 * clock drives requestAnimationFrame / timers / performance.now, and before each
 * frame every CSS + Web Animation (and SVG SMIL) is paused and seeked to that
 * same clock. Each frame therefore advances exactly 1/FPS s no matter how slow
 * the screenshot was. Frames are piped as JPEG into ffmpeg -> H.264 MP4.
 *
 * Needs: Google Chrome installed, and the dev deps playwright-core + ffmpeg-static.
 */
import { chromium } from "playwright-core";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdirSync } from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ args */

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const URL_ = arg("url", "https://identyca-concept.vercel.app/");
const OUT = path.resolve(arg("out", "showcase"));
const ONLY = arg("only", "all"); // all | desktop | desktop-zoom | mobile
const FPS = Number(arg("fps", "90"));
const QUALITY = Number(arg("quality", "92")); // JPEG quality of captured frames

/* ------------------------------------------------------- choreography */

// Each step: hold (s), scroll to a target (selector | "bottom" | +px) over (s), click, key.
const DESKTOP = {
  name: "desktop",
  context: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
  steps: [
    { hold: 3.4 }, // hero: dot-matrix boot, connector pulses
    { scroll: "#products", offset: 96, dur: 2.4 },
    { hold: 2.4 },
    { scroll: "#different", offset: 72, dur: 2.6 },
    { hold: 4.6, mouse: { over: "#different .grid", path: [[0.02, 0.06], [0.34, 0.08], [0.5, 0.48], [0.67, 0.52], [0.99, 0.62], [0.68, 0.97]] } },
    { scroll: "#lifecycle", offset: 80, dur: 2.2 },
    { hold: 1.6 },
    { scroll: "#numbers", offset: 40, dur: 2.0 },
    { hold: 2.4 },
    { scroll: "#compare", offset: 80, dur: 1.8 },
    { hold: 1.4 },
    { scroll: "bottom", dur: 3.4 },
    { hold: 4.2 }, // footer loop
  ],
};

// ~28 s walkthrough with camera close-ups on the animated components.
// zoom: push in on a [data-shot] target; pan: glide to another target while zoomed;
// unzoom: pull back to the full page. Scrolls always happen at 1x.
const DESKTOP_ZOOM = {
  name: "desktop-zoom",
  context: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
  steps: [
    { hold: 1.8 }, // hero: dot-matrix boot
    { zoom: "hero-logo", z: 1.9, dur: 1.4 },
    { hold: 1.0 },
    { unzoom: true, dur: 1.0 },
    { scroll: "#products", offset: 96, dur: 1.5 },
    { zoom: "product-rt", z: 1.8, dur: 1.1 },
    { hold: 0.9 },
    { pan: "product-ei", dur: 1.0 },
    { hold: 0.7 },
    { unzoom: true, dur: 0.9 },
    { scroll: "#different", offset: 72, dur: 1.5 },
    { hold: 0.4 },
    { zoom: "bento-eco", z: 1.9, dur: 1.1 },
    { hold: 1.0 },
    { pan: "bento-roi", dur: 1.1 },
    { hold: 0.8 },
    { unzoom: true, dur: 0.9 },
    { scroll: "#why", offset: 72, dur: 1.5 },
    { hold: 0.3 },
    { zoom: "why-roi", z: 1.9, dur: 1.0 },
    { hold: 0.8 },
    { pan: "why-stage", dur: 0.9 },
    { hold: 0.7 },
    { unzoom: true, dur: 0.8 },
    { scroll: "bottom", dur: 1.8 },
    { zoom: "footer-scene", z: 1.6, dur: 1.2 },
    { hold: 1.6 },
  ],
};

const MOBILE = {
  name: "mobile",
  // 360 x 640 CSS px at 3x -> 1080 x 1920 vertical video
  context: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  steps: [
    { hold: 3.0 },
    { click: 'button[aria-label="Open menu"]' },
    { hold: 3.2 }, // sidebar slides in, sections stagger
    { key: "Escape" },
    { hold: 0.9 },
    { scroll: "#products", offset: 72, dur: 2.2 },
    { hold: 2.0 },
    { scroll: "#different", offset: 64, dur: 2.4 },
    { hold: 1.6 },
    { scroll: "+900", dur: 2.4 },
    { hold: 1.8 },
    { scroll: "#numbers", offset: 40, dur: 2.4 },
    { hold: 2.0 },
    { scroll: "#why", offset: 72, dur: 2.2 },
    { hold: 1.6 },
    { scroll: "bottom", dur: 3.6 },
    { hold: 3.6 },
  ],
};

/* ------------------------------------------------------- page helpers */

// Installed into every document: seeks all animations to the (fake) clock.
//
// An animation's own currentTime is measured on the *real* document timeline,
// which drifts away from the fake clock (each frame takes ~100 ms of wall time
// but only 1/FPS s of fake time). Trusting it made motion's reveal animations
// come out with large negative times, i.e. stuck in their delay at opacity 0.
// So every animation is treated as starting on the frame it is first seen;
// intentional delays/staggers live in its effect timing and still apply.
function installTimeSync() {
  const starts = new WeakMap();
  window.__showcase = {
    // Centre of a [data-shot] target in document coords, measured with the camera off.
    target(name) {
      const body = document.body;
      const prev = body.style.transform;
      body.style.transform = "";
      const el = document.querySelector(`[data-shot="${name}"]`);
      const r = el ? el.getBoundingClientRect() : null;
      body.style.transform = prev;
      return r ? { x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY } : null;
    },
    // Camera: scale z about focus (fx, fy); w in [0,1] slides the focus to viewport centre.
    camera(fx, fy, z, w) {
      const body = document.body;
      const header = document.querySelector("header");
      if (z < 1.0005 && w < 0.0005) {
        body.style.transform = "";
        body.style.transformOrigin = "";
        if (header) header.style.opacity = "";
        return;
      }
      const tx = (innerWidth / 2 - fx) * w;
      const ty = (scrollY + innerHeight / 2 - fy) * w;
      body.style.transformOrigin = `${fx}px ${fy}px`;
      body.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
      // the fixed header would ride along inside the transformed body: fade it for close-ups
      if (header) header.style.opacity = String(Math.max(0, 1 - (z - 1) / 0.12));
    },
    sync() {
      const now = performance.now();
      for (const a of document.getAnimations()) {
        let s = starts.get(a);
        if (s === undefined) {
          s = now;
          starts.set(a, s);
        }
        const t = now - s;
        const end = a.effect?.getComputedTiming().endTime ?? Infinity;
        if (Number.isFinite(end) && t >= end) {
          if (a.playState !== "finished") a.finish(); // lets motion resolve `finished`
          continue;
        }
        if (a.playState !== "paused") a.pause();
        a.currentTime = t;
      }
      for (const svg of document.querySelectorAll("svg")) {
        if (!svg.querySelector("animateMotion, animate, animateTransform")) continue;
        svg.pauseAnimations();
        svg.setCurrentTime(now / 1000);
      }
    },
  };
}

const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10);

function startEncoder(file) {
  const ff = spawn(
    ffmpegPath,
    [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
      "-r", String(FPS), "-movflags", "+faststart", file,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  return {
    async write(buf) {
      if (!ff.stdin.write(buf)) await once(ff.stdin, "drain");
    },
    async close() {
      ff.stdin.end();
      const [code] = await once(ff, "exit");
      if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
    },
  };
}

/* -------------------------------------------------------------- render */

async function render(browser, spec) {
  const file = path.join(OUT, `identyca-showcase-${spec.name}.mp4`);
  const context = await browser.newContext({ ...spec.context, reducedMotion: "no-preference", colorScheme: "dark" });

  // 1) Warm-up pass: pull every asset into the HTTP cache so nothing pops in mid-video.
  const warm = await context.newPage();
  await warm.goto(URL_, { waitUntil: "networkidle" });
  await warm.evaluate(async () => {
    document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await warm.waitForLoadState("networkidle");
  await warm.close();

  // 2) Real pass on a paused fake clock.
  const page = await context.newPage();
  await page.addInitScript(installTimeSync);
  const T0 = new Date("2026-11-12T09:00:00Z").getTime();
  await page.clock.install({ time: T0 });
  await page.clock.pauseAt(T0 + 1000);
  await page.goto(URL_, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
  });
  await page.mouse.move(spec.context.viewport.width - 4, spec.context.viewport.height - 4);

  const enc = startEncoder(file);
  let frames = 0;
  let elapsedMs = 0;

  const frame = async () => {
    frames += 1;
    const target = Math.round((frames * 1000) / FPS);
    await page.clock.runFor(target - elapsedMs);
    elapsedMs = target;
    await page.evaluate(() => window.__showcase.sync());
    await enc.write(await page.screenshot({ type: "jpeg", quality: QUALITY, caret: "hide" }));
    if (frames % FPS === 0) process.stdout.write(`\r  ${spec.name}: ${frames / FPS}s rendered`);
  };

  // camera at rest: 1x, focus unused (w = 0 means no translation)
  let cam = { fx: 0, fy: 0, z: 1, w: 0 };

  for (const step of spec.steps) {
    if (step.click) {
      await page.locator(step.click).first().click();
      continue;
    }
    if (step.key) {
      await page.keyboard.press(step.key);
      continue;
    }
    if (step.hold) {
      const n = Math.round(step.hold * FPS);
      let box = null;
      if (step.mouse) box = await page.locator(step.mouse.over).first().boundingBox();
      for (let i = 0; i < n; i++) {
        if (box) {
          // Glide the cursor along the path (Catmull-free: eased linear segments)
          const p = step.mouse.path;
          const u = smootherstep(i / (n - 1)) * (p.length - 1);
          const k = Math.min(Math.floor(u), p.length - 2);
          const f = smootherstep(u - k);
          const fx = p[k][0] + (p[k + 1][0] - p[k][0]) * f;
          const fy = p[k][1] + (p[k + 1][1] - p[k][1]) * f;
          await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy);
        }
        await frame();
      }
      if (box) await page.mouse.move(spec.context.viewport.width - 4, spec.context.viewport.height - 4);
      continue;
    }
    if (step.zoom || step.pan || step.unzoom) {
      const vw = spec.context.viewport.width;
      let to = cam;
      if (step.unzoom) to = { ...cam, z: 1, w: 0 };
      else {
        const t = await page.evaluate((n) => window.__showcase.target(n), step.zoom ?? step.pan);
        if (!t) {
          // Shot markers ship with the site code: a deploy without them (e.g. an older
          // Vercel build) still renders, the close-up just becomes a plain hold.
          console.warn(`
  ! no [data-shot="${step.zoom ?? step.pan}"] on ${URL_} - holding instead of zooming (deploy the latest code, or pass --url http://localhost:3000)`);
          for (let i = 0; i < Math.round(step.dur * FPS); i++) await frame();
          continue;
        }
        const z = step.zoom ? step.z : cam.z;
        // keep the zoomed view inside the page horizontally (no blank margins)
        const half = vw / (2 * z);
        to = { fx: Math.min(vw - half, Math.max(half, t.x)), fy: t.y, z, w: 1 };
      }
      // zooming out keeps the focus where it is; zooming in from rest starts on the target
      const from = cam.w === 0 && step.zoom ? { ...to, z: 1, w: 0 } : cam;
      if (step.unzoom) to = { ...to, fx: from.fx, fy: from.fy };
      const n = Math.round(step.dur * FPS);
      for (let i = 1; i <= n; i++) {
        const e = smootherstep(i / n);
        cam = {
          fx: from.fx + (to.fx - from.fx) * e,
          fy: from.fy + (to.fy - from.fy) * e,
          z: from.z * Math.pow(to.z / from.z, e), // geometric: constant-speed feel
          w: from.w + (to.w - from.w) * e,
        };
        await page.evaluate((c) => window.__showcase.camera(c.fx, c.fy, c.z, c.w), cam);
        await frame();
      }
      continue;
    }
    if (step.scroll) {
      const { from, to } = await page.evaluate(
        ({ target, offset }) => {
          const max = document.documentElement.scrollHeight - innerHeight;
          let y;
          if (target === "bottom") y = max;
          else if (target.startsWith("+")) y = scrollY + Number(target.slice(1));
          else {
            const el = document.querySelector(target);
            y = el ? el.getBoundingClientRect().top + scrollY - offset : scrollY;
          }
          return { from: scrollY, to: Math.max(0, Math.min(max, Math.round(y))) };
        },
        { target: step.scroll, offset: step.offset ?? 0 },
      );
      const n = Math.round(step.dur * FPS);
      for (let i = 1; i <= n; i++) {
        const y = from + (to - from) * smootherstep(i / n);
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await frame();
      }
    }
  }

  await enc.close();
  await context.close();
  process.stdout.write(`\r  ${spec.name}: ${(frames / FPS).toFixed(1)}s, ${frames} frames -> ${file}\n`);
}

/* ---------------------------------------------------------------- main */

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
console.log(`Recording ${URL_} at ${FPS} fps`);
try {
  if (ONLY === "all" || ONLY === "desktop") await render(browser, DESKTOP);
  if (ONLY === "all" || ONLY === "desktop-zoom") await render(browser, DESKTOP_ZOOM);
  if (ONLY === "all" || ONLY === "mobile") await render(browser, MOBILE);
} finally {
  await browser.close();
}
