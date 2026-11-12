import type { Metadata } from "next";
import { RiCalendarCheckLine, RiMailLine, RiMapPin2Line, RiRocket2Line } from "@remixicon/react";
import { Accent, Card, Container, Eyebrow } from "@/components/site/section";
import { Reveal } from "@/components/site/motion";
import { LeadForm } from "@/components/site/lead-form";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Bring AR networking to your next event. Book a demo or reserve a pilot slot for your 2026 event with Identyca.",
};

const POINTS = [
  {
    icon: RiCalendarCheckLine,
    title: "A 20-minute walkthrough",
    body: "Tailored to your role — organizer, venue or vendor. No slides. No sales pitch. Just the product.",
  },
  {
    icon: RiRocket2Line,
    title: "2026 pilot cohort",
    body: "Join forward-thinking organizers deploying Identyca at their 2026 events. Slots are limited.",
  },
  {
    icon: RiMapPin2Line,
    title: "Singapore headquarters",
    body: "Global enquiries welcome. Launch-partner programme open across South-East Asia.",
  },
];

export default function DemoPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[700px] opacity-70" />
      <div aria-hidden className="absolute -top-40 end-0 h-[420px] w-[620px] rounded-full bg-signal-glow opacity-40 blur-[120px]" />
      <Container className="relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <Reveal>
            <Eyebrow>Get started</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-hero text-balance text-text-primary">
              Bring AR networking to your <Accent>next event</Accent>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lead max-w-xl text-text-secondary">
              Join the pilot cohort of forward-thinking event organizers deploying Identyca at their 2026 events.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-4 flex flex-col gap-6">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-hairline bg-background-elevated text-foreground-icon-primary">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-headline-semibold text-text-primary">{p.title}</p>
                  <p className="mt-1 text-body-regular text-text-secondary">{p.body}</p>
                </div>
              </div>
            ))}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex w-fit items-center gap-2 text-body-medium text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              <RiMailLine className="size-4" aria-hidden />
              {CONTACT_EMAIL}
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Card className="p-6 sm:p-10">
            <LeadForm />
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}
