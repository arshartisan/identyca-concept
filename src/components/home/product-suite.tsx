"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import type { ReactNode } from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { Accent, Container, Section, SectionHeading } from "@/components/site/section";
import { Stagger, StaggerItem, EASE } from "@/components/site/motion";
import { cx } from "@/utils/cx";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";

type Product = {
  key: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  visual: ReactNode;
  isNew?: boolean;
};

const PRODUCTS: Product[] = [
  {
    key: "rt",
    name: "Real-time",
    tagline: "See who matters. Connect instantly.",
    description: "Real-time identity overlay and smart badge networking: hands-free, on the event floor.",
    bullets: [
      "Real-time mapping of every attendee - name, title, company",
      "<1 m spatial positioning of people and equipment via smart sensor badges",
      "Live proximity radar, smart filtering and automatic interaction logging",
    ],
    href: "/real-time",
    cta: "Explore Real-time",
    visual: <RealtimeVisual />,
  },
  {
    key: "ei",
    name: "Event Intelligence",
    tagline: "See who matters. Plan what wins.",
    description:
      "AI-native planning workspace for organizers and prospecting engine for event vendors - powered by a live global events graph.",
    bullets: [
      "Sponsor, speaker, venue, agenda, pricing and date intelligence in one workspace",
      "AI-matched recommendations from a proprietary global events graph",
      "Vendor discovery feed for AV companies, agencies, hotels and service providers",
    ],
    href: "/event-intelligence",
    cta: "Explore Event Intelligence",
    visual: <SignalMapVisual />,
  },
  {
    key: "sp",
    name: "Spaces",
    tagline: "See your whole venue. Sell every event.",
    description:
      "The badge-less networking, wayfinding and experience layer installed permanently in your venue - licensed to you, resold by you into every event you host.",
    bullets: [
      "Turns smartphones into their own tracker - no badges, no per-event hardware",
      "Networking, indoor wayfinding, find-my-group, gamification and crowd intelligence",
      "One-time beacon install, one annual licence, resold into every event",
    ],
    href: "/spaces",
    cta: "Explore Spaces",
    visual: <VenueVisual />,
    isNew: true,
  },
];

export function ProductSuite() {
  return (
    <Section id="products">
      <Container>
        <SectionHeading
          eyebrow="One ecosystem. Three products."
          title={
            <>
              From the planning table to the <Accent>event floor</Accent>.
            </>
          }
          lead="Real-time, Event Intelligence and Spaces interoperate on one data model - run one, or run the whole lifecycle."
        />
        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3" gap={0.1}>
          {PRODUCTS.map((p) => (
            <StaggerItem key={p.key} className="h-full">
              <BorderGlow className="h-full transition-transform duration-300 ease-out hover:-translate-y-1">
              <Link
                href={p.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated outline-none transition-[border-color,box-shadow] duration-300 ease-out hover:border-border-hairline-strong hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <div data-shot={`product-${p.key}`} className="relative h-72 overflow-hidden border-b border-border-hairline bg-background-sunken">{p.visual}</div>
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="eyebrow text-text-tertiary">Identyca {p.name}</span>
                    {p.isNew ? (
                      <span className="rounded-full bg-signal-soft px-2 py-0.5 text-caption-2-semibold text-signal">New</span>
                    ) : null}
                  </div>
                  <h3 className="text-subsection text-text-primary">{p.tagline}</h3>
                  <p className="text-body-regular leading-6 text-text-secondary">{p.description}</p>
                  <ul className="flex flex-col gap-2.5 border-t border-border-hairline pt-4">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-body-regular text-text-secondary">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-text-tertiary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-headline-medium text-text-primary">
                    {p.cta}
                    <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
              </BorderGlow>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------- mini visuals */

function RealtimeVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const rows = [
    { n: "Sarah Chen", r: "VP Business Development · Pfizer", m: 94 },
    { n: "Marcus Webb", r: "Head of Procurement · Siemens", m: 87 },
    { n: "Priya Nair", r: "CTO · TechVentures", m: 79 },
  ];
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col justify-center gap-2 p-6 sm:px-7">
      <div className="mb-1.5 flex flex-wrap gap-1.5">
        {["Nearby 47", "Matches 12", "VP+", "Tech"].map((c) => (
          <span key={c} className="rounded-full border border-border-hairline bg-background-elevated px-2 py-0.5 text-caption-2-medium text-text-secondary">
            {c}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <motion.div
          key={row.n}
          initial={reduce ? false : { opacity: 0, x: -12, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.12 }}
          className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-background-elevated p-2.5 shadow-[0_6px_16px_-10px_rgb(0_0_0/0.2)]"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-background-sunken text-caption-1-semibold text-text-primary">
            {row.n.split(" ").map((x) => x[0]).join("")}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-body-medium text-text-primary">{row.n}</span>
            <span className="truncate text-caption-1-regular text-text-tertiary">{row.r}</span>
          </span>
          <span className="flex w-14 flex-col items-end gap-1">
            <span className="text-caption-1-semibold tabular-nums text-signal">{row.m}%</span>
            <span className="h-1 w-full overflow-hidden rounded-full bg-background-sunken">
              <motion.span
                className="block h-full rounded-full bg-signal"
                initial={reduce ? false : { width: 0 }}
                animate={inView ? { width: `${row.m}%` } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: 0.4 + i * 0.12 }}
              />
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function SignalMapVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const nodes = [
    { x: 24, y: 24, l: "Northwind", s: "92% sponsor fit", tone: "bg-signal" },
    { x: 74, y: 20, l: "Fluxwave", s: "89% sponsor fit", tone: "bg-signal" },
    { x: 76, y: 68, l: "Dr. A. Vergara", s: "Speaker · Life Sci", tone: "bg-positive" },
    { x: 25, y: 72, l: "Harbour Hall", s: "Venue · Singapore", tone: "bg-positive" },
    { x: 52, y: 88, l: "MedLink APAC", s: "Conflict · Oct 14", tone: "bg-warm" },
  ];
  return (
    <div ref={ref} className="absolute inset-0">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [background-size:28px_28px]" />
      <div className="absolute inset-x-10 top-10 bottom-9">
      <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {nodes.map((n, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="48"
            x2={n.x}
            y2={n.y}
            className="stroke-border-hairline-strong"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.08 }}
          />
        ))}
      </svg>
      <div className="absolute start-1/2 top-[48%] -translate-1/2">
        <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-signal-glow" />
        <span className="relative flex items-center gap-1.5 rounded-full bg-text-primary px-3 py-1.5 text-caption-1-semibold text-background-full shadow-lg">
          <span className="size-1.5 rounded-full bg-signal" /> Your event
        </span>
      </div>
      {nodes.map((n, i) => (
        <motion.div
          key={n.l}
          initial={reduce ? false : { opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.08 }}
          className="absolute -translate-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className="flex items-center gap-1.5 rounded-xl border border-border-hairline bg-background-elevated px-2 py-1 shadow-[0_6px_16px_-10px_rgb(0_0_0/0.25)]">
            <span className={cx("size-1.5 shrink-0 rounded-full", n.tone)} />
            <span className="flex flex-col">
              <span className="text-caption-2-semibold whitespace-nowrap text-text-primary">{n.l}</span>
              <span className="text-caption-2-regular whitespace-nowrap text-text-tertiary">{n.s}</span>
            </span>
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  );
}

export function VenueVisual() {
  const reduce = useReducedMotion();
  const zones = [
    { l: "Exhibit floor", c: "col-span-4 row-span-2" },
    { l: "Stage", c: "col-span-2 row-span-2" },
    { l: "Lounge", c: "col-span-2" },
    { l: "Breakout A", c: "col-span-2" },
    { l: "Breakout B", c: "col-span-2" },
  ];
  const dots = Array.from({ length: 14 }, (_, i) => ({
    x: ((i * 37) % 88) + 6,
    y: ((i * 53) % 76) + 12,
    d: (i % 5) * 0.6,
  }));
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-6">
      <div className="relative grid min-h-0 flex-1 grid-cols-6 grid-rows-3 gap-1.5">
        {zones.map((z) => (
          <div key={z.l} className={cx("rounded-lg border border-border-hairline bg-background-elevated p-1.5", z.c)}>
            <span className="eyebrow text-[9px] text-text-tertiary">{z.l}</span>
          </div>
        ))}
        {dots.map((d, i) => (
          <motion.span
            key={i}
            aria-hidden
            className={cx("absolute size-1.5 rounded-full", i % 4 === 0 ? "bg-warm" : "bg-signal")}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            animate={reduce ? undefined : { x: [0, 8, -4, 0], y: [0, -6, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: d.d }}
          />
        ))}
      </div>
      <div className="flex justify-end gap-1.5">
        <span className="rounded-full border border-border-hairline bg-background-elevated px-2 py-0.5 text-caption-2-semibold text-text-secondary">11 beacons</span>
        <span className="rounded-full border border-border-hairline bg-background-elevated px-2 py-0.5 text-caption-2-semibold text-text-secondary">1,842 phones located</span>
      </div>
    </div>
  );
}
