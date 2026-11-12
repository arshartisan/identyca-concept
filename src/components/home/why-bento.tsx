"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { Cta } from "@/components/site/cta";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";
import { cx } from "@/utils/cx";

/**
 * "Why Identyca" as a line-art bento: four reason cards, each with a thin
 * isometric drawing, plus one inverted (light) card carrying the headline.
 * Loops pause off-screen (`bento-paused`) and stop under reduced motion
 * (`bento-visual`).
 */

export type Reason = { title: string; body: string; link: { label: string; href: string } };

/* ------------------------------------------------------------ geometry */

const C30 = 0.8660254037844386;
const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * C30, (x + y) * 0.5 - z];
const pts = (list: [number, number][]) => list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

/** Line-art isometric box: faces filled with `bg` so nearer boxes hide farther edges. */
function IsoBox({ x, y, z, w, d, h, bg, top }: { x: number; y: number; z: number; w: number; d: number; h: number; bg: string; top?: string }) {
  return (
    <g fill={bg} stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round">
      <polygon points={pts([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} />
      <polygon points={pts([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)])} />
      <polygon points={pts([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} fill={top ?? bg} />
    </g>
  );
}

/* --------------------------------------------------------- illustrations */

const CARD_BG = "var(--color-background-elevated)";
const SIGNAL = "var(--color-signal)";

/** Small mono caption drawn inside an illustration. */
function Tag({ x, y, children, anchor = "middle", className }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; className?: string }) {
  return (
    // stroke in the card colour, painted under the fill: a halo that keeps labels legible over line art
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={8.5}
      letterSpacing="0.12em"
      stroke={CARD_BG}
      strokeWidth={3}
      strokeLinejoin="round"
      paintOrder="stroke"
      className={cx("font-mono fill-current", className)}
    >
      {children}
    </text>
  );
}

/** Isometric person marker: a tiny upright capsule. */
function Person({ x, y, z, accent = false }: { x: number; y: number; z: number; accent?: boolean }) {
  const [px, py] = iso(x, y, z);
  return (
    <g>
      <rect x={px - 2.4} y={py - 9} width={4.8} height={8} rx={2.4} fill={accent ? SIGNAL : CARD_BG} stroke={accent ? SIGNAL : "currentColor"} strokeWidth={1} />
      <circle cx={px} cy={py - 11.5} r={2.2} fill={accent ? SIGNAL : CARD_BG} stroke={accent ? SIGNAL : "currentColor"} strokeWidth={1} />
    </g>
  );
}

/** Beacon puck with a ping, sitting on a surface at (x, y, z). */
function Beacon({ x, y, z, delay = 0 }: { x: number; y: number; z: number; delay?: number }) {
  const [bx, by] = iso(x, y, z);
  return (
    <g>
      <ellipse
        cx={bx}
        cy={by - 4}
        rx={9}
        ry={4.5}
        fill="none"
        stroke={SIGNAL}
        strokeWidth={1}
        className="animate-pulse-ring [transform-box:fill-box] [transform-origin:center]"
        style={{ animationDuration: "2.6s", animationDelay: `${delay}s` }}
      />
      <path d={`M${bx - 6} ${by} v-4 a6 3 0 0 1 12 0 v4 a6 3 0 0 1 -12 0z`} fill={CARD_BG} stroke="currentColor" strokeWidth={1} />
      <ellipse cx={bx} cy={by - 4} rx={2.6} ry={1.3} fill={SIGNAL} />
    </g>
  );
}

/**
 * ROI: an isometric bar chart that grows in, with a cyan trend line drawing up
 * and out past the last bar. Bounds ~ x -95..103, y -150..48.
 */
function RoiChart() {
  const bars = [
    { x: -62, h: 22 },
    { x: -34, h: 36 },
    { x: -6, h: 52 },
    { x: 22, h: 72 },
    { x: 50, h: 98 },
  ];
  const trend = [...bars.map((b) => iso(b.x + 9, 0, b.h + 14)), iso(92, 0, 132)];
  const d = "M" + trend.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L");
  const [ex, ey] = trend[trend.length - 1];
  const [px, py] = trend[trend.length - 2];
  const ang = Math.atan2(ey - py, ex - px);
  const head = (s: number) => `${(ex - 9 * Math.cos(ang + s)).toFixed(1)},${(ey - 9 * Math.sin(ang + s)).toFixed(1)}`;
  return (
    <svg viewBox="-104 -158 214 214" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      <IsoBox x={-80} y={-22} z={0} w={160} d={44} h={5} bg={CARD_BG} />
      {bars.map((b, i) => (
        <g key={b.x} className="why-bar" style={{ animationDelay: `${(i * 0.12).toFixed(2)}s` }}>
          <IsoBox x={b.x} y={-9} z={5} w={18} d={18} h={b.h} bg={CARD_BG} />
          {i === bars.length - 1 ? (
            <polygon points={pts([iso(b.x, -9, 5 + b.h), iso(b.x + 18, -9, 5 + b.h), iso(b.x + 18, 9, 5 + b.h), iso(b.x, 9, 5 + b.h)])} fill={SIGNAL} fillOpacity={0.35} stroke={SIGNAL} strokeWidth={1.25} />
          ) : null}
        </g>
      ))}
      <path d={d} pathLength={100} stroke={SIGNAL} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" className="why-draw" />
      <polygon points={`${ex.toFixed(1)},${ey.toFixed(1)} ${head(0.45)} ${head(-0.45)}`} fill={SIGNAL} className="why-draw-head" />
    </svg>
  );
}

/**
 * Every stage: PLAN -> EVENT -> VENUE tiles joined by a route, with a dot
 * travelling the whole lifecycle. Bounds ~ x -108..108, y -66..60.
 */
function Lifecycle() {
  const tiles = [
    { x: -100, label: "PLAN" },
    { x: -22, label: "EVENT" },
    { x: 56, label: "VENUE" },
  ];
  const W = 44;
  const top = 6;
  const centre = (x: number) => iso(x + W / 2, 0, top);
  const route = "M" + tiles.map((t) => centre(t.x).map((n) => n.toFixed(1)).join(" ")).join(" L");
  return (
    <svg viewBox="-112 -76 224 146" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      {tiles.map((t) => (
        <IsoBox key={t.label} x={t.x} y={-W / 2} z={0} w={W} d={W} h={top} bg={CARD_BG} />
      ))}
      <path d={route} stroke="currentColor" strokeWidth={1} strokeDasharray="3 4" />
      {/* PLAN: the event brief */}
      <IsoBox x={-88} y={-10} z={top} w={20} d={20} h={2} bg={CARD_BG} />
      <path d={`M${iso(-84, -6, top + 2).join(" ")} L${iso(-72, -6, top + 2).join(" ")} M${iso(-84, -1, top + 2).join(" ")} L${iso(-75, -1, top + 2).join(" ")}`} stroke="currentColor" strokeWidth={0.9} />
      {/* EVENT: attendees on the floor */}
      <Person x={-10} y={-10} z={top} />
      <Person x={6} y={-6} z={top} accent />
      <Person x={-6} y={8} z={top} />
      <Person x={10} y={10} z={top} />
      {/* VENUE: the building */}
      <IsoBox x={66} y={-12} z={top} w={24} d={24} h={30} bg={CARD_BG} />
      <path d={`M${iso(90, -6, top + 10).join(" ")} L${iso(90, 6, top + 10).join(" ")} M${iso(90, -6, top + 20).join(" ")} L${iso(90, 6, top + 20).join(" ")}`} stroke="currentColor" strokeWidth={0.8} />
      <circle r={4} fill={SIGNAL}>
        <animateMotion dur="5.4s" repeatCount="indefinite" path={route} keyTimes="0;0.8;1" keyPoints="0;1;1" calcMode="linear" />
      </circle>
      {tiles.map((t) => {
        const [lx, ly] = iso(t.x + W / 2, W / 2, 0);
        return (
          <Tag key={t.label} x={lx} y={ly + 16}>
            {t.label}
          </Tag>
        );
      })}
    </svg>
  );
}

/**
 * Scale: a small venue and an expo hall, each run by beacons; the crowd grows
 * but the setup is the same. Bounds ~ x -110..110, y -84..74.
 */
function ScaleCrowd() {
  // Screen-space placement; bounds: small x -108..-32, big x -30..130, y -46..76.
  const small: [number, number][] = [
    [-8, -8],
    [8, -10],
    [-10, 8],
    [10, 6],
  ];
  const big: [number, number][] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) big.push([-38 + i * 15.2, -38 + j * 15.2]);
  return (
    <svg viewBox="-116 -60 254 146" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      {/* small venue */}
      <g transform="translate(-70 -10)">
        <IsoBox x={-22} y={-22} z={0} w={44} d={44} h={4} bg={CARD_BG} />
        {small.map(([x, y], i) => (
          <Person key={i} x={x} y={y} z={4} />
        ))}
        <Beacon x={0} y={0} z={4} />
        <Tag x={0} y={42}>
          150
        </Tag>
      </g>
      {/* arrow */}
      <path d="M -38 -38 H -10 M -16 -44 L -10 -38 L -16 -32" stroke={SIGNAL} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* expo hall */}
      <g transform="translate(50 10)">
        <IsoBox x={-46} y={-46} z={0} w={92} d={92} h={4} bg={CARD_BG} />
        {big.map(([x, y], i) => {
          if (Math.abs(x) < 8 && Math.abs(y) < 8) return null;
          const [px, py] = iso(x, y, 4);
          return <circle key={i} cx={px} cy={py - 2} r={2.1} fill="currentColor" className="why-twinkle" style={{ animationDelay: `${((i * 37) % 23) * 0.13}s` }} />;
        })}
        <Beacon x={0} y={0} z={4} delay={0.8} />
        <Tag x={0} y={66}>
          50,000
        </Tag>
      </g>
    </svg>
  );
}

/** Deploy: SURVEY -> INSTALL -> LIVE steps, the dot climbing to a check. */
function DeploySteps() {
  const steps = [
    { x: -60, h: 18, label: "SURVEY" },
    { x: -20, h: 36, label: "INSTALL" },
    { x: 20, h: 54, label: "LIVE" },
  ];
  const climb = (() => {
    const p = [iso(-60, 0, 0), iso(-60, 0, 18), iso(-20, 0, 18), iso(-20, 0, 36), iso(20, 0, 36), iso(20, 0, 54), iso(46, 0, 54)];
    return "M" + p.map(([a, b]) => `${a.toFixed(1)} ${(b - 5).toFixed(1)}`).join(" L");
  })();
  const [cx, cy] = iso(46, 0, 54);
  return (
    <svg viewBox="-110 -110 220 172" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      {/* painter's order: far (small x) first, near last */}
      {steps.map((s) => (
        <IsoBox key={s.label} x={s.x} y={-30} z={0} w={40} d={60} h={s.h} bg={CARD_BG} />
      ))}
      {steps.map((s) => {
        // under each step's front-bottom edge: labels step down diagonally, never colliding
        const [lx, ly] = iso(s.x + 20, 30, 0);
        return (
          <Tag key={s.label} x={lx} y={ly + 14}>
            {s.label}
          </Tag>
        );
      })}
      <circle r={4} fill={SIGNAL}>
        <animateMotion dur="4.8s" repeatCount="indefinite" path={climb} keyTimes="0;0.85;1" keyPoints="0;1;1" calcMode="linear" />
      </circle>
      <g transform={`translate(${cx.toFixed(1)} ${(cy - 16).toFixed(1)})`}>
        <circle r={9} fill={SIGNAL} fillOpacity={0.18} stroke={SIGNAL} strokeWidth={1.25} />
        <path d="M -4 0 L -1 3 L 4.5 -3" stroke={SIGNAL} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Headline card colour key: one tint per product beam. */
// Solid blends (38% cyan / 38% orange / 14% white over the dark card) so tinted faces still occlude.
const BEAM_TINT = { intelligence: "#0c5269", realtime: "#6b3d0e", spaces: "#353537" } as const;

/** Headline card: the three products as one interlocking structure, colour-keyed. */
function Beams() {
  const bg = CARD_BG;
  return (
    // Projected bounds of the three beams: x -66..139, y -156..78 (+ margin)
    <svg viewBox="-82 -172 236 264" className="min-h-0 w-full flex-1 text-text-secondary" fill="none" aria-hidden>
      <g className="why-float" style={{ animationDelay: "-2s" }}>
        <IsoBox x={-100} y={-60} z={40} w={200} d={36} h={36} bg={bg} top={BEAM_TINT.intelligence} />
      </g>
      <g className="why-float" style={{ animationDelay: "-4s" }}>
        <IsoBox x={-18} y={-18} z={-60} w={36} d={36} h={180} bg={bg} top={BEAM_TINT.realtime} />
      </g>
      <g className="why-float" style={{ animationDelay: "0s" }}>
        <IsoBox x={20} y={-100} z={10} w={36} d={160} h={36} bg={bg} top={BEAM_TINT.spaces} />
      </g>
    </svg>
  );
}

function BeamsLegend() {
  const items: [string, string][] = [
    ["Event Intelligence", BEAM_TINT.intelligence],
    ["Real-time", BEAM_TINT.realtime],
    ["Spaces", BEAM_TINT.spaces],
  ];
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
      {items.map(([name, tint]) => (
        <li key={name} className="inline-flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
          <span aria-hidden className="size-2.5 rounded-[3px] border border-text-secondary" style={{ background: tint }} />
          {name}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- cards */

function Chips({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((c) => (
        <li
          key={c}
          className={cx(
            "rounded-full border px-2.5 py-1 text-caption-2-medium",
            tone === "dark" ? "border-border-hairline-strong text-text-secondary" : "border-neutral-900/25 text-neutral-700",
          )}
        >
          {c}
        </li>
      ))}
    </ul>
  );
}

function ReasonCard({
  reason,
  art,
  chips,
  className,
  artClassName,
  shot,
}: {
  shot?: string;
  reason: Reason;
  art: ReactNode;
  chips?: string[];
  className?: string;
  artClassName?: string;
}) {
  return (
    <StaggerItem className={cx("min-w-0", className)}>
      <BorderGlow className="h-full">
        <Link
          href={reason.link.href}
          data-shot={shot}
          className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated p-6 outline-none transition-colors duration-300 hover:border-border-hairline-strong focus-visible:ring-2 focus-visible:ring-border-focus-ring lg:min-h-0"
        >
          <div className="relative z-10 flex items-start justify-between gap-4">
            <h3 className="text-title-1-semibold min-h-[4.25rem] max-w-[14ch] tracking-[-0.02em] text-text-primary">{reason.title}</h3>
            <RiArrowRightUpLine
              className="size-7 shrink-0 text-text-secondary transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
              aria-hidden
            />
          </div>
          <div className={cx("bento-visual pointer-events-none relative h-44 shrink-0", artClassName)}>{art}</div>
          <div className="relative z-10 flex flex-1 flex-col gap-3">
            <p className="text-body-regular max-w-sm leading-6 text-text-secondary">{reason.body}</p>
            {chips ? <div className="mt-auto pt-1"><Chips items={chips} /></div> : null}
            <span className="sr-only">{reason.link.label}</span>
          </div>
        </Link>
      </BorderGlow>
    </StaggerItem>
  );
}

/* ---------------------------------------------------------------- grid */

export function WhyBento({ reasons, demoHref }: { reasons: Reason[]; demoHref: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.05 });
  const [roi, stage, scale, deploy] = reasons;

  return (
    <div ref={ref} className={cx(!active && "bento-paused")}>
      <Stagger gap={0.07} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Headline card: first, full width */}
        <StaggerItem className="min-w-0 md:col-span-2 lg:col-span-4">
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated p-6 sm:p-10 lg:flex-row lg:items-center lg:gap-10">
            <div aria-hidden className="pointer-events-none absolute -top-32 -start-24 h-80 w-[520px] rounded-full bg-signal-glow opacity-25 blur-[100px]" />
            <div className="relative z-10 flex flex-col gap-8 lg:max-w-[560px]">
              <div className="flex flex-col gap-4">
                <span className="eyebrow inline-flex items-center gap-2 text-text-secondary">
                  <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                  Why Identyca
                </span>
                <h2 className="text-section text-balance text-text-primary">
                  Four reasons teams <em className="font-accent">switch</em>.
                </h2>
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-lead text-pretty text-text-secondary">
                  One of the only event platforms where the return is{" "}
                  <mark className="rounded-full bg-signal px-2.5 py-0.5 text-neutral-950 [box-decoration-break:clone]">
                    calculable before sign-up
                  </mark>{" "}
                  - and it covers the whole event lifecycle.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Cta href={demoHref} trailingIcon={RiArrowRightUpLine}>
                    Book a demo
                  </Cta>
                  <Link
                    href="/roi-calculator"
                    className="rounded-full px-3 py-2 text-body-medium text-text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    Calculate your ROI
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative mt-8 flex h-72 min-h-0 flex-col gap-3 lg:mt-0 lg:h-80 lg:flex-1">
              <div className="bento-visual pointer-events-none flex min-h-0 flex-1">
                <Beams />
              </div>
              <BeamsLegend />
            </div>
          </div>
        </StaggerItem>

        <ReasonCard
          shot="why-roi"
          reason={roi}
          art={<RoiChart />}
          chips={["Sponsor uplift", "Renewal rates", "Cost offsets", "Lead capture"]}
        />
        <ReasonCard shot="why-stage" reason={stage} art={<Lifecycle />} chips={["Pre-event", "Event floor", "Venue"]} />
        <ReasonCard reason={scale} art={<ScaleCrowd />} chips={["Same network load", "Scales horizontally"]} />
        <ReasonCard reason={deploy} art={<DeploySteps />} chips={["1-day site survey", "Live in 48 h"]} />
      </Stagger>
    </div>
  );
}
