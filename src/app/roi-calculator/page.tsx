import type { Metadata } from "next";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Accent, Container, Section } from "@/components/site/section";
import { RoiCalculator } from "@/components/roi/roi-calculator";

export const metadata: Metadata = {
  title: "ROI Calculator",
  description:
    "Model your event's return on Identyca: platform fee, tech you replace, new sponsorship and exhibitor revenue, and how much easier networking becomes. Get a personalised PDF report by email.",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="ROI Calculator"
        title={
          <>
            See the ROI <Accent>before</Accent> you commit
          </>
        }
        lead="Enter your event details below. We'll build a personalised financial model showing exactly how Identyca pays for itself - and then some."
        className="pb-10 sm:pb-14"
      />

      <Section className="pt-0 sm:pt-0">
        <Container>
          <RoiCalculator />
          <nav aria-label="Related pages" className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border-hairline pt-8">
            <Cta href="/solutions/conference-organizers" variant="ghost" size="md" leadingIcon={RiArrowLeftLine}>
              For Organizers
            </Cta>
            <Cta href="/vision" variant="ghost" size="md" trailingIcon={RiArrowRightLine}>
              Vision
            </Cta>
          </nav>
        </Container>
      </Section>

      <CtaBand
        title={
          <>
            Want to walk through <Accent>your numbers</Accent>?
          </>
        }
        lead="Book a 30-minute demo and we'll tailor the model to your event, sponsors and venue."
        secondary={null}
      />
    </>
  );
}
