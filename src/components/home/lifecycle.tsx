"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { useRef } from "react";
import { Accent, Container, Section, SectionHeading } from "@/components/site/section";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { cx } from "@/utils/cx";

const PHASES = [
  {
    phase: "Pre-event",
    stages: [
      {
        title: "Event brief",
        body: "Define goals, target audience and key metrics. Event Intelligence generates your planning canvas.",
        product: "Event Intelligence",
      },
      {
        title: "Sponsor, speaker, venue & price sourcing",
        body: "AI-matched shortlists for sponsors, speakers, venues and pricing benchmarks — all fit-scored against your brief.",
        product: "Event Intelligence",
      },
    ],
  },
  {
    phase: "Event day",
    stages: [
      {
        title: "Registration & badging",
        body: "Smart badge issuance, delegate registration and real-time check-in — all in one system.",
        product: "Real-time",
      },
      {
        title: "Live networking",
        body: "Real-time identity overlay, proximity radar, smart filtering and automated connection logging.",
        product: "Real-time",
      },
    ],
  },
  {
    phase: "Venue layer",
    stages: [
      {
        title: "Wayfinding & crowd intelligence",
        body: "Indoor navigation, zone occupancy, F&B queue alerts and gamification — powered by permanent beacons.",
        product: "Spaces",
      },
    ],
  },
  {
    phase: "Post-event",
    stages: [
      {
        title: "Analytics & ROI",
        body: "Attendee journey maps, booth dwell time, networking density, sponsor ROI reports and retention data.",
        product: "Real-time",
      },
    ],
  },
];

const productTone: Record<string, string> = {
  "Event Intelligence": "bg-positive",
  "Real-time": "bg-signal",
  Spaces: "bg-warm",
};

export function Lifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <Section tone="sunken" id="lifecycle">
      <Container>
        <SectionHeading
          eyebrow="Full event lifecycle"
          title={
            <>
              From first planning call to <Accent>post-event</Accent> analytics.
            </>
          }
          lead="Identyca is the only platform that covers every stage — before, during and after your event."
        />

        <div ref={ref} className="relative mt-16">
          {/* progress rail: horizontal on desktop, vertical on mobile */}
          <div aria-hidden className="absolute start-[7px] top-2 bottom-2 w-px bg-border-hairline-strong lg:start-0 lg:end-0 lg:top-[7px] lg:bottom-auto lg:h-px lg:w-auto" />
          <motion.div
            aria-hidden
            style={reduce ? undefined : { scaleY: progress }}
            className="absolute start-[7px] top-2 bottom-2 w-px origin-top bg-signal lg:hidden"
          />
          <motion.div
            aria-hidden
            style={reduce ? undefined : { scaleX: progress }}
            className="absolute start-0 end-0 top-[7px] hidden h-px origin-left bg-signal lg:block"
          />

          <Stagger className="grid gap-10 lg:grid-cols-4 lg:gap-6" gap={0.12}>
            {PHASES.map((p) => (
              <StaggerItem key={p.phase} className="relative ps-8 lg:ps-0 lg:pt-10">
                <span aria-hidden className="absolute start-0 top-0 flex size-[15px] items-center justify-center rounded-full border border-border-hairline-strong bg-background-sunken lg:top-0">
                  <span className="size-[5px] rounded-full bg-signal" />
                </span>
                <p className="eyebrow mb-4 text-text-secondary lg:mb-5">{p.phase}</p>
                <div className="flex flex-col gap-3">
                  {p.stages.map((s) => (
                    <div key={s.title} className="rounded-2xl border border-border-hairline bg-background-elevated p-5">
                      <h3 className="text-headline-semibold text-text-primary">{s.title}</h3>
                      <p className="mt-2 text-body-regular text-text-secondary">{s.body}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-caption-1-medium text-text-tertiary">
                        <span className={cx("size-1.5 rounded-full", productTone[s.product])} />
                        {s.product}
                      </span>
                    </div>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
