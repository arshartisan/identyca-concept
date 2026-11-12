import type { Metadata } from "next";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiDownload2Line,
  RiTimerFlashLine,
  RiFileSearchLine,
  RiShieldStarLine,
  RiNewsLine,
  RiBuilding4Line,
  RiSendPlaneLine,
  RiInboxLine,
  RiHandCoinLine,
  RiUserSearchLine,
  RiExchangeDollarLine,
  RiLinksLine,
} from "@remixicon/react";
import { Accent, Card, Container, Eyebrow, Section, SectionHeading } from "@/components/site/section";
import { CtaBand, FeatureGrid, Steps } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { VideoPlayer, VIDEOS } from "@/components/site/video-player";
import { SignalMapVisual } from "@/components/home/product-suite";
import { ModuleExplorer } from "@/components/intelligence/module-explorer";
import { CONTACT_EMAIL, DEMO_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Event Intelligence - AI-native conference planning",
  description:
    "The AI-native planning workspace for event organizers and the prospecting engine for event vendors - sponsors, speakers, venues, dates and pricing, powered by a global events graph.",
};

const BROCHURE = "https://www.genspark.ai/api/files/s/NSPqZsHv";

const MODULES = [
  { id: "sponsor", title: "Sponsor Finder", image: "/images/ei/sponsor-finder.png", body: "AI matches likely sponsors from your audience profile, agenda and past comparable events. Every prospect is fit-scored, ranked and comes with an outreach draft ready to send." },
  { id: "speaker", title: "Speaker Discovery", image: "/images/ei/speaker-discovery.png", body: "Surface topic-relevant speakers across your vertical. See full speaking history, how often they appear at comparable events, and an AI rationale for why they fit your programme." },
  { id: "topic", title: "Topic Intelligence", image: "/images/ei/agenda-intelligence.png", body: "Trending themes by vertical, geography and audience segment. Benchmark your agenda against comparable conferences and find the topics competitors cover that you're missing." },
  { id: "venue", title: "Venue Match", image: "/images/ei/venue-match.png", body: "See which venues have hosted comparable events, with destination context and capacity - an evidence-based shortlist before your first RFP goes out." },
  { id: "dates", title: "Date Conflict Radar", image: "/images/ei/date-conflict-radar.png", body: "Every industry conference overlapping your target dates, worldwide. Detect audience, sponsor and speaker conflicts before you lock your calendar - and test alternatives instantly." },
  { id: "pricing", title: "Pricing Benchmarks", image: "/images/ei/pricing-benchmarks.png", body: "Early bird, standard and VIP delegate pricing benchmarked by vertical, event size and city. Price with current market data, not last year's PDF." },
];

const ROADMAP = [
  { when: "Now", title: "Organizer Intelligence", body: "AI-powered pre-event planning across six modules: sponsors, speakers, topics, venues, dates and pricing." },
  { when: "Next", title: "Vendor Discovery", body: "Event service vendors proactively discover and pitch to upcoming conferences matched to their profile and geography." },
  { when: "Soon", title: "Sponsorship Marketplace", body: "Sponsors find and match to conferences directly. Organizers receive qualified inbound interest. Both sides powered by AI." },
  { when: "Future", title: "Convention Bureau Intelligence", body: "Destination marketing organizations and convention bureaus identify rotating international congresses to bid for and attract to their city." },
];

const CATEGORIES = [
  "AV & Production",
  "Venue & Hospitality",
  "Exhibition Build & Fit-Out",
  "Event Agencies",
  "Catering & F&B",
  "Translation & Interpretation",
  "Photography & Videography",
  "Staffing & Hosting",
];

export default function EventIntelligencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[700px] opacity-70" />
        <div aria-hidden className="absolute -top-40 start-1/4 h-[420px] w-[700px] rounded-full bg-signal-glow opacity-40 blur-[120px]" />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>Event Intelligence · AI-native planning</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-hero text-balance text-text-primary lg:text-[4.5rem]">
                See the whole conference <Accent>before</Accent> you build it.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lead max-w-xl text-text-secondary">
                The AI-native planning workspace for event organizers and the prospecting engine for event vendors -
                powered by a proprietary global events graph.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap gap-3 pt-2">
              <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine}>
                Book a demo
              </Cta>
              <Cta href="#walkthrough" variant="secondary">
                Watch product video
              </Cta>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="dark relative h-[380px] overflow-hidden rounded-[28px] bg-background-full ring-1 ring-border-hairline-strong shadow-[0_40px_120px_-40px_rgb(0_0_0/0.55)] sm:h-[440px]">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border-hairline px-5 py-3">
                <span className="eyebrow text-[10px] text-text-secondary">Live · signal map · APAC · Q3 2026</span>
                <span className="flex items-center gap-1.5 text-caption-2-medium text-text-tertiary">
                  <span className="size-1.5 animate-pulse rounded-full bg-positive" /> Benchmark SGD 1,290 avg · 3-day
                </span>
              </div>
              <div className="absolute inset-0 top-11">
                <SignalMapVisual />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Challenge */}
      <Section className="pt-0 sm:pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <SectionHeading
              eyebrow="The challenge"
              title={
                <>
                  Six decisions. Six months of research. <Accent>Until now.</Accent>
                </>
              }
            />
            <Reveal className="text-lead text-text-secondary lg:pt-12">
              Finding the right sponsors, designing a competitive agenda, recruiting credible speakers, setting the right
              ticket price and avoiding scheduling conflicts currently takes organizers weeks of manual research across
              dozens of websites. Vendors spend just as long finding conferences that need them. Identyca Event
              Intelligence solves both sides from a single AI workspace.
            </Reveal>
          </div>
          <FeatureGrid
            className="mt-14"
            items={[
              { icon: RiTimerFlashLine, title: "Weeks → minutes", body: "Research time saved. AI-powered analysis replaces weeks of desk research." },
              { icon: RiFileSearchLine, title: "Evidence-based", body: "Every recommendation sourced and scored - fit scores, data sources and rationale included with every result." },
              { icon: RiShieldStarLine, title: "Pre-event intelligence", body: "Decisions made before a budget is committed. Act with confidence at the planning stage, not after." },
            ]}
          />
        </Container>
      </Section>

      {/* Walkthrough */}
      <Section tone="ink" id="walkthrough">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            align="center"
            eyebrow="Product walkthrough"
            title={
              <>
                Watch Event Intelligence <Accent>in action</Accent>.
              </>
            }
            lead="From event brief to a full sponsor list, speaker recommendations, agenda benchmarks and pricing strategy - in one session."
          />
          <Reveal className="mx-auto mt-14 max-w-5xl">
            <VideoPlayer src={VIDEOS.organizerWalkthrough} poster="/images/poster-ei-v2.jpg" title="Event Organizer Intelligence explainer" />
          </Reveal>
          <Reveal className="mx-auto mt-16 max-w-3xl text-center">
            <blockquote className="font-serif text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] leading-[1.12] tracking-[-0.01em] text-text-primary">
              “Identyca turned two months of desk research into a single afternoon of decisions. We closed two anchor
              sponsors from its top ten list.”
            </blockquote>
            <p className="eyebrow mt-6 text-text-tertiary">Head of Programming · Regional B2B conference · 400 delegates</p>
          </Reveal>
        </Container>
      </Section>

      {/* Organizers */}
      <Section id="organizers">
        <Container>
          <SectionHeading
            eyebrow="Organizer Intelligence"
            title={
              <>
                The planning <Accent>brain</Accent> for modern conferences.
              </>
            }
            lead="Who to approach for sponsorship, which speakers are trending, whether your dates clash, what the market charges - answered before you commit to anything."
          />
          <div className="mt-16">
            <ModuleExplorer modules={MODULES} />
          </div>
          <div className="mt-24">
            <h3 className="text-subsection max-w-2xl text-text-primary">From event brief to full intelligence in minutes.</h3>
            <Steps
              className="mt-10"
              steps={[
                { title: "Describe your event", body: "Enter your vertical, target audience, expected delegate size, city and target dates. Takes sixty seconds." },
                { title: "Review AI recommendations", body: "Fit-scored sponsors, speakers, venues, agenda benchmarks, conflict alerts and pricing tiers - from our global events graph." },
                { title: "Act inside the platform", body: "Send outreach, track your sponsor pipeline, save recommendations and export a full strategy report for your board." },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* Vendors */}
      <Section tone="sunken" id="vendors">
        <Container>
          <SectionHeading
            eyebrow="Vendor Discovery"
            title={
              <>
                Stop waiting for RFPs. Find the conferences that <Accent>need you</Accent>.
              </>
            }
            lead="A proactive intelligence feed of upcoming conferences in your region - identify the right events, understand the opportunity and pitch before the RFP lands."
          />
          <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { t: "Reactive, not proactive", b: "Most vendors only learn about events when an RFP arrives - by which point shortlists are forming and relationships are built." },
              { t: "No visibility into scale or budget", b: "Without knowing who sponsors an event, it's almost impossible to gauge its commercial tier or whether you're a realistic fit." },
              { t: "Manual and time-consuming", b: "Searching calendars, LinkedIn and associations takes hours and still produces an incomplete picture." },
            ].map((p) => (
              <StaggerItem key={p.t}>
                <Card className="h-full p-6 sm:p-8">
                  <span className="eyebrow text-warm">The problem</span>
                  <h3 className="mt-3 text-title-3-semibold text-text-primary">{p.t}</h3>
                  <p className="mt-2 text-body-regular leading-6 text-text-secondary">{p.b}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <FeatureGrid
            className="mt-6"
            columns={4}
            items={[
              { icon: RiNewsLine, title: "Personalized discovery feed", body: "Upcoming events matched to your service category, geography and event size - only genuinely relevant opportunities." },
              { icon: RiBuilding4Line, title: "Sponsor signal intelligence", body: "See each event's sponsor profile to gauge its commercial tier and tailor your pitch." },
              { icon: RiSendPlaneLine, title: "Direct organizer pitch tool", body: "Submit a structured service enquiry with your credentials. Organizers receive it as a lead in their dashboard." },
              { icon: RiInboxLine, title: "Enquiry tracking dashboard", body: "Track every pitch - Sent, Viewed, Responded or Declined - and set watchlist alerts for new matching conferences." },
            ]}
          />

          <Reveal className="mt-14 flex flex-col gap-5">
            <p className="text-headline-medium text-text-primary">Built for the businesses that power great conferences.</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <span key={c} className="rounded-full border border-border-hairline bg-background-elevated px-4 py-2 text-body-medium text-text-secondary">
                  {c}
                </span>
              ))}
            </div>
            <Link href="/solutions/event-vendors" className="inline-flex w-fit items-center gap-1 text-body-medium text-signal">
              Event vendors solution <RiArrowRightLine className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* Vision */}
      <Section id="vision">
        <Container>
          <SectionHeading
            eyebrow="Where we are going"
            title={
              <>
                From intelligence tool to the <Accent>operating system</Accent> for events.
              </>
            }
            lead="A live, interconnected marketplace connecting every stakeholder in the conference ecosystem."
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <Card className="relative h-full overflow-hidden p-6 sm:p-10">
                <div aria-hidden className="absolute -top-24 -end-24 size-72 rounded-full bg-signal-glow opacity-60 blur-3xl" />
                <span className="relative inline-flex rounded-full bg-signal-soft px-2.5 py-1 text-caption-1-semibold text-signal">Coming</span>
                <h3 className="text-subsection relative mt-4 text-text-primary">The Identyca Sponsorship Marketplace.</h3>
                <p className="relative mt-4 text-body-regular leading-6 text-text-secondary">
                  Sponsors register a profile - industry, target audience, geography and typical budget - and our AI matches
                  them directly to upcoming conferences that fit. Organizers receive warm, qualified leads from brands that
                  already want their audience. Both sides operate with intelligence instead of instinct.
                </p>
                <div className="relative mt-8 grid gap-5 sm:grid-cols-2">
                  {[
                    { i: RiUserSearchLine, t: "AI-matched sponsor discovery", b: "Sponsors surface the right conferences by audience fit, geography and vertical." },
                    { i: RiHandCoinLine, t: "Warm lead flow", b: "Organizers receive qualified inbound interest from matched sponsors." },
                    { i: RiExchangeDollarLine, t: "Transparent intelligence", b: "Comparable event data, package tiers and audience benchmarks for both sides." },
                    { i: RiLinksLine, t: "Closed-loop tracking", b: "From first match to signed contract, tracked inside the platform." },
                  ].map((f) => (
                    <div key={f.t} className="flex gap-3">
                      <f.i className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden />
                      <div>
                        <p className="text-headline-semibold text-text-primary">{f.t}</p>
                        <p className="mt-1 text-body-regular text-text-secondary">{f.b}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
            <Stagger as="ol" className="flex flex-col gap-3">
              {ROADMAP.map((r, i) => (
                <StaggerItem as="li" key={r.title}>
                  <div className="flex gap-4 rounded-2xl border border-border-hairline bg-background-elevated p-5">
                    <span
                      className={
                        i === 0
                          ? "h-fit rounded-full bg-signal px-2.5 py-1 text-caption-1-semibold text-text-white"
                          : "h-fit rounded-full bg-background-sunken px-2.5 py-1 text-caption-1-semibold text-text-secondary"
                      }
                    >
                      {r.when}
                    </span>
                    <div>
                      <p className="text-headline-semibold text-text-primary">{r.title}</p>
                      <p className="mt-1 text-body-regular text-text-secondary">{r.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* Demo tracks */}
      <Section tone="sunken">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Book a demo"
            title={
              <>
                See Event Intelligence <Accent>live</Accent>.
              </>
            }
            lead="A focused 20-minute walkthrough tailored to your role. No slides. No sales pitch. Just the product."
          />
          <Stagger className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
            {[
              { t: "Organizer demo", b: "A live event project: sponsor recommendations, agenda benchmarking, date conflict detection and a pricing recommendation - for a real brief you bring.", c: "Book organizer demo" },
              { t: "Vendor demo", b: "How Vendor Discovery surfaces upcoming conferences in your region, how to build your service profile, and how to pitch an organizer.", c: "Book vendor demo" },
            ].map((d) => (
              <StaggerItem key={d.t}>
                <Card className="flex h-full flex-col gap-4 p-6 sm:p-8">
                  <h3 className="text-title-2-semibold text-text-primary">{d.t}</h3>
                  <p className="text-body-regular leading-6 text-text-secondary">{d.b}</p>
                  <Cta href={DEMO_HREF} size="md" variant="secondary" trailingIcon={RiArrowRightLine} className="mt-auto w-fit">
                    {d.c}
                  </Cta>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-4 text-body-regular text-text-secondary">
            <a href={BROCHURE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-text-primary">
              <RiDownload2Line className="size-4" aria-hidden /> Download brochure
            </a>
            <span aria-hidden>·</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-text-primary">
              {CONTACT_EMAIL}
            </a>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title={
          <>
            Plan smarter. Book better. <Accent>Renew</Accent> every year.
          </>
        }
        lead="Make faster, more confident decisions - before a single email is sent."
        primary={{ label: "Book a 20-minute walkthrough", href: DEMO_HREF }}
        secondary={{ label: "Log in", href: "https://intel.identyca.io/" }}
      />
    </>
  );
}
