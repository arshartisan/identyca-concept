import type { Metadata } from "next";
import { RiArrowRightLine, RiMailLine, RiSignalTowerLine, RiSmartphoneLine, RiFocus3Line, RiStackLine, RiTeamLine, RiRouteLine, RiShieldCheckLine } from "@remixicon/react";
import { Accent, Card, Container, Eyebrow, Section, SectionHeading } from "@/components/site/section";
import { CheckList, CtaBand, FeatureGrid } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { VenueVisual } from "@/components/home/product-suite";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Spaces - badge-less networking & wayfinding for venues",
  description:
    "Turn your hotel, convention centre or expo venue into a live, navigable environment. One beacon install, one annual licence, resold into every event you host.",
};

const VENUE_PROBLEMS = [
  { title: "Organisers shortlist on technology", body: "The modern event buyer expects intelligent infrastructure. A smart floor plan is now a competitive differentiator - not a nice-to-have." },
  { title: "The building has no real-time context", body: "Your team cannot see where people are, where zones are filling up, or where problems are forming - until it's too late to act." },
  { title: "Large B2B events fail at networking", body: "Networking at scale needs spatial intelligence - who is nearby, who is relevant, who to approach. Without it, delegates leave with fewer connections." },
  { title: "Guests are lost inside your building", body: "Indoor navigation is unsolved for most venues. Guests miss sessions, exhibitors and F&B simply because they can't find them." },
  { title: "You know less than you should", body: "Occupancy, flow, dwell time, dead zones - this data should be standard. Instead, operators rely on post-event surveys and intuition." },
  { title: "Expos need experiences, not just space", body: "Gamification, location-triggered activations and crowd intelligence are only possible with a live floor layer." },
];

const HOW = [
  { icon: RiSignalTowerLine, title: "Install", body: "Battery-powered UWB + BLE beacons placed across halls, foyers and corridors - no cabling, no structural drilling, no venue shutdown." },
  { icon: RiSmartphoneLine, title: "Open", body: "The guest opens the event app and opts in. Their phone starts listening to the beacon network immediately." },
  { icon: RiFocus3Line, title: "Locate", body: "The phone computes its own position - sub-metre over UWB, with a 2–5 m BLE fallback for older handsets." },
  { icon: RiStackLine, title: "Deliver", body: "Networking, wayfinding, zone triggers, gamification, crowd intelligence and venue analytics - all from the same live position layer." },
];

const USES = [
  {
    icon: RiTeamLine,
    title: "People & networking",
    items: ["Real-time attendee discovery", "AI matchmaking and smart filtering", "Find who you came with", "Meet-me routing", "Automatic interaction logging", "Exhibitor team coordination"],
  },
  {
    icon: RiRouteLine,
    title: "Movement & experience",
    items: ["Turn-by-turn indoor wayfinding", "Location-triggered experiences", "Gamification - stand passports, treasure hunts, leaderboards, prize zones", "Queue and crowd intelligence", "Accessibility routing", "Session auto check-in"],
  },
  {
    icon: RiShieldCheckLine,
    title: "Operations & safety",
    items: ["Live occupancy by zone against fire limits", "Evacuation and muster roll-call", "Lost person locate", "Staff and contractor dispatch by position", "Asset tracking", "Incident reconstruction"],
  },
];

const EVENT_TYPES = {
  "B2B - business & professional": ["Conferences", "Tradeshows", "Expos", "Business conventions", "Symposiums", "Business summits"],
  "B2C - consumer & mixed": ["Concerts & festivals", "Consumer expos & fairs", "Sporting events", "Weddings", "Career fairs", "AGMs", "Product launches"],
};

export default function SpacesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[700px] opacity-70" />
        <div aria-hidden className="absolute -top-40 end-1/4 h-[420px] w-[700px] rounded-full bg-warm-soft blur-[120px]" />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>Identyca Spaces · for venues</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-hero text-balance text-text-primary lg:text-[4.5rem]">
                Every venue, instantly <Accent>navigable</Accent>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lead max-w-xl text-text-secondary">
                The real-time networking, wayfinding and experience layer that lives in your building instead of in each
                event. Installed once. Licensed annually. Resold into every event you host.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap gap-3 pt-2">
              <Cta href="#survey" trailingIcon={RiArrowRightLine}>
                Book a site survey
              </Cta>
              <Cta href="#how" variant="secondary">
                How it works
              </Cta>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="eyebrow text-text-tertiary">For hotels · convention centres · expo venues</p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="dark relative h-[380px] overflow-hidden rounded-[28px] bg-background-full ring-1 ring-border-hairline-strong shadow-[0_40px_120px_-40px_rgb(0_0_0/0.55)] sm:h-[440px]">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border-hairline px-5 py-3">
                <span className="eyebrow text-[10px] text-text-secondary">Live venue map · Hall 1 · 4,180 m²</span>
                <span className="flex items-center gap-1.5 text-caption-2-medium text-text-tertiary">
                  <span className="size-1.5 animate-pulse rounded-full bg-positive" /> Live
                </span>
              </div>
              <div className="absolute inset-0 top-11">
                <VenueVisual />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Unlock */}
      <Section className="pt-0 sm:pt-0">
        <Container>
          <SectionHeading
            eyebrow="The unlock"
            title={
              <>
                Your event space just became <Accent>intelligent</Accent>.
              </>
            }
            lead="Badge-less. Hardware-light. Permanently installed. Infinitely resold."
          />
          <FeatureGrid
            className="mt-14"
            items={[
              { title: "No badges. No per-event hardware.", body: "The smartphone works out its own position by listening to venue beacons. Nothing to buy, print, hand out, chase or bin." },
              { title: "Sub-metre accuracy.", body: "Independent validation measured under 1 m error, with over 99% of position fixes inside 1 m." },
              { title: "Scales to any crowd.", body: "Beacons only broadcast, never receive. 500 attendees or 50,000 - the load on the infrastructure is identical." },
            ]}
          />
        </Container>
      </Section>

      {/* Problem */}
      <Section tone="sunken">
        <Container>
          <SectionHeading
            eyebrow="The venue problem"
            title={
              <>
                Your building is <Accent>invisible</Accent> to the events inside it.
              </>
            }
            lead="Six structural problems that Identyca Spaces solves for venue operators."
          />
          <FeatureGrid className="mt-14" items={VENUE_PROBLEMS} />
        </Container>
      </Section>

      {/* How */}
      <Section id="how">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Four steps. One <Accent>permanent</Accent> layer.
              </>
            }
            lead="Installed in your building once. Works for every event you host - B2B or B2C, 500 or 50,000."
          />
          <Stagger as="ol" className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h, i) => (
              <StaggerItem as="li" key={h.title}>
                <Card className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-signal-soft text-signal">
                      <h.icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-caption-1-medium text-text-tertiary">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-title-2-semibold text-text-primary">{h.title}</h3>
                  <p className="text-body-regular leading-6 text-text-secondary">{h.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Uses */}
      <Section tone="ink">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Use cases"
            title={
              <>
                One layer. Three dimensions of <Accent>value</Accent>.
              </>
            }
            lead="Every capability runs from the same beacon infrastructure - chosen by the event organiser for each event."
          />
          <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
            {USES.map((u) => (
              <StaggerItem key={u.title}>
                <Card className="h-full p-6 sm:p-8">
                  <u.icon className="size-6 text-signal" aria-hidden />
                  <h3 className="mt-5 mb-5 text-title-2-semibold text-text-primary">{u.title}</h3>
                  <CheckList items={u.items} />
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Event types */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Event types"
            title={
              <>
                Built for <Accent>every</Accent> kind of event.
              </>
            }
            lead="The same permanent venue layer serves every format - from intimate business summits to stadium-scale consumer expos."
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {Object.entries(EVENT_TYPES).map(([group, list]) => (
              <Reveal key={group}>
                <p className="eyebrow mb-4 text-text-tertiary">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((t) => (
                    <span key={t} className="rounded-full border border-border-hairline bg-background-elevated px-4 py-2 text-body-medium text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Get started */}
      <Section tone="sunken" id="survey">
        <Container>
          <SectionHeading
            eyebrow="Get started"
            title={
              <>
                Let&apos;s survey your <Accent>halls</Accent>.
              </>
            }
            lead="Three steps from first conversation to venue-wide deployment - with no commitment until you see the fixed quote."
          />
          <Stagger as="ol" className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { t: "Site survey", b: "One day, free. We survey your halls, map the beacon positions and issue a fixed quote. No commitment required." },
              { t: "Pilot hall", b: "One hall, one live event. Launch-partner pricing. Full platform active - networking, wayfinding, analytics." },
              { t: "Venue-wide", b: "Phased rollout across all halls. Staff certified on the platform. Identyca Spaces on your rate card for every event." },
            ].map((s, i) => (
              <StaggerItem as="li" key={s.t}>
                <Card className="flex h-full flex-col gap-3 p-6 sm:p-8">
                  <span className="text-stat text-text-tertiary">{i + 1}</span>
                  <h3 className="text-title-2-semibold text-text-primary">{s.t}</h3>
                  <p className="text-body-regular leading-6 text-text-secondary">{s.b}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border-hairline bg-background-elevated p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="eyebrow text-signal">Launch-partner programme open now</p>
              <p className="mt-2 text-body-regular text-text-secondary">Singapore & South-East Asia · global from Q3 2027 · Singapore headquarters, global enquiries welcome.</p>
            </div>
            <Cta href={`mailto:${CONTACT_EMAIL}?subject=Identyca%20Spaces%20site%20survey`} leadingIcon={RiMailLine} className="shrink-0">
              {CONTACT_EMAIL}
            </Cta>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title={
          <>
            See your whole venue. <Accent>Sell</Accent> every event.
          </>
        }
        lead="Book a free one-day site survey and get a fixed quote for your halls."
        primary={{ label: "Book a site survey", href: "/demo" }}
        secondary={{ label: "Convention centers", href: "/solutions/convention-centers" }}
      />
    </>
  );
}
