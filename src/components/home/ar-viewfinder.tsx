"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { useEffect, useState } from "react";
import { cx } from "@/utils/cx";
import { EASE } from "@/components/site/motion";

/**
 * Illustrative AR view: a conference floor seen through Identyca glasses.
 * Silhouettes sit at depth; identity tags lock onto opted-in attendees in turn.
 * Rendered as a `.dark` island so it reads as "the lens" on either theme.
 */

type Person = {
  x: number; // % from left
  y: number; // % from top (feet)
  s: number; // scale (depth)
  tag?: { name: string; role: string; match: number; tone: "signal" | "warm" | "positive"; side?: "left" | "right" };
};

const PEOPLE: Person[] = [
  { x: 9, y: 70, s: 0.62 },
  { x: 19, y: 92, s: 1.05, tag: { name: "Sarah Chen", role: "VP Business Development · Pfizer", match: 94, tone: "signal", side: "right" } },
  { x: 31, y: 66, s: 0.55 },
  { x: 41, y: 74, s: 0.72 },
  { x: 52, y: 64, s: 0.5, tag: { name: "Marcus Webb", role: "Head of Procurement · Siemens", match: 87, tone: "warm", side: "right" } },
  { x: 61, y: 86, s: 0.92 },
  { x: 72, y: 68, s: 0.6 },
  { x: 83, y: 94, s: 1.1, tag: { name: "Priya Nair", role: "CTO · TechVentures", match: 79, tone: "positive", side: "left" } },
  { x: 92, y: 72, s: 0.66 },
];

const TAGGED = PEOPLE.map((p, i) => (p.tag ? i : -1)).filter((i) => i >= 0);

const toneDot = { signal: "bg-signal", warm: "bg-warm", positive: "bg-positive" } as const;
const toneText = { signal: "text-signal", warm: "text-warm", positive: "text-positive" } as const;

export function ArViewfinder({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % TAGGED.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    const t = setTimeout(() => setLocked((l) => (l.includes(TAGGED[active]) ? l : [...l, TAGGED[active]])), 500);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div
      className={cx(
        "dark relative isolate aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-background-full sm:aspect-[16/10] sm:rounded-[28px] md:aspect-[16/9]",
        "ring-1 ring-border-hairline-strong shadow-[0_40px_120px_-40px_rgb(0_0_0/0.55)]",
        className,
      )}
      role="img"
      aria-label="Illustration: through AR glasses, identity cards appear above opted-in attendees on a conference floor."
    >
      {/* Room */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--color-signal)_18%,transparent),transparent_60%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] [perspective:600px]">
        <div className="bg-grid absolute inset-0 origin-top [transform:rotateX(62deg)_scale(1.6)] opacity-70 [background-size:44px_44px]" />
      </div>
      <div aria-hidden className="absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {/* Booth hints */}
      <div aria-hidden className="absolute start-[6%] top-[22%] h-[18%] w-[22%] rounded-md border border-white/5 bg-white/[0.025]" />
      <div aria-hidden className="absolute end-[8%] top-[18%] h-[22%] w-[26%] rounded-md border border-white/5 bg-white/[0.025]" />
      <div aria-hidden className="absolute start-[40%] top-[26%] h-[12%] w-[18%] rounded-md border border-white/5 bg-white/[0.02]" />

      {/* People */}
      {PEOPLE.map((p, i) => {
        const isTagged = !!p.tag;
        const isActive = TAGGED[active] === i;
        const isLocked = reduce || locked.includes(i);
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -100%) scale(${p.s})`, transformOrigin: "bottom center", zIndex: Math.round(p.y) }}
          >
            <Silhouette highlighted={isTagged && isLocked} />
            {isTagged && isLocked ? (
              <span aria-hidden className="absolute start-1/2 top-[28%] -translate-x-1/2">
                <span className={cx("absolute -inset-3 rounded-full opacity-60 animate-pulse-ring", toneDot[p.tag!.tone])} />
              </span>
            ) : null}
            {isTagged ? (
              <div
                className={cx(
                  "absolute bottom-[104%] w-max transition-opacity duration-300",
                  p.tag!.side === "left" ? "end-[40%]" : "start-[40%]",
                  // phones: only the active tag, so labels never collide
                  !isActive && "max-sm:opacity-0",
                )}
                style={{
                  transform: `scale(${1 / p.s})`,
                  transformOrigin: p.tag!.side === "left" ? "bottom right" : "bottom left",
                }}
              >
                <AnimatePresence>
                  {isLocked ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92, filter: "blur(4px)" }}
                      animate={{ opacity: isActive || reduce ? 1 : 0.72, y: 0, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{ transformOrigin: p.tag!.side === "left" ? "bottom right" : "bottom left" }}
                    >
                      <IdentityTag {...p.tag!} active={isActive} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Lens chrome */}
      <Corners />
      <div aria-hidden className="absolute start-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 py-1 ps-1.5 pe-3 backdrop-blur-md sm:start-5 sm:top-5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-positive" />
        </span>
        <span className="eyebrow text-[10px] text-text-secondary">AR view · Live</span>
      </div>
      <Radar className="absolute end-4 top-4 hidden size-24 sm:end-5 sm:top-5 sm:block md:size-28" />
      <div aria-hidden className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:bottom-5">
        <span className="eyebrow rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-text-secondary backdrop-blur-md">
          Nearby 47 · Matches {9 + locked.length}
        </span>
        <span className="eyebrow hidden rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-text-secondary backdrop-blur-md sm:inline">
          Filter VP+ · Tech
        </span>
      </div>
    </div>
  );
}

function Silhouette({ highlighted }: { highlighted: boolean }) {
  return (
    <svg width="44" height="110" viewBox="0 0 44 110" aria-hidden className="block">
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(255 255 255 / 0.22)" />
          <stop offset="1" stopColor="rgb(255 255 255 / 0.04)" />
        </linearGradient>
        <linearGradient id="sil-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(147 197 253 / 0.65)" />
          <stop offset="1" stopColor="rgb(147 197 253 / 0.08)" />
        </linearGradient>
      </defs>
      <g fill={highlighted ? "url(#sil-hi)" : "url(#sil)"} style={{ transition: "fill 300ms ease" }}>
        <circle cx="22" cy="12" r="10" />
        <path d="M6 36c0-7 7-12 16-12s16 5 16 12v30c0 3-2 5-5 5h-1v34c0 3-2 5-5 5h-10c-3 0-5-2-5-5V71h-1c-3 0-5-2-5-5V36Z" />
      </g>
    </svg>
  );
}

function IdentityTag({
  name,
  role,
  match,
  tone,
  active,
}: {
  name: string;
  role: string;
  match: number;
  tone: "signal" | "warm" | "positive";
  active: boolean;
}) {
  return (
    <div
      className={cx(
        "flex items-center gap-2.5 rounded-2xl border bg-black/80 py-2 ps-2 pe-3 backdrop-blur-xl transition-colors duration-300",
        active ? "border-white/25" : "border-white/10",
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-caption-1-semibold text-text-primary">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </span>
      <span className="flex flex-col">
        <span className="text-caption-1-semibold text-text-primary sm:text-body-medium">{name}</span>
        <span className="text-caption-2-medium text-text-secondary sm:text-caption-1-medium">{role}</span>
      </span>
      <span className={cx("ms-1 flex flex-col items-end", toneText[tone])}>
        <span className="text-body-semibold tabular-nums">{match}%</span>
        <span className="text-caption-2-medium opacity-70">match</span>
      </span>
    </div>
  );
}

function Corners() {
  const c = "absolute size-6 border-white/30 sm:size-8";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 sm:inset-4">
      <span className={cx(c, "start-0 top-0 rounded-tl-xl border-s border-t")} />
      <span className={cx(c, "end-0 top-0 rounded-tr-xl border-e border-t")} />
      <span className={cx(c, "start-0 bottom-0 rounded-bl-xl border-s border-b")} />
      <span className={cx(c, "end-0 bottom-0 rounded-br-xl border-e border-b")} />
    </div>
  );
}

function Radar({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("overflow-hidden rounded-full border border-white/10 bg-black/40 backdrop-blur-md", className)}>
      <div className="absolute inset-[18%] rounded-full border border-white/10" />
      <div className="absolute inset-[36%] rounded-full border border-white/10" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      <div className="absolute inset-y-0 start-1/2 w-px bg-white/10" />
      <div className="absolute inset-0 animate-sweep rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(96_165_250/0.45)_40deg,transparent_70deg)]" />
      <span className="absolute start-[30%] top-[62%] size-1.5 rounded-full bg-signal" />
      <span className="absolute start-[64%] top-[34%] size-1.5 rounded-full bg-warm" />
      <span className="absolute start-[72%] top-[70%] size-1.5 rounded-full bg-positive" />
      <span className="absolute start-1/2 top-1/2 size-1.5 -translate-1/2 rounded-full bg-white" />
    </div>
  );
}
