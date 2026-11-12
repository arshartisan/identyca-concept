"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { RiBrainLine, RiBuilding2Line, RiFocus3Line, RiGlassesLine } from "@remixicon/react";
import { cx } from "@/utils/cx";
import { Reveal } from "@/components/site/motion";

export type Milestone = {
  title: string;
  body: string;
  tag: string;
  icon: keyof typeof ICONS;
};

const ICONS = {
  ar: RiGlassesLine,
  target: RiFocus3Line,
  venue: RiBuilding2Line,
  ai: RiBrainLine,
};

/**
 * Roadmap timeline. A hairline spine runs down the page (left on mobile,
 * centred on desktop) and a signal-coloured line draws along it as you scroll.
 */
export function VisionTimeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative flex flex-col gap-14 sm:gap-20">
      {/* spine */}
      <span aria-hidden className="absolute start-[19px] top-2 bottom-2 w-px bg-border-hairline-strong lg:start-1/2 lg:-translate-x-1/2" />
      <span aria-hidden className="absolute start-[19px] top-2 bottom-2 w-px lg:start-1/2 lg:-translate-x-1/2">
        <motion.span className="block h-full w-full origin-top bg-signal" style={{ scaleY: reduce ? 1 : progress }} />
      </span>

      {items.map((m, i) => {
        const right = i % 2 === 1;
        const Icon = ICONS[m.icon];
        return (
          <li key={m.title} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] lg:gap-10">
            {/* node */}
            <div className="relative flex justify-center lg:col-start-2 lg:row-start-1">
              <span className="relative mt-1 flex size-10 items-center justify-center rounded-full border border-border-hairline-strong bg-background-full lg:size-14">
                <span aria-hidden className="absolute inset-1.5 rounded-full bg-signal-soft" />
                <span className="relative font-mono text-caption-1-medium text-signal tabular-nums lg:text-body-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
            </div>

            {/* card */}
            <Reveal
              className={cx(
                "lg:row-start-1",
                right ? "lg:col-start-3" : "lg:col-start-1 lg:text-end",
              )}
            >
              <div className={cx("flex flex-col gap-4 pt-1 lg:pt-3", !right && "lg:items-end")}>
                <span className="inline-flex items-center gap-2 rounded-full bg-signal-soft px-3 py-1 text-caption-1-medium text-signal">
                  <Icon aria-hidden className="size-3.5" />
                  {m.tag}
                </span>
                <h3 className="text-subsection text-balance text-text-primary">{m.title}</h3>
                <p className="max-w-md text-lead text-pretty text-text-secondary">{m.body}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
