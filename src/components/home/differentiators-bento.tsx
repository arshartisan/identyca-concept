"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  RiBluetoothLine,
  RiCheckLine,
  RiShieldKeyholeLine,
  RiSparkling2Fill,
  RiUserLocationFill,
} from "@remixicon/react";
import { Stagger, StaggerItem, EASE } from "@/components/site/motion";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { cx } from "@/utils/cx";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";

/**
 * Bento grid of Identyca differentiators. Each card carries a small, looping
 * illustration of the idea it names. CSS loops pause while a card is off-screen
 * (`.bento-paused`), JS loops only tick while `active`, and everything settles
 * to a static frame under reduced motion.
 */

type VisualState = { active: boolean; seen: boolean };

/* ------------------------------------------------------------------ Card */

function BentoCard({
  title,
  body,
  variant,
  className,
  visual,
}: {
  title: ReactNode;
  body?: ReactNode;
  /** tall: visual + title/body underneath. small: big gradient title over/under the visual. overlay: visual fills the card behind a centred title. */
  variant: "tall" | "small" | "overlay";
  className?: string;
  visual: (s: VisualState) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.2 });
  const seen = useInView(ref, { amount: 0.4, once: true });

  return (
    <StaggerItem as="article" className={cx("min-w-0", className)}>
      <BorderGlow className="h-full">
      <div
        ref={ref}
        className={cx(
          "group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)] transition-colors duration-300 hover:border-border-hairline-strong",
          variant === "tall" ? "min-h-[420px]" : "min-h-[200px]",
          "lg:min-h-0",
          !active && "bento-paused",
        )}
      >
        <div
          aria-hidden
          className={cx("bento-visual pointer-events-none", variant === "overlay" ? "absolute inset-0" : "relative flex-1")}
        >
          {visual({ active, seen })}
        </div>

        {variant === "tall" ? (
          <div className="relative flex flex-col gap-2 p-6 pt-2 sm:p-7 sm:pt-2">
            <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
            {body ? <p className="text-body-regular max-w-md leading-6 text-pretty text-text-secondary">{body}</p> : null}
          </div>
        ) : (
          <h3
            className={cx(
              "bento-title relative px-6 text-center",
              variant === "overlay" ? "my-auto py-6" : "pb-7",
            )}
          >
            {title}
          </h3>
        )}
      </div>
      </BorderGlow>
    </StaggerItem>
  );
}

/* ---------------------------------------------------- 1. Sub-meter accuracy */

const TILE_SPANS = ["col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1", "col-span-2"];

function AccuracyVisual({ active }: VisualState) {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Booth floor plan */}
      <div className="absolute -inset-3 grid grid-cols-3 grid-rows-3 gap-2.5 opacity-80">
        {TILE_SPANS.concat(TILE_SPANS.slice(0, 3)).map((span, i) => (
          <div key={i} className={cx(span, "rounded-2xl border border-border-hairline bg-background-sunken")} />
        ))}
      </div>
      {/* Tracked badge with its accuracy radius */}
      <motion.div
        className="absolute size-0"
        initial={{ left: "22%", top: "32%" }}
        animate={
          active && !reduce
            ? { left: ["22%", "74%", "80%", "30%", "22%"], top: ["32%", "26%", "70%", "74%", "32%"] }
            : undefined
        }
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      >
        <span className="absolute -inset-6 rounded-full border border-dashed border-signal/50 bg-signal-soft" />
        <span className="absolute -inset-1 rounded-full bg-signal shadow-[0_0_16px_2px_var(--color-signal-glow)]" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,var(--color-background-elevated)_20%,transparent)]" />
    </>
  );
}

/* ------------------------------------------------- 2. Spatial-first orbit */

type Orbiter = { id: string; angle: number; tone: "signal" | "warm" | "positive" | "neutral" };

const RINGS: { r: number; dur: number; reverse?: boolean; people: Orbiter[] }[] = [
  { r: 118, dur: 46, people: [{ id: "SC", angle: -55, tone: "signal" }, { id: "LM", angle: 70, tone: "neutral" }] },
  {
    r: 178,
    dur: 64,
    reverse: true,
    people: [
      { id: "PN", angle: -20, tone: "positive" },
      { id: "JO", angle: 48, tone: "neutral" },
      { id: "AK", angle: -95, tone: "neutral" },
    ],
  },
  {
    r: 240,
    dur: 84,
    people: [
      { id: "MW", angle: 18, tone: "warm" },
      { id: "TR", angle: -38, tone: "neutral" },
      { id: "EV", angle: 62, tone: "neutral" },
    ],
  },
];

const MATCHES = [
  { id: "SC", name: "Sarah Chen", score: 94 },
  { id: "MW", name: "Marcus Webb", score: 87 },
  { id: "PN", name: "Priya Nair", score: 79 },
];

const TONE_RING = {
  signal: "border-signal/60 text-signal",
  warm: "border-warm/60 text-warm",
  positive: "border-positive/60 text-positive",
  neutral: "border-border-hairline-strong text-text-tertiary",
} as const;

function OrbitVisual({ active }: VisualState) {
  const [match, setMatch] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setMatch((m) => (m + 1) % MATCHES.length), 2800);
    return () => clearInterval(id);
  }, [active]);

  const current = MATCHES[match];

  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
      {/* Rings, centred near the bottom so only their upper arcs show */}
      {RINGS.map((ring) => (
        <div
          key={ring.r}
          className="absolute start-1/2 top-[94%] rounded-full border border-border-hairline-strong"
          style={{
            width: ring.r * 2,
            height: ring.r * 2,
            translate: "-50% -50%",
            animation: `sweep ${ring.dur}s linear infinite${ring.reverse ? " reverse" : ""}`,
          }}
        >
          {ring.people.map((p) => {
            const lit = p.id === current.id;
            return (
              <div
                key={p.id}
                className="absolute start-1/2 top-1/2 size-0"
                style={{ transform: `rotate(${p.angle}deg) translateY(-${ring.r}px) rotate(${-p.angle}deg)` }}
              >
                <div
                  className="absolute -inset-4"
                  style={{ animation: `sweep ${ring.dur}s linear infinite${ring.reverse ? "" : " reverse"}` }}
                >
                  <span
                    className={cx(
                      "flex size-8 items-center justify-center rounded-full border bg-background-sunken font-mono text-[10px] font-semibold transition-all duration-500",
                      TONE_RING[p.tone],
                      lit && "scale-110 border-signal bg-signal-soft text-text-primary shadow-[0_0_24px_2px_var(--color-signal-glow)]",
                    )}
                  >
                    {p.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* You */}
      <div className="absolute start-1/2 top-[94%] size-0">
        <span className="animate-pulse-ring absolute -inset-10 rounded-full border border-signal/60" />
        <span className="animate-pulse-ring absolute -inset-10 rounded-full border border-signal/60 [animation-delay:1.2s]" />
        <span className="absolute -inset-5 flex items-center justify-center rounded-full bg-signal text-white shadow-[0_0_32px_4px_var(--color-signal-glow)]">
          <RiUserLocationFill className="size-4" />
        </span>
      </div>

      {/* Live match chip */}
      <div className="absolute start-5 top-5 z-10 flex items-center gap-2 rounded-full border border-border-hairline bg-background-elevated/80 py-1 ps-1.5 pe-3 backdrop-blur-md">
        <span className="flex size-5 items-center justify-center rounded-full bg-signal-soft font-mono text-[9px] font-semibold text-signal">
          {current.id}
        </span>
        <motion.span
          key={current.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-caption-1-medium whitespace-nowrap text-text-primary"
        >
          {current.name} <span className="text-text-tertiary">· {current.score}% match · 4 m</span>
        </motion.span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- 3. Live in 48h */

function GoLiveVisual({ active }: VisualState) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 pt-4">
      <div className="w-full max-w-[300px] rounded-[22px] border border-border-hairline p-2">
        <div className="flex items-center gap-3 rounded-full border border-border-hairline bg-background-sunken p-1.5 pe-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-signal-soft text-signal">
            <RiBluetoothLine className="size-4" />
          </span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border-hairline">
            <motion.div
              className="absolute inset-0 origin-left rounded-full bg-linear-to-r from-signal/40 to-signal"
              initial={{ scaleX: 0.15 }}
              animate={active ? { scaleX: [0.05, 1, 1, 1] } : undefined}
              transition={{ duration: 4, times: [0, 0.6, 0.92, 1], ease: EASE, repeat: Infinity }}
            />
          </div>
          <motion.span
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-positive text-white"
            initial={{ opacity: 0.25, scale: 0.8 }}
            animate={active ? { opacity: [0.25, 0.25, 1, 1, 0.25], scale: [0.8, 0.8, 1, 1, 0.8] } : undefined}
            transition={{ duration: 4, times: [0, 0.58, 0.64, 0.92, 1], repeat: Infinity }}
          >
            <RiCheckLine className="size-3.5" />
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ 4. Privacy shield */

function PrivacyVisual({ active }: VisualState) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setVisible((v) => !v), 3000);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--color-border-hairline-strong)_1px,transparent_1.5px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {/* Badge window */}
      <div className="absolute inset-x-[9%] top-[12%] bottom-[6%] rounded-2xl border border-border-hairline bg-background-elevated/60">
        <div className="flex gap-1.5 border-b border-border-hairline px-3 py-2.5">
          <span className="size-1.5 rounded-full bg-border-hairline-strong" />
          <span className="size-1.5 rounded-full bg-border-hairline-strong" />
          <span className="size-1.5 rounded-full bg-border-hairline-strong" />
        </div>
      </div>
      {/* Shield */}
      <div className="absolute start-1/2 top-[50%] size-0">
        <span className="absolute -inset-[92px] rounded-full border border-border-hairline bg-background-sunken/40" />
        <span className="absolute -inset-[62px] rounded-full border border-border-hairline-strong bg-background-elevated/70 shadow-[0_0_60px_-10px_var(--color-signal-glow)]" />
        <span className="animate-pulse-ring absolute -inset-[40px] rounded-full border border-signal/50" />
        <span
          className={cx(
            "absolute -inset-[30px] flex items-center justify-center rounded-[20px] border bg-background-sunken transition-colors duration-500",
            visible ? "border-signal/50 text-signal" : "border-border-hairline-strong text-text-tertiary",
          )}
        >
          <RiShieldKeyholeLine className="size-7" />
        </span>
      </div>
      {/* Opt-in toggle */}
      <div className="absolute start-1/2 top-[50%] flex -translate-x-1/2 translate-y-[78px] items-center gap-2.5 rounded-full border border-border-hairline bg-background-elevated px-3 py-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.5)]">
        <span className={cx("relative h-4 w-7 rounded-full transition-colors duration-300", visible ? "bg-signal" : "bg-border-hairline-strong")}>
          <span
            className={cx(
              "absolute top-0.5 size-3 rounded-full bg-white shadow transition-[inset-inline-start] duration-300 ease-out-soft",
              visible ? "start-3.5" : "start-0.5",
            )}
          />
        </span>
        <span className="text-caption-1-medium w-[108px] whitespace-nowrap text-text-secondary">
          {visible ? "Visible to matches" : "Hidden from all"}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------- 5. One ecosystem chip */

// 360 × 260 drawing space. HTML overlays use the same coordinates as percentages.
const W = 360;
const H = 260;
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

const MAIN_TRACES = [
  { d: "M128 114 H96 L70 88 H20", end: [20, 88], label: "Intelligence", align: "start", dur: 3.2, delay: 0 },
  { d: "M232 114 H264 L290 88 H340", end: [340, 88], label: "Real-time", align: "end", dur: 3.6, delay: -1.2 },
  { d: "M180 170 V198 L156 222 H112", end: [112, 222], label: "Spaces", align: "start", dur: 3.4, delay: -2.1 },
] as const;

const FAINT_TRACES = [
  "M128 146 H100 L82 164 H44 L28 180",
  "M232 146 H260 L278 164 H316 L332 180",
  "M158 90 V62 L142 46 V12",
  "M202 90 V62 L218 46 V12",
  "M180 90 V30",
  "M204 170 V200 L226 222 H300",
  "M128 130 H60 L44 114 H6",
  "M232 130 H300 L316 146 H354",
];

const PINS_X = [140, 152, 164, 176, 188, 200, 212, 224];

function EcosystemVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 pt-4">
      <div className="relative aspect-[36/26] w-full max-w-[380px]">
        <div className="absolute start-1/2 top-1/2 size-40 -translate-1/2 rounded-full bg-signal-glow opacity-50 blur-3xl" />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" fill="none">
          {FAINT_TRACES.map((d) => (
            <path key={d} d={d} className="stroke-border-hairline-strong" strokeWidth={1} />
          ))}
          {PINS_X.map((x) => (
            <g key={x} className="stroke-border-hairline-strong" strokeWidth={1.5}>
              <path d={`M${x} 90 V83`} />
              <path d={`M${x} 170 V177`} />
            </g>
          ))}
          {MAIN_TRACES.map((t, i) => (
            <g key={t.label}>
              <path d={t.d} className="stroke-border-hairline-strong" strokeWidth={1.25} />
              <path
                d={t.d}
                pathLength={100}
                className="bento-trace stroke-signal"
                strokeWidth={1.75}
                strokeLinecap="round"
                style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
              />
              <circle cx={t.end[0]} cy={t.end[1]} r={7} className="stroke-signal/40" />
              <circle cx={t.end[0]} cy={t.end[1]} r={3} className="fill-signal" />
              {/* A second, fainter pulse on two faint traces keeps the board alive */}
              {i < 2 ? (
                <path
                  d={FAINT_TRACES[i + 2]}
                  pathLength={100}
                  className="bento-trace stroke-signal/50"
                  strokeWidth={1.25}
                  strokeLinecap="round"
                  style={{ animationDuration: `${4 + i}s`, animationDelay: `${-i * 1.7}s` }}
                />
              ) : null}
            </g>
          ))}
        </svg>

        {/* Endpoint labels */}
        {MAIN_TRACES.map((t) => (
          <span
            key={t.label}
            className="absolute rounded-full border border-border-hairline bg-background-elevated/90 px-2 py-0.5 font-mono text-[10px] tracking-wide whitespace-nowrap text-text-secondary"
            style={{
              ...pct(t.end[0], t.end[1]),
              translate: t.label === "Spaces" ? "-112% -50%" : t.align === "start" ? "-8px -170%" : "calc(-100% + 8px) -170%",
            }}
          >
            {t.label}
          </span>
        ))}

        {/* Chip */}
        <div
          className="absolute flex flex-col items-center justify-center gap-1 rounded-xl border border-border-hairline-strong bg-background-sunken font-mono shadow-[0_0_0_4px_var(--color-background-elevated),0_0_48px_-6px_var(--color-signal-glow)]"
          style={{ ...pct(128, 90), width: `${(104 / W) * 100}%`, height: `${(80 / H) * 100}%` }}
        >
          <span className="text-[12px] font-semibold tracking-[0.18em] text-text-primary">IDENTYCA</span>
          <span className="text-[8px] tracking-[0.14em] text-text-tertiary">ONE DATA MODEL</span>
          <span className="text-[8px] tracking-[0.14em] text-text-tertiary">EI · RT · SP</span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- 6. AI that plans */

const PROMPTS = ["Sponsors for a fintech summit", "Keynote speakers on applied AI", "Venues for 2,000 in Lisbon"];

function AiPromptVisual({ active }: VisualState) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [n, setN] = useState(PROMPTS[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active || reduce) return;
    const full = PROMPTS[i];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && n < full.length) t = setTimeout(() => setN(n + 1), 42);
    else if (!deleting) t = setTimeout(() => setDeleting(true), 1800);
    else if (n > 0) t = setTimeout(() => setN(n - 1), 18);
    else
      t = setTimeout(() => {
        setDeleting(false);
        setI((i + 1) % PROMPTS.length);
      }, 250);
    return () => clearTimeout(t);
  }, [active, reduce, i, n, deleting]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 pt-4">
      {/* Nested frames */}
      <div className="absolute inset-x-[6%] top-[14%] h-[62%] rounded-[22px] border border-border-hairline" />
      <div className="absolute inset-x-[12%] top-[22%] h-[46%] rounded-[18px] border border-border-hairline bg-background-sunken/40" />
      <div className="relative flex w-full max-w-[260px] items-center gap-2 rounded-xl border border-border-hairline-strong bg-background-sunken px-3 py-2.5 shadow-[0_10px_30px_-12px_var(--color-signal-glow)]">
        <RiSparkling2Fill className="size-4 shrink-0 text-signal" />
        <span className="text-caption-1-medium truncate text-text-primary">
          {PROMPTS[i].slice(0, n)}
          <span className="bento-caret ms-px inline-block h-3.5 w-px translate-y-0.5 bg-signal" />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- 7. ROI line chart */

// Chart space is 0–100 on both axes; the SVG stretches, strokes don't.
const WITH = [[0, 80], [12, 74], [24, 76], [36, 62], [48, 65], [60, 48], [72, 42], [84, 24], [100, 14]];
const BASE = [[0, 84], [12, 82], [24, 85], [36, 80], [48, 82], [60, 79], [72, 81], [84, 77], [100, 76]];
const line = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

function RoiVisual({ seen }: VisualState) {
  const drawn = seen ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 };
  return (
    <div className="absolute inset-0">
      <div className="absolute start-6 top-6 flex gap-4 font-mono text-[10px] tracking-wide text-text-tertiary uppercase">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-signal" /> With Identyca
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-text-tertiary" /> Unaided floor
        </span>
      </div>

      <div className="absolute inset-x-0 top-14 bottom-2">
        {/* Gridlines */}
        {[20, 45, 70, 95].map((y) => (
          <div key={y} className="absolute inset-x-0 border-t border-border-hairline" style={{ top: `${y}%` }} />
        ))}

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="bento-roi-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`${line(WITH)} L100 100 L0 100 Z`}
            fill="url(#bento-roi-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: seen ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.path
            d={line(BASE)}
            className="stroke-text-tertiary"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={drawn}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <motion.path
            d={line(WITH)}
            className="stroke-signal"
            strokeWidth={2}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={drawn}
            transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
          />
        </svg>

        <ChartMarker x={60} y={48} delay={1.2} seen={seen} label="Qualified connections" value="4.2×" tone="signal" />
        <ChartMarker x={84} y={77} delay={1.45} seen={seen} label="Unaided networking" value="1.0×" tone="muted" />
      </div>
    </div>
  );
}

function ChartMarker({
  x,
  y,
  label,
  value,
  tone,
  delay,
  seen,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  tone: "signal" | "muted";
  delay: number;
  seen: boolean;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: seen ? 1 : 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <span className="absolute top-0 start-0 h-[200px] border-s border-dashed border-border-hairline-strong" />
      {tone === "signal" ? <span className="animate-pulse-ring absolute -inset-2 -translate-1/2 rounded-full border border-signal" /> : null}
      <span
        className={cx(
          "absolute size-2.5 -translate-1/2 rounded-full ring-4 ring-background-elevated",
          tone === "signal" ? "bg-signal" : "bg-text-tertiary",
        )}
      />
      <span className="absolute bottom-3 end-2 flex items-center gap-3 rounded-lg border border-border-hairline-strong bg-background-elevated/90 px-2.5 py-1.5 whitespace-nowrap backdrop-blur-md">
        <span className="text-caption-2-medium text-text-secondary">{label}</span>
        <span className={cx("font-mono text-[11px] font-semibold", tone === "signal" ? "text-signal" : "text-text-tertiary")}>
          {value}
        </span>
      </span>
    </motion.div>
  );
}

/* ---------------------------------------------- 8. Venue-permanent beacons */

const BEACONS = [
  [12, 26],
  [30, 78],
  [48, 16],
  [66, 82],
  [86, 30],
  [90, 72],
  [8, 64],
];

function SpacesVisual() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--color-border-hairline-strong)_1px,transparent_1.5px)] [background-size:12px_12px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />
      {BEACONS.map(([x, y], i) => (
        <span key={i} className="absolute size-0" style={{ left: `${x}%`, top: `${y}%` }}>
          <span
            className="animate-pulse-ring absolute -inset-3 rounded-full border border-signal opacity-0"
            style={{ animationDelay: `${i * 0.55}s`, animationDuration: "3.8s" }}
          />
          <span className="absolute -inset-[3px] rounded-full bg-signal shadow-[0_0_10px_1px_var(--color-signal-glow)]" />
        </span>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_50%,var(--color-background-elevated)_30%,transparent)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ Grid */

export function DifferentiatorsBento({ className }: { className?: string }) {
  return (
    <Stagger
      gap={0.07}
      className={cx(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(8,84px)]",
        className,
      )}
    >
      {/* DOM order pairs cards of equal height for the 2-column layout; lg placement is explicit. */}
      <BentoCard
        variant="overlay"
        className="lg:col-start-1 lg:row-span-2 lg:row-start-1"
        title="< 80 cm accuracy"
        visual={(s) => <AccuracyVisual {...s} />}
      />
      <BentoCard
        variant="small"
        className="lg:col-start-3 lg:row-span-2 lg:row-start-1"
        title="AI that plans"
        visual={(s) => <AiPromptVisual {...s} />}
      />
      <BentoCard
        variant="tall"
        className="lg:col-start-1 lg:row-span-4 lg:row-start-3"
        title="Spatial-first, not app-first"
        body="Other tools ask people to pull out a phone and scan. Identyca maps opted-in identities in space - ambient, zero-friction matches on the event floor."
        visual={(s) => <OrbitVisual {...s} />}
      />
      <BentoCard
        variant="tall"
        className="lg:col-start-2 lg:row-span-4 lg:row-start-1"
        title="Privacy by architecture"
        body="Zero facial recognition. Identity is opt-in via smart badge, and attendees control their own visibility at all times."
        visual={(s) => <PrivacyVisual {...s} />}
      />
      <BentoCard
        variant="tall"
        className="lg:col-start-2 lg:row-span-4 lg:row-start-5"
        title="One ecosystem. Three products."
        body="Pre-event planning, the event floor and the venue layer run on one data model - Event Intelligence, Real-time and Spaces, unified."
        visual={() => <EcosystemVisual />}
      />
      <BentoCard
        variant="tall"
        className="lg:col-start-3 lg:row-span-4 lg:row-start-3"
        title="Built for organizer + sponsor ROI"
        body="Deploy at zero net cost by reselling smart glass access and analytics. Sponsors see 3–5× more qualified conversations."
        visual={(s) => <RoiVisual {...s} />}
      />
      <BentoCard
        variant="small"
        className="lg:col-start-1 lg:row-span-2 lg:row-start-7"
        title="Live in 48 hours"
        visual={(s) => <GoLiveVisual {...s} />}
      />
      <BentoCard
        variant="overlay"
        className="lg:col-start-3 lg:row-span-2 lg:row-start-7"
        title={
          <>
            Install once.
            <br />
            Reuse forever.
          </>
        }
        visual={() => <SpacesVisual />}
      />
    </Stagger>
  );
}
