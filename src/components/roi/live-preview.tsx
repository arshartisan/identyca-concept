"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { RiArrowRightLine, RiCheckboxCircleFill, RiFileChartLine, RiTimeLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Chip, type ChipColor } from "@/components/base/badges/chip";
import { Card } from "@/components/site/section";
import { DEMO_HREF } from "@/lib/site";
import { ndiBand, type NdiBand } from "@/lib/roi/engine";
import { fmtSignedPct } from "@/lib/roi/format";
import type { RoiResult, Tier } from "@/lib/roi/types";
import { cx } from "@/utils/cx";

const EASE = [0.22, 1, 0.36, 1] as const;

export const TIER_CHIP: Record<Tier, ChipColor> = {
  LITE: "yellow",
  CONNECT: "lime",
  VISION: "cyan",
  INSIGHT: "purple",
};

const NDI_BG: Record<NdiBand, string> = {
  moderate: "bg-status-lime-text",
  difficult: "bg-status-yellow-text",
  "very-difficult": "bg-status-orange-text",
  needle: "bg-status-rose-text",
};
const NDI_TEXT: Record<NdiBand, string> = {
  moderate: "text-status-lime-text",
  difficult: "text-status-yellow-text",
  "very-difficult": "text-status-orange-text",
  needle: "text-status-rose-text",
};

/** Crossfades a value in place (220ms fade + small blur), BoardUI number-fade. */
export function Crossfade({ value, children, className }: { value: string | number; children?: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={cx("relative inline-grid", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="col-start-1 row-start-1 tabular-nums"
          initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, filter: "blur(2px)" }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          {children ?? value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const RING_R = 32;
const RING_C = 2 * Math.PI * RING_R; // ≈ 201

function ProbabilityRing({ pct, label, caption, tone }: { pct: number; label: string; caption: string; tone: "warm" | "signal" }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative size-24">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden>
          <circle cx="40" cy="40" r={RING_R} fill="none" strokeWidth="6" className="stroke-border-hairline" />
          <motion.circle
            cx="40"
            cy="40"
            r={RING_R}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            className={tone === "warm" ? "stroke-warm" : "stroke-signal"}
            initial={false}
            animate={{ strokeDashoffset: RING_C - (Math.max(pct, 1) / 100) * RING_C }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-title-3-semibold text-text-primary">
          <Crossfade value={pct}>{pct}%</Crossfade>
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-caption-1-medium text-text-secondary">{caption}</span>
        <span className={cx("text-caption-1-semibold", tone === "warm" ? "text-warm" : "text-signal")}>
          <Crossfade value={label} />
        </span>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border-hairline pt-5">
      <h3 className="eyebrow text-text-tertiary">{title}</h3>
      {children}
    </div>
  );
}

export function LivePreview({
  result,
  onGenerate,
  sentTo,
}: {
  /** Baseline scenario result. */
  result: RoiResult;
  onGenerate: () => void;
  /** Email the report was sent to — replaces the CTA with a confirmation. */
  sentTo: string | null;
}) {
  const reduce = useReducedMotion();
  const r = result;
  const band = r.ndi !== null ? ndiBand(r.ndi) : null;
  const speedup = r.searchWith !== null && r.searchWithout > 0 ? Math.round((1 - r.searchWith / r.searchWithout) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <div aria-hidden className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60" />
      <div className="relative flex flex-col gap-5 p-5 sm:p-7">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-2 text-headline-medium text-text-primary">
              <span className="relative flex size-2">
                <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-positive" />
                <span className="relative size-2 rounded-full bg-positive" />
              </span>
              Live Preview
            </span>
            <span className="text-caption-1-medium text-text-tertiary">Updates as you type · Full report delivered by email</span>
          </div>
        </header>

        <div className="flex items-center justify-between gap-3">
          <span className="text-body-medium text-text-secondary">Recommended tier</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={r.tier}
              initial={reduce ? false : { opacity: 0, scale: 0.95, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.95, filter: "blur(2px)" }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <Chip color={TIER_CHIP[r.tier]} variant="subtle" className="rounded-full px-3 text-headline-medium">
                {r.tierDisplayName}
              </Chip>
            </motion.span>
          </AnimatePresence>
        </div>

        {r.hasRealtime && r.ndi !== null && band ? (
          <Block title="Networking Difficulty Index">
            <div className="flex items-baseline justify-between gap-3">
              <span className={cx("text-headline-medium", NDI_TEXT[band])}>
                <Crossfade value={`${r.ndiLabel} (${r.ndi})`} />
              </span>
              <span className="font-mono text-caption-1-medium text-text-tertiary">/ 100</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-background-sunken">
              <motion.div
                className={cx("absolute inset-y-0 start-0 rounded-full transition-colors duration-200", NDI_BG[band])}
                initial={false}
                animate={{ width: `${Math.min(r.ndi, 100)}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              />
            </div>
            <div className="flex justify-between font-mono text-caption-1-medium text-text-tertiary" aria-hidden>
              <span>0</span>
              <span>30</span>
              <span>60</span>
              <span>100</span>
            </div>
          </Block>
        ) : null}

        {r.hasRealtime && r.searchWith !== null && r.pFindWith !== null ? (
          <>
            <Block title="Time to find a specific person">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 rounded-2xl bg-background-sunken p-3.5">
                  <span className="text-caption-1-medium text-text-secondary">Without Identyca</span>
                  <span className="text-title-2-semibold text-text-primary">
                    <Crossfade value={r.searchWithout}>~{r.searchWithout} min</Crossfade>
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl bg-signal-soft p-3.5">
                  <span className="text-caption-1-medium text-text-secondary">With Identyca</span>
                  <span className="text-title-2-semibold text-signal">
                    <Crossfade value={r.searchWith}>~{r.searchWith} min</Crossfade>
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-caption-1-medium text-positive">
                <RiTimeLine className="size-4" aria-hidden />
                <Crossfade value={speedup}>{speedup}% faster per day</Crossfade>
              </span>
            </Block>
            <Block title="Probability of finding someone">
              <div className="grid grid-cols-2 gap-2">
                <ProbabilityRing pct={r.pFindWithout} label={r.pFindWithoutLabel} caption="Without Identyca" tone="warm" />
                <ProbabilityRing pct={r.pFindWith} label={r.pFindWithLabel} caption="With Identyca" tone="signal" />
              </div>
            </Block>
          </>
        ) : (
          <div className="rounded-2xl bg-warm-soft p-4 text-body-regular text-text-primary">
            Lite uses NFC badges - no real-time networking, so no search-time or probability-of-finding estimate.
          </div>
        )}

        <div className="flex flex-col gap-1 rounded-2xl border border-border-hairline bg-background-full p-5">
          <span className="eyebrow text-text-tertiary">Estimated baseline ROI</span>
          <span className="text-stat text-text-primary">
            <Crossfade value={Math.round(r.roi)}>{fmtSignedPct(r.roi)}</Crossfade>
          </span>
          <span className="text-caption-1-medium text-text-secondary">Per event, baseline scenario</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {sentTo ? (
            <motion.div
              key="sent"
              initial={reduce ? false : { opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-col gap-3 rounded-2xl bg-signal-soft p-5"
              role="status"
            >
              <span className="inline-flex items-center gap-2 text-headline-medium text-text-primary">
                <RiCheckboxCircleFill className="size-5 text-positive" aria-hidden />
                Your ROI Report is on its way!
              </span>
              <p className="text-body-regular text-text-secondary">
                Check your inbox at <strong className="text-text-primary break-all">{sentTo}</strong>. If you don&apos;t see it within 5
                minutes, check your spam folder.
              </p>
              <Link href={DEMO_HREF} className="inline-flex items-center gap-1 text-body-medium text-signal underline-offset-4 hover:underline">
                Want to discuss your results? Book a Demo
                <RiArrowRightLine className="size-4" aria-hidden />
              </Link>
            </motion.div>
          ) : (
            <motion.div key="cta" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="flex flex-col gap-2">
              <Button onClick={onGenerate} leadingIcon={RiFileChartLine} className="h-12 w-full rounded-full text-headline-medium">
                Generate my ROI report
              </Button>
              <p className="text-center text-caption-1-medium text-text-tertiary">
                Your custom report will be delivered by email within minutes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
