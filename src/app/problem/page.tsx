import type { Metadata } from "next";
import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Accent, Container, Section, SectionHeading } from "@/components/site/section";
import { CtaBand, PageHero, StatNote } from "@/components/site/blocks";
import { Stagger, StaggerItem, Reveal } from "@/components/site/motion";

export const metadata: Metadata = {
  title: "The problem",
  description:
    "Networking at B2B events is broken, event planning is fragmented, and venues are invisible to the events inside them. Here's what Identyca fixes.",
};

type Problem = { title: string; body: string; stat?: string };

const GROUPS: {
  id: string;
  product: string;
  title: React.ReactNode;
  lead: string;
  items: Problem[];
  cta: { label: string; href: string };
}[] = [
  {
    id: "networking",
    product: "Identyca Real-time",
    title: (
      <>
        Networking at B2B events is <Accent>broken</Accent>.
      </>
    ),
    lead: "In a room of 1,000 people, the 5 who truly matter to your business are physically indistinguishable from everyone else.",
    items: [
      { title: "Invisible identities", body: "Paper badges flip over, hide under jackets, or are simply too small to read from a polite distance.", stat: "~70% of badges are unreadable at 2 m" },
      { title: "Wasted sponsor ROI", body: "Exhibitors spend hours on unqualified traffic while key decision-makers walk right past their booth.", stat: "Sponsors report 60%+ of conversations are irrelevant" },
      { title: "Missed connections", body: "The five people who could transform your business are in that room — you just can't find them.", stat: "83% leave with fewer contacts than planned" },
      { title: "App friction", body: "Pulling out your phone to scan QR codes destroys eye contact and kills conversation momentum.", stat: "QR-based apps see under 20% adoption" },
      { title: "No real-time discovery", body: "Current tools are passive. Nothing proactively surfaces who is standing right next to you, right now.", stat: "Every major networking app requires manual search" },
      { title: "Time wasted", body: "The average attendee spends 40% of their networking time in unproductive conversations.", stat: "$4,000+ per attendee in event costs — largely wasted" },
    ],
    cta: { label: "See Identyca Real-time", href: "/real-time" },
  },
  {
    id: "planning",
    product: "Identyca Event Intelligence",
    title: (
      <>
        Event planning is fragmented and <Accent>blind</Accent>.
      </>
    ),
    lead: "Organizers spend weeks on research that should take hours — juggling spreadsheets, cold emails and guesswork with no live data to guide decisions.",
    items: [
      { title: "Fragmented planning tools", body: "Dozens of disconnected tools — spreadsheets, email threads, vendor portals — and no single source of truth.", stat: "7+ disconnected tools per event" },
      { title: "Sponsor discovery is manual", body: "Cold outreach, trade directories and gut instinct. No data-driven matching between events and sponsors.", stat: "80%+ of sponsor outreach goes unanswered" },
      { title: "Speaker sourcing is guesswork", body: "Reputation and word of mouth. No way to match speakers to audience intent or benchmark against competing events.", stat: "60% say speaker sourcing takes 4+ weeks" },
      { title: "No competitive intelligence", body: "No visibility into what competing events are doing — pricing, dates, speakers — until it's too late to react.", stat: "Conflicting dates lose 30%+ of potential sponsors" },
      { title: "Pricing set in the dark", body: "Ticket and sponsorship pricing set on gut feel or last year's numbers, with no live market benchmarks.", stat: "Most events leave 20–40% of revenue on the table" },
      { title: "Vendors lack a discovery channel", body: "AV firms, caterers, agencies and hotels have no structured way to find and pitch relevant events.", stat: "Vendor pipelines are 90% relationship-dependent" },
    ],
    cta: { label: "See Event Intelligence", href: "/event-intelligence" },
  },
  {
    id: "venues",
    product: "Identyca Spaces",
    title: (
      <>
        Your building is <Accent>invisible</Accent> to the events inside it.
      </>
    ),
    lead: "Six structural problems that Identyca Spaces solves for venue operators.",
    items: [
      { title: "Organisers shortlist on technology", body: "The modern event buyer expects intelligent infrastructure. A smart floor plan is now a competitive differentiator." },
      { title: "No real-time context", body: "Your venue team can't see where people are, where zones are filling, or where problems are forming." },
      { title: "Networking fails at scale", body: "Without spatial intelligence, delegates leave large B2B events with fewer connections than they expected." },
      { title: "Guests get lost", body: "Indoor navigation is unsolved for most venues — guests miss sessions, exhibitors and F&B." },
      { title: "Venue data is missing", body: "Occupancy, flow, dwell time and dead zones should be standard. Instead: surveys and intuition." },
      { title: "Expos need experiences", body: "Gamification, location-triggered activations and crowd intelligence need a live floor layer." },
    ],
    cta: { label: "See Identyca Spaces", href: "/spaces" },
  },
];

export default function ProblemPage() {
  return (
    <>
      <PageHero
        eyebrow="The problem"
        title={
          <>
            Events are full of people who <Accent>should</Accent> meet — and don&apos;t.
          </>
        }
        lead="Three structural failures sit underneath every conference: on the floor, at the planning table, and inside the venue itself."
        actions={
          <nav aria-label="Jump to problem" className="flex flex-wrap gap-2">
            {GROUPS.map((g, i) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border-hairline bg-background-elevated px-4 py-2 text-body-medium text-text-secondary transition-colors duration-150 hover:border-border-hairline-strong hover:text-text-primary"
              >
                <span className="font-mono text-caption-1-medium text-text-tertiary">0{i + 1}</span>
                {["Broken networking", "Unstructured planning", "Lack of physical context"][i]}
              </a>
            ))}
          </nav>
        }
      />

      {GROUPS.map((g, i) => (
        <Section key={g.id} id={g.id} tone={i === 1 ? "sunken" : "paper"}>
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <SectionHeading eyebrow={`0${i + 1} · ${g.product}`} title={g.title} lead={g.lead} />
                <Reveal delay={0.15} className="mt-8">
                  <Link href={g.cta.href} className="group inline-flex items-center gap-1 text-headline-medium text-signal">
                    {g.cta.label}
                    <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </Reveal>
              </div>
              <Stagger className="grid gap-px overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline sm:grid-cols-2">
                {g.items.map((p) => (
                  <StaggerItem key={p.title} className="flex flex-col gap-3 bg-background-elevated p-6 sm:p-7">
                    <h3 className="text-title-3-semibold text-text-primary">{p.title}</h3>
                    <p className="text-body-regular leading-6 text-text-secondary">{p.body}</p>
                    {p.stat ? (
                      <div className="mt-auto pt-2">
                        <StatNote>{p.stat}</StatNote>
                      </div>
                    ) : null}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Container>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
