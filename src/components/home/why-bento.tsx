"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { RiArrowRightUpLine, RiBroadcastLine, RiCheckLine, RiLayoutGridLine, RiRadarLine } from "@remixicon/react";
import { Cta } from "@/components/site/cta";
import { Accent, SectionHeading } from "@/components/site/section";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";
import { cx } from "@/utils/cx";

/**
 * "Why Identyca": four reasons as a bento of flat, edge-bleeding illustrations
 * (ROI calculator phone, big scale stat, deploy dial, lifecycle flow).
 * Loops pause off-screen (`bento-paused`) and stop under reduced motion
 * (`bento-visual`). `data-shot` marks close-up targets for the showcase recorder.
 */

export type Reason = { title: string; body: string; link: { label: string; href: string } };

// Flat greys for the illustrations, stepped up from the card surface.
const G1 = "bg-[#1d1d21]";
const G2 = "bg-[#26262b]";
const G3 = "bg-[#323238]";
const LINE = "border-[#3a3a41]";

/* ---------------------------------------------------------------- card */

function Card({
  href,
  shot,
  className,
  children,
  label,
}: {
  href: string;
  shot?: string;
  className?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <StaggerItem className={cx("min-w-0", className)}>
      <BorderGlow className="h-full">
        <Link
          href={href}
          data-shot={shot}
          aria-label={label}
          className="group relative isolate block h-full overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated outline-none transition-colors duration-300 hover:border-border-hairline-strong focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {children}
          <RiArrowRightUpLine
            aria-hidden
            className="absolute end-5 top-5 z-20 size-5 text-text-tertiary opacity-0 transition-all duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal group-hover:opacity-100"
          />
        </Link>
      </BorderGlow>
    </StaggerItem>
  );
}

/* ----------------------------------------------------- 1. ROI phone */

function SliderRow({ label, fill, live = false }: { label: string; fill: number; live?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] tracking-[0.12em] text-text-tertiary uppercase">{label}</span>
      <div className={cx("relative h-2 rounded-full", G3)}>
        <div
          className={cx("absolute inset-y-0 start-0 w-full origin-left rounded-full", live ? "why2-fill bg-signal" : "bg-[#4a4a52]")}
          style={live ? undefined : { transform: `scaleX(${fill})` }}
        />
        <div
          className={cx("absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-[#ececec] shadow-[0_2px_8px_rgb(0_0_0/0.5)]", live && "why2-knob")}
          style={live ? undefined : { left: `calc(${fill * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
}

function RoiPhone() {
  return (
    <div aria-hidden className="bento-visual pointer-events-none absolute inset-0">
      {/* guide rail with nodes */}
      <div className={cx("absolute start-[13%] top-[44%] bottom-0 w-px border-s", LINE)} />
      <div className={cx("absolute start-[13%] top-[60%] size-10 -translate-x-1/2 rounded-full", G2)} />
      <div className={cx("absolute start-[13%] top-[90%] size-10 -translate-x-1/2 rounded-full", G2)} />
      {/* phone, bleeding off the right and bottom */}
      <div className={cx("absolute start-[24%] top-[38%] -end-[18%] -bottom-[14%] rounded-[44px] border-[3px] p-6 pt-16", LINE, G1)}>
        <div className={cx("absolute end-[30%] top-5 h-7 w-28 rounded-full", G2)} />
        <div className="flex max-w-[260px] flex-col gap-5">
          <SliderRow label="Sponsors" fill={0.62} />
          <SliderRow label="Ticket price" fill={0.4} />
          <SliderRow label="Attendees" fill={0.5} live />
          <div className={cx("mt-2 flex flex-col gap-1 rounded-2xl p-4", G2)}>
            <span className="font-mono text-[10px] tracking-[0.12em] text-text-tertiary uppercase">Projected ROI</span>
            <span className="inline-flex items-center gap-1.5 text-title-3-semibold text-text-primary">
              <RiArrowRightUpLine className="size-5 shrink-0 text-signal" />
              Before sign-up
            </span>
          </div>
        </div>
      </div>
      {/* cursor dragging the live slider */}
      <svg viewBox="0 0 40 40" className="why2-cursor absolute start-[16%] top-[66%] size-12 drop-shadow-[0_6px_14px_rgb(0_0_0/0.6)]">
        <path d="M6 4 L34 17 L20 21 L14 35 Z" fill="#d9d9de" stroke="#0a0a0b" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------- 2. Scale stat */

function ScalePills() {
  return (
    <div aria-hidden className="bento-visual pointer-events-none absolute inset-x-0 top-6">
      <div className={cx("relative -start-6 flex h-12 w-[88%] items-center justify-end gap-2 rounded-full pe-1.5", G3)}>
        <span className="why2-beacon size-3 rounded-full bg-[#56565e]" style={{ animationDelay: "0s" }} />
        <span className="why2-beacon size-5 rounded-full bg-[#56565e]" style={{ animationDelay: "0.25s" }} />
        <span className="why2-beacon size-9 rounded-full bg-[#56565e]" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className={cx("relative -start-6 mt-3 flex h-12 w-[34%] items-center justify-end rounded-full pe-1.5", G3)}>
        <span className="why2-beacon size-9 rounded-full bg-[#56565e]" style={{ animationDelay: "0.75s" }} />
      </div>
    </div>
  );
}

/* --------------------------------------------------- 3. Deploy dial */

function DeployDial() {
  const ticks = Array.from({ length: 11 }, (_, i) => -75 + i * 15);
  return (
    <div aria-hidden className="bento-visual pointer-events-none absolute inset-0">
      {/* dial, mostly above the card: only its lower arc shows */}
      <div className={cx("absolute start-1/2 -top-[120%] aspect-square w-[150%] -translate-x-1/2 rounded-full", G2)}>
        {ticks.map((a) => (
          <span key={a} className="absolute start-1/2 top-1/2 h-1/2 w-0.5 origin-top" style={{ transform: `rotate(${a}deg)` }}>
            <span className={cx("absolute bottom-3 start-0 h-5 w-0.5 rounded-full", a === 0 ? "bg-signal" : "bg-[#4a4a52]")} />
          </span>
        ))}
      </div>
      {/* pendulum: line from the top holding a device with a check */}
      <div className="why2-swing absolute start-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
        <span className={cx("size-4 -translate-y-1/2 rounded-full border-2 bg-background-elevated", LINE)} />
        <span className="h-24 w-0.5 bg-[#4a4a52]" />
        <span className={cx("relative flex h-20 w-14 items-center justify-center rounded-xl border-2", LINE, G3)}>
          <span className="absolute top-2 h-1 w-6 rounded-full bg-[#56565e]" />
          <RiCheckLine className="size-7 text-signal" />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------ 4. Lifecycle flow */

function LifecycleFlow() {
  // Kept in the lower part of the card (y >= 175 of 320) so it never runs under the text block.
  const track = "M -20 318 C 150 232, 430 178, 760 196";
  return (
    <div aria-hidden className="bento-visual pointer-events-none absolute inset-0">
      <svg viewBox="0 0 720 320" preserveAspectRatio="xMinYMax slice" className="absolute inset-0 size-full">
        <path d={track} fill="none" stroke="#26262b" strokeWidth={56} strokeLinecap="round" />
        <path d={track} fill="none" stroke="#4a4a52" strokeWidth={3} strokeDasharray="10 14" strokeLinecap="round" className="why2-lane" />
        <g>
          <path d="M0 0 L22 9 L12 12 L8 22 Z" fill="#d9d9de" stroke="#0a0a0b" strokeWidth={1.2} strokeLinejoin="round" transform="translate(-10 -10)" />
          <animateMotion dur="5s" repeatCount="indefinite" path={track} keyTimes="0;0.85;1" keyPoints="0.12;0.72;0.72" calcMode="linear" />
        </g>
      </svg>
      {/* Event Intelligence: tilted planning tile with frame handles */}
      <div className={cx("absolute -bottom-6 start-[3%] flex h-40 w-36 -rotate-12 items-center justify-center rounded-2xl border-2", LINE, G3)}>
        <RiRadarLine className="size-14 text-signal" />
        {["-start-2.5 -top-2.5", "-end-2.5 -top-2.5", "-end-2.5 -bottom-2.5"].map((pos) => (
          <span key={pos} className={cx("absolute size-5 rounded-full border-2 bg-background-elevated", LINE, pos)} />
        ))}
      </div>
      {/* Real-time: phone */}
      <div className={cx("absolute -bottom-10 end-[22%] flex h-48 w-28 rotate-6 flex-col items-center rounded-[26px] border-2 pt-3", LINE, G2)}>
        <span className="h-1.5 w-10 rounded-full bg-[#4a4a52]" />
        <RiBroadcastLine className="mt-10 size-12 text-warm" />
      </div>
      {/* Spaces: venue screen, bleeding off the corner */}
      <div className={cx("absolute -bottom-12 -end-6 flex h-56 w-44 -rotate-3 flex-col items-center rounded-[30px] border-2 pt-4", LINE, G3)}>
        <span className="h-2 w-14 rounded-full bg-[#56565e]" />
        <RiLayoutGridLine className="mt-12 size-16 text-text-primary" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- grid */

export function WhyBento({ reasons, demoHref }: { reasons: Reason[]; demoHref: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.05 });
  const [roi, stage, scale, deploy] = reasons;

  return (
    <div ref={ref} className={cx("flex flex-col gap-12 sm:gap-14", !active && "bento-paused")}>
      <div className="flex flex-col items-center gap-7">
        <SectionHeading
          align="center"
          eyebrow="Why Identyca"
          title={
            <>
              Four reasons teams <Accent>switch</Accent>.
            </>
          }
          lead="One of the only event platforms where the return is calculable before sign-up - across the whole event lifecycle."
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Cta href={demoHref} trailingIcon={RiArrowRightUpLine}>
            Book a demo
          </Cta>
          <Cta href="/roi-calculator" variant="secondary">
            Calculate your ROI
          </Cta>
        </div>
      </div>

      <Stagger gap={0.07} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[0.95fr_1.15fr_0.9fr] lg:grid-rows-[300px_320px]">
        {/* 1. ROI: tall left card */}
        <Card href={roi.link.href} label={`${roi.title} - ${roi.link.label}`} shot="why-roi" className="h-[540px] md:row-span-2 md:h-auto lg:row-span-2">
          <div className="relative z-10 flex flex-col gap-2 p-7">
            <h3 className="max-w-[15ch] text-title-1-semibold tracking-[-0.02em] text-text-primary">{roi.title}</h3>
            <p className="max-w-[34ch] text-body-regular text-text-secondary">
              Model sponsor uplift, renewals and cost offsets for your event - the return is known before you sign.
            </p>
          </div>
          <RoiPhone />
        </Card>

        {/* 2. Scale: big stat */}
        <Card href={scale.link.href} label={`${scale.title} - ${scale.link.label}`} className="h-[300px] md:h-auto">
          <ScalePills />
          <div className="absolute inset-x-7 bottom-7 z-10 flex flex-col gap-2">
            <span className="text-[clamp(4rem,3rem+3vw,5.75rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-text-primary">50K</span>
            <span className="max-w-[32ch] text-body-regular text-text-secondary">
              People on one beacon network - the same network load as 500. {scale.title}.
            </span>
          </div>
        </Card>

        {/* 3. Deploy: dial */}
        <Card href={deploy.link.href} label={`${deploy.title} - ${deploy.link.label}`} className="h-[300px] md:h-auto">
          <DeployDial />
          <div className="absolute inset-x-7 bottom-7 z-10 flex flex-col gap-1">
            <h3 className="text-title-1-semibold tracking-[-0.02em] text-text-primary">Live in 48 hours</h3>
            <span className="text-body-regular text-text-secondary">{deploy.title} - one site-survey day, no cabling.</span>
          </div>
        </Card>

        {/* 4. Every stage: wide flow card */}
        <Card
          href={stage.link.href}
          label={`${stage.title} - ${stage.link.label}`}
          shot="why-stage"
          className="h-[400px] md:col-span-2 md:h-[340px] lg:col-start-2 lg:h-auto"
        >
          <div className="relative z-10 flex max-w-md flex-col gap-2 p-7">
            <h3 className="text-title-1-semibold tracking-[-0.02em] text-text-primary">{stage.title}</h3>
            <p className="text-body-regular text-text-secondary">
              Plan with Event Intelligence, run the floor with Real-time, keep the venue live with Spaces - on one data model.
            </p>
          </div>
          <LifecycleFlow />
        </Card>
      </Stagger>
    </div>
  );
}
