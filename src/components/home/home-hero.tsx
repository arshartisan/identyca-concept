"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { RiArrowRightLine, RiShieldCheckLine } from "@remixicon/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { Container } from "@/components/site/section";
import { Cta } from "@/components/site/cta";
import { EASE } from "@/components/site/motion";
import { DEMO_HREF } from "@/lib/site";
import { cx } from "@/utils/cx";
import { ArViewfinder } from "./ar-viewfinder";

/* ------------------------------------------------------------ Dot font */

// Hand-drawn 5×7 dot-matrix glyphs (only the letters the hero needs).
const GLYPHS: Record<string, string[]> = {
  S: [".###.", "#...#", "#....", ".###.", "....#", "#...#", ".###."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  N: ["#...#", "##..#", "#.#.#", "#.#.#", "#..##", "#...#", "#...#"],
  ".": [".", ".", ".", ".", ".", ".", "#"],
  " ": ["..", "..", "..", "..", "..", "..", ".."],
};

type Cell = { col: number; row: number; on: boolean };

function layoutText(text: string) {
  const cells: Cell[] = [];
  let col = 0;
  for (const ch of text) {
    const g = GLYPHS[ch];
    if (!g) continue;
    for (let r = 0; r < 7; r++) for (let c = 0; c < g[r].length; c++) cells.push({ col: col + c, row: r, on: g[r][c] === "#" });
    col += g[0].length + 1;
  }
  return { cells, cols: col - 1 };
}

/**
 * Deterministic 0..1 hash of a grid cell. Integer-only on purpose: Math.sin-based
 * hashes differ in the last bits between Node and browsers, which made the
 * server-rendered style attributes mismatch on hydration.
 */
function rand(a: number, b: number) {
  let h = Math.imul(a + 1, 0x27d4eb2d) ^ Math.imul(b + 1, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 0x100000000;
}

/** Dot-matrix word as SVG circles, drawn into a parent <svg> at (x, y) with `pitch` spacing. */
function DotWord({ text, x, y, pitch, align = "center" }: { text: string; x: number; y: number; pitch: number; align?: "center" | "start" }) {
  const { cells, cols } = layoutText(text);
  const gid = useId();
  const ox = align === "center" ? x - ((cols - 1) * pitch) / 2 : x;
  const oy = y - 3 * pitch;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.38" stopColor="var(--color-signal)" stopOpacity={0} />
          <stop offset="0.5" stopColor="var(--color-signal)" />
          <stop offset="0.62" stopColor="var(--color-signal)" stopOpacity={0} />
        </linearGradient>
      </defs>
      {cells.map(({ col, row, on }) => (
        <circle
          key={`${col}-${row}`}
          cx={+(ox + col * pitch).toFixed(2)}
          cy={+(oy + row * pitch).toFixed(2)}
          r={on ? pitch * 0.3 : pitch * 0.12}
          className={on ? "dm-dot fill-current" : "fill-current opacity-[0.07]"}
          style={on ? ({ "--d": `${(0.3 + rand(col, row) * 0.9).toFixed(3)}s` } as React.CSSProperties) : undefined}
        />
      ))}
      <rect
        x={+(ox - pitch).toFixed(2)}
        y={+(oy - pitch).toFixed(2)}
        width={+((cols + 1) * pitch).toFixed(2)}
        height={8 * pitch}
        fill={`url(#${gid})`}
        className="dm-scan"
      />
    </g>
  );
}

/** Standalone dot-matrix word (mobile layout). */
function DotWordSvg({ text, className }: { text: string; className?: string }) {
  const { cols } = layoutText(text);
  const pitch = 10;
  const w = (cols - 1) * pitch + pitch;
  return (
    <svg viewBox={`0 0 ${w} ${7 * pitch}`} className={cx("text-text-primary", className)} aria-hidden>
      <DotWord text={text} x={pitch / 2} y={3.5 * pitch} pitch={pitch} align="start" />
    </svg>
  );
}

/* --------------------------------------------------------- Connectors */

// Stage drawing space; HTML overlays use the same coordinates as percentages.
const VW = 1200;
const VH = 480;
const at = (x: number, y: number) => ({ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` });

// Inputs run outer edge → tile; outputs run tile → outer edge, so pulses read as flow.
const LINES = [
  { d: "M24 96 H404 Q436 96 458 118 L500 160", curve: "M404 96 Q436 96 458 118 L482 142", tone: "warm", dur: 4.2, delay: 0 },
  { d: "M24 384 H404 Q436 384 458 362 L500 320", curve: "M404 384 Q436 384 458 362 L482 338", tone: "warm", dur: 4.8, delay: -2.2 },
  { d: "M700 160 L742 118 Q764 96 796 96 H1176", curve: "M718 142 L742 118 Q764 96 796 96", tone: "signal", dur: 4.4, delay: -1.1 },
  { d: "M700 320 L742 362 Q764 384 796 384 H1176", curve: "M718 338 L742 362 Q764 384 796 384", tone: "signal", dur: 5, delay: -3.3 },
] as const;

const NODES: [number, number, "solid" | "muted"][] = [
  [24, 96, "muted"],
  [336, 96, "solid"],
  [362, 384, "solid"],
  [1062, 96, "solid"],
  [846, 384, "solid"],
];

function useCycle(items: string[], ms: number, active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), ms);
    return () => clearInterval(id);
  }, [items.length, ms, active]);
  return items[i];
}

function Pill({ x, y, children, tone, faded }: { x: number; y: number; children: React.ReactNode; tone?: "warm" | "signal"; faded?: boolean }) {
  return (
    <span
      className={cx(
        "absolute -translate-1/2 rounded-full border bg-background-full px-3 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap",
        tone === "warm" && "border-warm/40 text-text-primary",
        tone === "signal" && "border-signal/40 text-text-primary",
        !tone && "border-border-hairline-strong text-text-secondary",
        faded && "opacity-40",
      )}
      style={at(x, y)}
    >
      {children}
    </span>
  );
}

function CycleText({ value }: { value: string }) {
  return (
    <motion.span
      key={value}
      className="inline-block"
      initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {value}
    </motion.span>
  );
}

/* ---------------------------------------------------------------- Tile */

function LogoTile({ className }: { className?: string }) {
  return (
    <div className={cx("relative aspect-square", className)}>
      <div className="absolute inset-[-18%] rounded-full bg-signal-glow opacity-40 blur-3xl" />
      <span className="animate-pulse-ring absolute inset-[6%] rounded-[24%] border border-signal/40 [animation-duration:3.2s]" />
      <div className="relative size-full rounded-[22%] border border-border-hairline-strong bg-background-elevated p-[9%] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.06)]">
        <div className="relative size-full overflow-hidden rounded-[17%] bg-black shadow-[inset_0_2px_10px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.06)]">
          <Image src="/brand/identyca-logo.png" alt="" width={150} height={150} preload className="absolute inset-[13%] size-[74%]" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Hero */

export function HomeHero() {
  const reduce = useReducedMotion();
  const live = !reduce;
  const attendee = useCycle(["Attendee", "Smart badge", "Profile"], 2600, live);
  const match = useCycle(["94% match", "87% match", "79% match"], 2200, live);

  // Entrance runs in CSS (.hero-in), not motion: it starts at first paint
  // instead of after hydration, and the lead paragraph is the LCP element.
  const enter = (delay: number) => ({ animationDelay: `${delay}s` });

  return (
    <section className="relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-16">
      <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[760px] opacity-70" />
      <div aria-hidden className="absolute top-40 start-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-signal-glow opacity-25 blur-[140px]" />

      <Container className="relative">
        <div className="flex flex-col items-center">
          <a
            href="/spaces"
            style={enter(0)}
            className="hero-in group inline-flex items-center gap-2 rounded-full border border-border-hairline bg-background-elevated/70 py-1 ps-1 pe-3 text-caption-1-medium text-text-secondary backdrop-blur transition-colors duration-150 hover:border-border-hairline-strong hover:text-text-primary"
          >
            <span className="rounded-full bg-signal px-2 py-0.5 text-caption-2-semibold text-neutral-950">New</span>
            Identyca Spaces<span className="max-sm:hidden"> - the permanent venue layer</span>
            <RiArrowRightLine className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </a>

          <h1 className="sr-only">Identyca - See who matters. Connect instantly.</h1>

          {/* Desktop stage: words, connectors, logo tile */}
          <div
            style={enter(0.05)}
            aria-hidden
            className="hero-in relative mt-6 hidden aspect-[1200/480] w-full max-w-[1200px] text-text-primary md:block"
          >
            <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 size-full overflow-visible" fill="none">
              {LINES.map((l) => (
                <g key={l.d}>
                  <path d={l.d} className="stroke-border-hairline-strong" strokeWidth={1.25} />
                  <path d={l.curve} className={l.tone === "warm" ? "stroke-warm" : "stroke-signal"} strokeWidth={1.75} strokeLinecap="round" />
                  <path
                    d={l.d}
                    pathLength={100}
                    className={cx("bento-trace", l.tone === "warm" ? "stroke-warm" : "stroke-signal")}
                    strokeWidth={2}
                    strokeLinecap="round"
                    style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}
                  />
                </g>
              ))}
              {NODES.map(([x, y, kind]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={kind === "solid" ? 5 : 4} className={kind === "solid" ? "fill-text-primary" : "fill-text-tertiary"} />
              ))}
              <DotWord text="SEE. MATCH." x={248} y={240} pitch={6.6} />
              <DotWord text="CONNECT." x={950} y={240} pitch={6.6} />
            </svg>

            {/* Inputs */}
            <Pill x={196} y={96} tone="warm">
              <CycleText value={attendee} />
            </Pill>
            <Pill x={128} y={384}>Sponsor</Pill>
            <Pill x={240} y={384} tone="warm">
              Speaker
            </Pill>
            {/* Outcomes */}
            <Pill x={900} y={96} tone="signal">
              <CycleText value={match} />
            </Pill>
            <Pill x={960} y={384} tone="signal">
              Meeting
            </Pill>
            <Pill x={1064} y={384}>Lead</Pill>
            <Pill x={1146} y={384} faded>
              ROI
            </Pill>

            <div data-shot="hero-logo" className="absolute w-[19.7%]" style={{ ...at(482, 122) }}>
              <LogoTile className="animate-float [animation-duration:8s]" />
            </div>
          </div>

          {/* Mobile: tile above stacked dot words */}
          <div style={enter(0.05)} aria-hidden className="hero-in mt-10 flex w-full flex-col items-center gap-8 md:hidden">
            <LogoTile className="w-36" />
            <div className="flex w-full max-w-xs flex-col items-center gap-3">
              <DotWordSvg text="SEE. MATCH." className="w-full" />
              <DotWordSvg text="CONNECT." className="w-[74%]" />
            </div>
          </div>

          <p style={enter(0.12)} className="hero-in text-lead mt-8 max-w-xl text-center text-pretty text-text-secondary md:mt-2">
            AI + AR intelligence for the conference industry - from the planning table to the event floor to the venue
            itself.
          </p>

          <div style={enter(0.2)} className="hero-in mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine}>
              Book a demo
            </Cta>
            <Cta href="/roi-calculator" variant="secondary">
              Calculate your ROI
            </Cta>
          </div>

          <p style={enter(0.28)} className="hero-in mt-6 inline-flex items-center gap-1.5 text-caption-1-medium text-text-tertiary">
            <RiShieldCheckLine className="size-4" aria-hidden />
            Zero facial recognition. Identity is opt-in, via smart badge.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------- AR viewfinder showcase */

/** The AR lens view, formerly the hero visual; now its own band right under the hero. */
export function ArShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [reduce ? 1 : 0.94, 1]);

  return (
    <section ref={ref} className="relative pb-16 sm:pb-24">
      <Container>
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative mx-auto max-w-[1100px] origin-bottom"
        >
          <div aria-hidden className="absolute -inset-x-10 -bottom-10 top-1/3 rounded-full bg-signal-glow opacity-30 blur-[90px]" />
          <ArViewfinder className="relative" />
        </motion.div>
      </Container>
    </section>
  );
}
