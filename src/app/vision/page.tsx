import type { Metadata } from "next";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { Accent, Container, Section } from "@/components/site/section";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { VisionTimeline, type Milestone } from "@/components/insights/vision-timeline";
import { DEMO_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Future Vision",
  description:
    "Identyca is building the spatial layer of professional networking - starting with conferences. AR sponsorships, targeted overlays, permanent venues and AI-powered matchmaking.",
  alternates: { canonical: "/vision" },
};

const MILESTONES: Milestone[] = [
  {
    title: "AR Sponsorships",
    body: 'Sponsors purchase "spatial real estate" - branded AR overlays that appear when attendees enter their booth vicinity. Measurable, immersive, and impossible to ignore.',
    tag: "New Revenue Stream",
    icon: "ar",
  },
  {
    title: "Targeted Overlays",
    body: "Hyper-targeted identity overlays shown only to relevant parties. A pharma sponsor sees only doctors; a VC sees only founders. Precision at scale.",
    tag: "Precision Targeting",
    icon: "target",
  },
  {
    title: "Permanent Venues",
    body: "From one-off events to always-on spatial networking in coworking spaces, airports, and stadiums. A persistent professional identity layer for the physical world.",
    tag: "Long-term Platform",
    icon: "venue",
  },
  {
    title: "AI-Powered Matchmaking",
    body: "Machine learning models trained on interaction data surface hyper-relevant introductions before attendees have even arrived at the event.",
    tag: "AI Roadmap",
    icon: "ai",
  },
];

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Future Vision"
        title={
          <>
            The Future of Event <Accent>Monetization</Accent>
          </>
        }
        lead="Identyca is building the spatial layer of professional networking - starting with conferences."
        actions={
          <>
            <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine}>
              Reserve Pilot Slot
            </Cta>
            <Cta href={DEMO_HREF} variant="secondary">
              Book a Demo
            </Cta>
          </>
        }
      />

      <Section className="pt-4 sm:pt-8">
        <Container>
          <div className="mx-auto max-w-5xl">
            <VisionTimeline items={MILESTONES} />
          </div>
          <div className="mx-auto mt-20 flex max-w-5xl justify-center sm:mt-28">
            <Cta href="/solutions/conference-organizers" variant="ghost" size="md" leadingIcon={RiArrowLeftLine}>
              For Organizers
            </Cta>
          </div>
        </Container>
      </Section>

      <CtaBand
        title={
          <>
            Bring Spatial Networking to Your <Accent>Next Event</Accent>
          </>
        }
        lead="Join the pilot cohort of forward-thinking event organizers deploying Identyca at their 2026 events. Slots are limited."
        primary={{ label: "Reserve Pilot Slot", href: DEMO_HREF }}
        secondary={{ label: "Book a Demo", href: DEMO_HREF }}
      />
    </>
  );
}
