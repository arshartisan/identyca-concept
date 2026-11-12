"use client";

import { motion, useInView, useMotionValue, useSpring, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * Scroll-reveal primitives following BoardUI's motion language:
 * fade + slight rise + small blur, decelerating on cubic-bezier(0.22, 1, 0.36, 1).
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

// Reduced motion is handled globally by <MotionConfig reducedMotion="user"> (MotionProvider):
// never branch render output on the preference here, or post-hydration flips freeze elements.
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

type Tag = "div" | "section" | "li" | "ul" | "ol" | "span" | "h1" | "h2" | "h3" | "p" | "article" | "figure";

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
  amount?: number;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      custom={delay}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </Comp>
  );
}

/** Parent that staggers its <StaggerItem> children into view. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = "div",
  amount = "some",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: Tag;
  /**
   * Defaults to "some" (any pixel), not a fraction: grids stack into very tall
   * columns on phones (the bento is ~3000px), so a fractional threshold left
   * visitors scrolling through empty space. The bottom margin still makes the
   * stagger play inside the viewport rather than below the fold.
   */
  amount?: number | "some" | "all";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={revealVariants}>
      {children}
    </Comp>
  );
}

/** Word-by-word headline reveal. Wrap accent words with <em> via `accent` indices. */
export function SplitWords({
  text,
  className,
  accent = [],
  delay = 0,
}: {
  text: string;
  className?: string;
  accent?: number[];
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={cx("inline-block", accent.includes(i) && "font-accent pe-[0.06em]")}
            initial={{ y: "105%", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.055 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

/** Counts up to `value` once in view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => spring.on("change", (v) => setDisplay(v)), [spring]);

  const formatted = (reduce ? value : display).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
