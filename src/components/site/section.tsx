import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import { Reveal } from "./motion";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

/**
 * Page section. `tone="ink"` renders a dark band by scoping BoardUI's `.dark`
 * tokens to the section - no hard-coded colours needed.
 */
export function Section({
  children,
  className,
  id,
  tone = "paper",
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "paper" | "sunken" | "ink";
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cx(
        "relative",
        tone === "ink" && "dark bg-background-full text-text-primary",
        tone === "sunken" && "bg-background-sunken",
        !bleed && "py-24 sm:py-32",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("eyebrow inline-flex items-center gap-2 text-text-secondary", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-signal" />
      {children}
    </span>
  );
}

/** Standard section heading block: eyebrow, title (ReactNode for serif accents), lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as: H = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <H className={cx(H === "h1" ? "text-hero" : "text-section", "text-balance text-text-primary")}>{title}</H>
      </Reveal>
      {lead ? (
        <Reveal delay={0.1}>
          <p className="text-lead max-w-2xl text-pretty text-text-secondary">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Accent word for headlines (sans, inherits the headline style). */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <em className={cx("font-accent", className)}>{children}</em>;
}

/** Hairline-bordered surface card with the cursor-tracking edge glow (`glow={false}` for form panels). */
export function Card({ children, className, glow = true }: { children: ReactNode; className?: string; glow?: boolean }) {
  const card = (
    <div
      className={cx(
        "relative rounded-3xl border border-border-hairline bg-background-elevated",
        "shadow-[0_1px_0_0_rgb(0_0_0/0.02),0_12px_32px_-16px_rgb(0_0_0/0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
  if (!glow) return card;
  // The wrapper owns the grid cell, so it must stretch whenever the card does.
  return <BorderGlow className={cx(/h-full/.test(className ?? "") && "h-full")}>{card}</BorderGlow>;
}
