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
function IsoBox({ x, y, z, w, d, h, bg }: { x: number; y: number; z: number; w: number; d: number; h: number; bg: string }) {
  return (
    <g fill={bg} stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round">
      <polygon points={pts([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} />
      <polygon points={pts([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)])} />
      <polygon points={pts([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} />
    </g>
  );
}

/* --------------------------------------------------------- illustrations */

const CARD_BG = "var(--color-background-elevated)";

/** ROI: a coil of rings that breathes in a travelling wave (compounding returns). */
function Coil() {
  const rings = 15;
  return (
    <svg viewBox="-90 -80 180 160" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      {Array.from({ length: rings }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-63 + i * 9}
          rx={66}
          ry={13}
          stroke={i === Math.floor(rings / 2) ? "var(--color-signal)" : "currentColor"}
          strokeWidth={1.1}
          className="why-coil"
          style={{ animationDelay: `${(i * 0.14).toFixed(2)}s` }}
        />
      ))}
    </svg>
  );
}

/** Every stage: a sphere on a dish with a dot orbiting its ring (the lifecycle). */
function Orbit() {
  const ring = "M -74 6 A 74 22 0 1 0 74 6 A 74 22 0 1 0 -74 6";
  return (
    <svg viewBox="-100 -78 200 150" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      <ellipse cx={0} cy={52} rx={80} ry={16} stroke="currentColor" strokeWidth={1.1} />
      <path d="M -80 52 v 8 A 80 16 0 0 0 80 60 v -8" stroke="currentColor" strokeWidth={1.1} />
      <circle cx={0} cy={-4} r={36} stroke="currentColor" strokeWidth={1.25} fill={CARD_BG} />
      <ellipse cx={0} cy={-4} rx={36} ry={10} stroke="currentColor" strokeWidth={0.8} strokeDasharray="3 4" />
      <g transform="rotate(-14)">
        <path d={ring} stroke="currentColor" strokeWidth={1.1} />
        <circle r={4.5} fill="var(--color-signal)">
          <animateMotion dur="6s" repeatCount="indefinite" path={ring} />
        </circle>
      </g>
    </svg>
  );
}

/** Scale: cubes growing from a booth to an expo hall. */
function Cubes() {
  return (
    <svg viewBox="-110 -110 220 170" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      <g className="why-float" style={{ animationDelay: "0s" }}>
        <IsoBox x={30} y={-70} z={0} w={20} d={20} h={20} bg={CARD_BG} />
      </g>
      <g className="why-float" style={{ animationDelay: "-1.4s" }}>
        <IsoBox x={0} y={-30} z={0} w={36} d={36} h={36} bg={CARD_BG} />
      </g>
      <g className="why-float" style={{ animationDelay: "-2.8s" }}>
        <IsoBox x={-62} y={6} z={0} w={58} d={58} h={58} bg={CARD_BG} />
      </g>
    </svg>
  );
}

/** Deploy: three steps with a dot climbing them. */
function Steps() {
  const climb = (() => {
    const p = [iso(-60, 0, 0), iso(-60, 0, 18), iso(-20, 0, 18), iso(-20, 0, 36), iso(20, 0, 36), iso(20, 0, 54), iso(60, 0, 54)];
    return "M" + p.map(([a, b]) => `${a.toFixed(1)} ${(b - 5).toFixed(1)}`).join(" L");
  })();
  return (
    <svg viewBox="-110 -95 220 125" className="h-full w-full text-text-tertiary" fill="none" aria-hidden>
      {/* painter's order: far (small x) first, near last */}
      <IsoBox x={-60} y={-30} z={0} w={40} d={60} h={18} bg={CARD_BG} />
      <IsoBox x={-20} y={-30} z={0} w={40} d={60} h={36} bg={CARD_BG} />
      <IsoBox x={20} y={-30} z={0} w={40} d={60} h={54} bg={CARD_BG} />
      <circle r={4} fill="var(--color-signal)">
        <animateMotion dur="4.8s" repeatCount="indefinite" path={climb} keyTimes="0;0.85;1" keyPoints="0;1;1" calcMode="linear" />
      </circle>
    </svg>
  );
}

/** Headline card: Event Intelligence, Real-time and Spaces as one interlocking structure. */
function Beams() {
  const bg = "#ececea";
  return (
    // Projected bounds of the three beams: x -66..139, y -156..78 (+ margin)
    <svg viewBox="-82 -172 236 264" className="h-full w-full text-neutral-900" fill="none" aria-hidden>
      <g className="why-float" style={{ animationDelay: "-2s" }}>
        <IsoBox x={-100} y={-60} z={40} w={200} d={36} h={36} bg={bg} />
      </g>
      <g className="why-float" style={{ animationDelay: "-4s" }}>
        <IsoBox x={-18} y={-18} z={-60} w={36} d={36} h={180} bg={bg} />
      </g>
      <g className="why-float" style={{ animationDelay: "0s" }}>
        <IsoBox x={20} y={-100} z={10} w={36} d={160} h={36} bg={bg} />
      </g>
    </svg>
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
}: {
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
          className="group relative flex h-full min-h-[260px] flex-col gap-4 overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated p-6 outline-none transition-colors duration-300 hover:border-border-hairline-strong focus-visible:ring-2 focus-visible:ring-border-focus-ring lg:min-h-0"
        >
          <div className="relative z-10 flex items-start justify-between gap-4">
            <h3 className="text-title-1-semibold max-w-[14ch] tracking-[-0.02em] text-text-primary">{reason.title}</h3>
            <RiArrowRightUpLine
              className="size-7 shrink-0 text-text-secondary transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
              aria-hidden
            />
          </div>
          <div className={cx("bento-visual pointer-events-none relative min-h-0 flex-1", artClassName)}>{art}</div>
          <div className="relative z-10 flex flex-col gap-3">
            <p className="text-body-regular max-w-sm leading-6 text-text-secondary">{reason.body}</p>
            {chips ? <Chips items={chips} /> : null}
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
      <Stagger
        gap={0.07}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(300px,auto)_minmax(210px,auto)_minmax(250px,auto)]"
      >
        {/* Headline card (first in DOM so it leads on mobile) */}
        <StaggerItem className="min-w-0 md:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-2">
          <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#ececea] p-6 text-neutral-950 sm:p-8 lg:flex-row lg:items-stretch lg:gap-4">
            <div className="relative z-10 flex flex-col justify-between gap-8 lg:max-w-[52%]">
              <div className="flex flex-col gap-4">
                <span className="eyebrow inline-flex items-center gap-2 text-neutral-600">
                  <span aria-hidden className="size-1.5 rounded-full bg-[#0286b0]" />
                  Why Identyca
                </span>
                <h2 className="text-section text-balance">
                  Four reasons teams <em className="font-accent">switch</em>.
                </h2>
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-lead text-pretty text-neutral-700">
                  One of the only event platforms where the return is{" "}
                  <mark className="rounded-full bg-neutral-950 px-2.5 py-0.5 text-white [box-decoration-break:clone]">
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
                    className="rounded-full px-3 py-2 text-body-medium text-neutral-800 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-neutral-900"
                  >
                    Calculate your ROI
                  </Link>
                </div>
              </div>
            </div>
            <div className="bento-visual pointer-events-none relative mt-6 h-64 min-h-0 lg:mt-0 lg:h-auto lg:flex-1">
              <Beams />
            </div>
          </div>
        </StaggerItem>

        <ReasonCard
          reason={roi}
          art={<Coil />}
          chips={["Sponsor uplift", "Renewal rates", "Cost offsets", "Lead capture", "Booth traffic", "Dwell time"]}
          className="lg:col-start-1 lg:row-span-2 lg:row-start-1"
          artClassName="min-h-40 py-2"
        />
        <ReasonCard reason={stage} art={<Orbit />} className="lg:col-start-2 lg:row-start-1" artClassName="min-h-28" />
        <ReasonCard
          reason={scale}
          art={<Cubes />}
          chips={["150 people", "50,000 people", "Same network load"]}
          className="lg:col-start-3 lg:row-start-1"
          artClassName="min-h-28"
        />
        <ReasonCard
          reason={deploy}
          art={<Steps />}
          chips={["1-day site survey", "Live in 48 h"]}
          className="md:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-3"
          artClassName="min-h-24"
        />
      </Stagger>
    </div>
  );
}
