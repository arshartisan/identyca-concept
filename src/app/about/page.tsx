import type { Metadata } from "next";
import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiBrainLine,
  RiEarthLine,
  RiLinksLine,
  RiMailLine,
  RiRocket2Line,
  RiShieldCheckLine,
} from "@remixicon/react";
import { Accent, Container, Eyebrow, Section, SectionHeading } from "@/components/site/section";
import { CtaBand, FeatureGrid, PageHero } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Identyca is headquartered in Singapore and builds the spatial, AI-powered networking layer for event organizers, venues, and vendors globally.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    icon: RiEarthLine,
    title: "Singapore-Based, Globally Focused",
    body: "Singapore hosts more than 60 international events per week. We built Identyca here deliberately - embedded in the world's most demanding events market, close to the organizers, venues, and attendees we serve. Our platform is designed for the global events industry, with Asia-Pacific at its core.",
  },
  {
    icon: RiBrainLine,
    title: "Built on Spatial AI and Advanced Positioning",
    body: "Our team is focused on one mission: advancing the events industry into the new era through spatial positioning, artificial intelligence, and augmented reality. We believe the gap between who is in the room and who you find is a solvable engineering and data problem - and we have solved it.",
  },
  {
    icon: RiLinksLine,
    title: "Connecting People Is Our Core Purpose",
    body: "Every feature we build traces back to a single question: does this help people find and connect with who matters to them? Whether it's an attendee on an expo floor, an organiser sourcing their next keynote speaker, or a venue operator trying to understand how crowds move through their space - connection is at the centre.",
  },
  {
    icon: RiRocket2Line,
    title: "A New Era for Events",
    body: "The events industry has operated on the same fundamental infrastructure for decades - paper badges, spreadsheets, and cold introductions. We are building the layer that replaces all of it: a unified, AI-powered, spatially-aware platform that makes every event smarter, more connected, and more measurably valuable.",
  },
];

const VALUES = [
  {
    title: "Connections First",
    body: "Every feature we build is in service of human connection. If it doesn't help people find who they came to meet, it doesn't belong in our product.",
  },
  {
    title: "Smarter Planning",
    body: "We believe organizers deserve intelligence, not instinct. Every decision - from speaker selection to ticket pricing - should be backed by live data.",
  },
  {
    title: "Radical Transparency",
    body: "We are transparent with our customers about how their data is used, how our systems work, and what our platform can and cannot do. No black boxes.",
  },
  {
    title: "Privacy by Design",
    body: "Zero facial recognition. Attendees control their own visibility at all times. Privacy is architecture, not policy.",
  },
  {
    title: "Relentless Innovation",
    body: "The events industry is decades behind the technology available to it. We move fast, ship often, and hold ourselves to a higher standard than what exists today.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Identyca"
        title={
          <>
            Building the future of <Accent>human connection</Accent> at events
          </>
        }
        lead="Identyca is headquartered in Singapore - one of the world's most dynamic hubs for international events, MICE, and business travel. From this position at the crossroads of Asia, we serve event organizers, venues, and vendors globally."
      />

      {/* Who we are */}
      <Section className="pt-0 sm:pt-0">
        <Container>
          <FeatureGrid items={PILLARS} columns={2} />
          <Reveal className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border-hairline px-6 py-6 sm:flex-row sm:items-center sm:px-8">
            <p className="text-title-3-medium text-text-primary">Interested in learning more or working with us?</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group inline-flex items-center gap-2 text-headline-medium text-signal underline decoration-signal/40 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
            >
              <RiMailLine aria-hidden className="size-[18px]" />
              {CONTACT_EMAIL}
            </a>
          </Reveal>
        </Container>
      </Section>

      {/* Values */}
      <Section tone="sunken">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Our Values"
                title={
                  <>
                    What we believe in, <Accent>every single day</Accent>
                  </>
                }
                lead="Our values are not wall decorations. They are the lens through which every product decision, partnership, and line of code is made."
              />
            </div>
            <Stagger as="ol" className="flex flex-col border-t border-border-hairline-strong">
              {VALUES.map((v, i) => (
                <StaggerItem
                  as="li"
                  key={v.title}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 border-b border-border-hairline-strong py-8 sm:gap-x-10 sm:py-10"
                >
                  <span className="pt-1 font-mono text-body-medium text-signal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-subsection text-text-primary">{v.title}</h3>
                    <p className="text-lead text-pretty text-text-secondary">{v.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* Privacy summary */}
      <Section>
        <Container>
          <Reveal>
            <div className="relative isolate grid gap-10 overflow-hidden rounded-[32px] border border-border-hairline bg-background-elevated p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:p-16">
              <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-60" />
              <div className="flex max-w-2xl flex-col gap-5">
                <Eyebrow>Privacy Policy</Eyebrow>
                <h2 className="text-section text-balance text-text-primary">
                  Your data, <Accent>your control</Accent>
                </h2>
                <p className="text-lead text-pretty text-text-secondary">
                  We are committed to protecting your privacy and being transparent about how we collect and use data.
                </p>
                <p className="text-body-regular leading-6 text-text-secondary">
                  Our full Privacy Policy is published at{" "}
                  <Link href="/privacy-policy" className="font-semibold text-text-primary underline decoration-signal/40 underline-offset-4 hover:decoration-signal">
                    identyca.io/privacy-policy
                  </Link>
                  . It covers what data we collect, how we store and use it, your rights, and how to contact us with data-related requests.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-border-hairline bg-background-full text-signal">
                  <RiShieldCheckLine aria-hidden className="size-6" />
                </span>
                <Cta href="/privacy-policy" variant="secondary" trailingIcon={RiArrowRightUpLine}>
                  Read Full Privacy Policy
                </Cta>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
