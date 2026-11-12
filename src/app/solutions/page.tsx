import type { Metadata } from "next";
import { RiArrowRightLine } from "@remixicon/react";
import { DEMO_HREF } from "@/lib/site";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Accent, Container, Section } from "@/components/site/section";
import { SolutionsGrid } from "@/components/solutions/overview";

export const metadata: Metadata = {
  title: "By organization type",
  description:
    "Identyca Real-time, Event Intelligence and Spaces for conference organizers, trade shows, associations, agencies, media companies, non-profits, corporations, venues and event vendors.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="By organization type"
        title={
          <>
            Built for every kind of <Accent>event</Accent> business
          </>
        }
        lead="Organizers, venues, agencies and vendors each need something different from an event. Pick yours to see the Identyca stack that fits."
        actions={
          <>
            <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine}>
              Book a demo
            </Cta>
            <Cta href="/roi-calculator" variant="secondary">
              Calculate your ROI
            </Cta>
          </>
        }
      />
      <Section className="pt-0 sm:pt-0">
        <Container>
          <SolutionsGrid />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
