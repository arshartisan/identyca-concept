import {
  RiArrowRightLine,
  RiCheckLine,
  RiCloseLine,
} from "@remixicon/react";
import { Accent, Container, Section, SectionHeading } from "@/components/site/section";
import { StatGrid } from "@/components/site/blocks";
import { DifferentiatorsBento } from "@/components/home/differentiators-bento";
import { WhyBento } from "@/components/home/why-bento";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Cta } from "@/components/site/cta";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";
import { VideoPlayer } from "@/components/site/video-player";
import { VIDEOS, WEBM } from "@/lib/videos";
import { DEMO_HREF } from "@/lib/site";

/* -------------------------------------------------------------- Videos */

export function ExplainerVideos() {
  return (
    <Section className="pt-0 sm:pt-0">
      <Container>
        <Stagger className="grid gap-4 md:grid-cols-2">
          <StaggerItem>
            <VideoPlayer src={VIDEOS.realtime} webm={WEBM.realtime} poster="/images/poster-rt-v2.jpg" title="Identyca Real-time - product explainer" />
          </StaggerItem>
          <StaggerItem>
            <VideoPlayer
              src={VIDEOS.intelligence}
              poster="/images/poster-eivid-v2.jpg"
              title="Identyca Event Intelligence - product explainer"
            />
          </StaggerItem>
        </Stagger>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------- Differentiators */

export function Differentiators() {
  return (
    <Section tone="ink" id="different" className="overflow-hidden">
      <div aria-hidden className="absolute -top-40 start-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-signal-glow opacity-25 blur-[120px]" />
      <Container className="relative">
        <SectionHeading
          align="center"
          eyebrow="Our differentiators"
          title={
            <>
              We rebuilt the <Accent>intelligence layer</Accent> underneath events.
            </>
          }
          lead="We didn't just build another event app."
        />
        <DifferentiatorsBento className="mt-14" />
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------------- Numbers */

export function Numbers() {
  return (
    <Section tone="ink" id="numbers" className="overflow-hidden">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute -top-40 end-0 h-96 w-[600px] rounded-full bg-signal-glow opacity-40 blur-[120px]" />
      <Container className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Platform impact"
            title={
              <>
                The Identyca <Accent>numbers</Accent>.
              </>
            }
            lead="Real figures from our platform design, pilot tests and industry benchmarks."
          />
          <Reveal className="shrink-0">
            <Cta href={DEMO_HREF} variant="secondary" trailingIcon={RiArrowRightLine}>
              Get a custom ROI model
            </Cta>
          </Reveal>
        </div>
        <StatGrid
          className="mt-14"
          stats={[
            { value: 4.2, decimals: 1, suffix: "×", label: "More qualified networking connections vs. unaided floor networking" },
            { value: 12, suffix: " min", label: "Average time to generate a full AI sponsor + speaker shortlist" },
            { value: 80, prefix: "<", suffix: " cm", label: "Positioning accuracy inside venues - 99% of fixes inside 1 m" },
            { value: 100, suffix: "%", label: "Platform cost that can be offset by reselling smart glass access and analytics" },
          ]}
        />
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ Comparison */

const ROWS: [string, string, string, string][] = [
  ["Real-time attendee location", "30–50 cm accuracy", "-", "-"],
  ["Hands-free networking overlay", "AR + mobile app", "QR scan only", "-"],
  ["AI sponsor matching", "Fit-scored shortlist", "-", "Manual research"],
  ["Indoor wayfinding", "Turn-by-turn via beacons", "Static floor maps only", "-"],
  ["Crowd density and zone analytics", "Real-time by zone", "-", "-"],
  ["Sponsor booth traffic and dwell data", "Live + post-event", "Post-event only", "Manual count"],
  ["Speaker and venue discovery", "AI recommendations", "-", "Manual directories"],
  ["Permanent venue intelligence layer", "Identyca Spaces", "Per-event only", "-"],
  ["Zero per-event hardware reinstall", "Install once, reuse forever", "Reinstall every event", "N/A"],
];

function Cell({ v }: { v: string }) {
  if (v === "-")
    return (
      <span className="inline-flex items-center gap-1.5 text-text-tertiary">
        <RiCloseLine className="size-4" aria-hidden />
        <span className="sr-only">Not available</span>
      </span>
    );
  return <span className="text-text-secondary">{v}</span>;
}

export function Comparison() {
  return (
    <Section id="compare">
      <Container>
        <SectionHeading
          eyebrow="Comparison"
          title={
            <>
              Identyca vs. the <Accent>status quo</Accent>.
            </>
          }
          lead="How Identyca compares to the disconnected tools most event organizers use today."
        />
        <Reveal className="mt-14">
          <div className="relative overflow-x-auto rounded-3xl border border-border-hairline bg-background-elevated">
            <table className="w-full min-w-[720px] border-collapse text-start">
              <thead>
                <tr className="border-b border-border-hairline">
                  <th scope="col" className="w-[30%] p-5 text-start text-caption-1-semibold text-text-tertiary sm:px-6">
                    Capability
                  </th>
                  <th scope="col" className="bg-signal-soft p-5 text-start sm:px-6">
                    <span className="inline-flex items-center gap-2 text-headline-semibold text-text-primary">
                      <span className="size-1.5 rounded-full bg-signal" /> Identyca
                    </span>
                  </th>
                  <th scope="col" className="p-5 text-start text-body-medium text-text-secondary sm:px-6">
                    Typical event apps
                  </th>
                  <th scope="col" className="p-5 text-start text-body-medium text-text-secondary sm:px-6">
                    Spreadsheets & email
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([cap, us, apps, sheets]) => (
                  <tr key={cap} className="border-b border-border-hairline last:border-0">
                    <th scope="row" className="p-5 text-start text-body-medium text-text-primary sm:px-6">
                      {cap}
                    </th>
                    <td className="bg-signal-soft p-5 sm:px-6">
                      <span className="inline-flex items-center gap-2 text-body-medium text-text-primary">
                        <RiCheckLine className="size-4 shrink-0 text-signal" aria-hidden />
                        {us}
                      </span>
                    </td>
                    <td className="p-5 text-body-regular sm:px-6">
                      <Cell v={apps} />
                    </td>
                    <td className="p-5 text-body-regular sm:px-6">
                      <Cell v={sheets} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ Why choose */

const REASONS = [
  {
    title: "The ROI is measurable",
    body: "One of the only event platforms where the financial return is calculable before sign-up - sponsor uplift, renewal rates and cost offsets, modelled to your event.",
    link: { label: "Open ROI Calculator", href: "/roi-calculator" },
  },
  {
    title: "Designed for every stage",
    body: "Most event tech solves one problem. Identyca covers the full lifecycle - AI pre-event planning, real-time floor networking and permanent venue intelligence.",
    link: { label: "See the problem", href: "/problem" },
  },
  {
    title: "Built for scale",
    body: "From a 150-person industry summit to a 50,000-person expo - the beacon infrastructure scales horizontally. Network load is identical for 500 or 50,000 phones.",
    link: { label: "Explore Spaces", href: "/spaces" },
  },
  {
    title: "Fast to deploy",
    body: "Spaces deploys in one site-survey day with no cabling. Real-time is live within 48 hours of badge issuance. Event Intelligence needs only your event brief.",
    link: { label: "Book a demo", href: DEMO_HREF },
  },
];

export function WhyChoose() {
  return (
    <Section id="why">
      <Container>
        <WhyBento reasons={REASONS} demoHref={DEMO_HREF} />
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------- Testimonials */

const QUOTES = [
  {
    q: "If spatial positioning based networking becomes mainstream at conferences, Identyca is the platform that wins.",
    a: "Early pilot advisor",
  },
  { q: "This solves the single biggest frustration every exhibitor has at trade shows.", a: "B2B events veteran" },
  { q: "The economics are genius - organizers can run this at zero net cost.", a: "Conference director" },
];

export function Testimonials() {
  return (
    <Section>
      <Container>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {QUOTES.map((t) => (
            <StaggerItem key={t.a} className="h-full">
              <BorderGlow className="h-full">
              <figure className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-border-hairline bg-background-elevated p-7 sm:p-8">
              <blockquote className="font-sans text-[1.625rem] leading-[1.2] tracking-[-0.01em] text-text-primary">
                “{t.q}”
              </blockquote>
              <figcaption className="eyebrow text-text-tertiary">- {t.a}</figcaption>
              </figure>
              </BorderGlow>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

