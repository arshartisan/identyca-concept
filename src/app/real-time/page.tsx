import type { Metadata } from "next";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiCalendarScheduleLine,
  RiCommandLine,
  RiCompass3Line,
  RiEyeLine,
  RiFilter3Line,
  RiIdCardLine,
  RiMailSendLine,
  RiPaletteLine,
  RiPriceTag3Line,
  RiRadarLine,
  RiRouteLine,
  RiSmartphoneLine,
  RiTicket2Line,
  RiTruckLine,
  RiUserStarLine,
  RiMoneyDollarCircleLine,
  RiVipCrownLine,
  RiTrophyLine,
  RiDatabase2Line,
} from "@remixicon/react";
import { Accent, Card, Container, Section, SectionHeading } from "@/components/site/section";
import { CtaBand, FeatureGrid, PageHero, Steps } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { VideoPlayer } from "@/components/site/video-player";
import { VIDEOS, POSTERS, WEBM } from "@/lib/videos";
import { ArViewfinder } from "@/components/home/ar-viewfinder";
import { ArchitectureFlow } from "@/components/realtime/architecture-flow";
import { Testimonials } from "@/components/home/home-sections";
import { DEMO_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Real-time - spatial networking & event management",
  description:
    "Identyca Real-time: smart badges, AR glasses and a 360° event platform. See who matters on the event floor - hands-free, opt-in, no facial recognition.",
};

export default function RealtimePage() {
  return (
    <>
      <PageHero
        eyebrow="Identyca Real-time"
        title={
          <>
            See who <Accent>matters</Accent>. Connect instantly.
          </>
        }
        lead="No scanning. No awkward small talk. No friction. Just instant, spatial awareness of everyone around you - so networking finally works."
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
      >
        <ArViewfinder />
      </PageHero>

      {/* How it works */}
      <Section className="pt-0 sm:pt-0">
        <Container>
          <SectionHeading
            eyebrow="Our differentiator"
            title={
              <>
                Real-time spatial <Accent>networking</Accent> intelligence.
              </>
            }
          />
          <Steps
            className="mt-14"
            steps={[
              {
                title: "Wear smart badge",
                body: "Every attendee receives a smart badge that continuously broadcasts their professional identity to the spatial network.",
              },
              {
                title: "Use AR glasses or the app",
                body: "Sponsors and delegates wear lightweight AR glasses or use the mobile app to receive spatial identity data rendered in real time.",
              },
              {
                title: "See identities instantly",
                body: "Floating name cards appear above every person - name, title, company and relevance score. No phone. No scanning. No awkwardness.",
              },
            ]}
          />
          <Reveal className="mx-auto mt-20 max-w-3xl text-center">
            <p className="font-serif text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-text-primary">
              “A hands-free LinkedIn in the physical world.”
            </p>
          </Reveal>
          <Stagger className="mt-16 grid gap-4 md:grid-cols-2">
            <StaggerItem>
              <VideoPlayer src={VIDEOS.inAction} poster={POSTERS.inAction} title="Identyca in action" />
            </StaggerItem>
            <StaggerItem>
              <VideoPlayer src={VIDEOS.avatar} poster={POSTERS.avatar} title="See how Zarina networks at conferences" />
            </StaggerItem>
          </Stagger>
        </Container>
      </Section>

      {/* Features */}
      <Section tone="sunken">
        <Container>
          <SectionHeading
            eyebrow="Real-time features"
            title={
              <>
                What you <Accent>see</Accent> & get.
              </>
            }
            lead="Every interaction feels like you already did your homework on everyone in the room."
          />
          <FeatureGrid
            className="mt-14"
            items={[
              { icon: RiEyeLine, title: "Live identity overlay", body: "Floating labels show name, title, company and relevance score above every person - updating in real time as people move." },
              { icon: RiRadarLine, title: "Proximity radar", body: "A spatial mini-map shows who's nearby, their distance and movement - helping you navigate the floor with purpose." },
              { icon: RiFilter3Line, title: "Smart filtering", body: "Filter by seniority, industry, company size or intent. Only see the people who match your goals." },
              { icon: RiRouteLine, title: "Smart navigation", body: "Guided directions to any selected delegate or exhibition booth on the event floor. Walk straight to the people who matter." },
              { icon: RiBarChartBoxLine, title: "Interaction analytics", body: "Post-event reports showing dwell time, hot zones, sponsor booth engagement and attendee journey maps." },
              { icon: RiIdCardLine, title: "Smart badge issuance", body: "Design and issue branded smart badges in NFC, NFC+QR and UWB real-time sensor formats." },
            ]}
          />
        </Container>
      </Section>

      {/* Technology */}
      <Section id="technology">
        <Container>
          <SectionHeading
            eyebrow="Technology"
            title={
              <>
                Powered by precision <Accent>spatial</Accent> intelligence.
              </>
            }
            lead="Enterprise-grade spatial accuracy. Privacy-first design. Built for the real world."
          />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Sensor-based positioning", b: "Know exactly who is standing next to you - not just who is in the same room.", c: ["30–50 cm accuracy", "~100 m range"] },
              { t: "Sensor fusion", b: "Positioning and IMU sensors fused in real time for stable, low-latency identity tracking - even in crowds.", c: ["Real-time fusion", "<50 ms latency"] },
              { t: "AR rendering engine", b: "Spatial anchors rendered as floating overlays on lightweight AR glasses designed for all-day comfort.", c: ["60 fps overlay", "Lightweight optics"] },
              { t: "Privacy-first design", b: "Zero facial recognition. Identity is broadcast only by opt-in smart badge. Attendees control their visibility.", c: ["No facial recognition", "Opt-in only"] },
            ].map((x) => (
              <StaggerItem key={x.t}>
                <Card className="flex h-full flex-col gap-3 p-6">
                  <h3 className="text-title-3-semibold text-text-primary">{x.t}</h3>
                  <p className="text-body-regular text-text-secondary">{x.b}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                    {x.c.map((c) => (
                      <span key={c} className="rounded-full bg-background-sunken px-2.5 py-1 font-mono text-caption-2-medium text-text-secondary">
                        {c}
                      </span>
                    ))}
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <div className="rounded-3xl border border-border-hairline bg-background-sunken p-5 sm:p-8">
              <p className="eyebrow mb-6 text-text-tertiary">Architecture</p>
              <ArchitectureFlow />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 360 platform */}
      <Section tone="ink">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            eyebrow="360° event management"
            title={
              <>
                One platform to plan, run and <Accent>grow</Accent> your event.
              </>
            }
            lead="Everything you need - in one unified platform."
          />
          <FeatureGrid
            className="mt-14"
            columns={2}
            items={[
              { icon: RiTicket2Line, title: "Delegate registration & ticketing", body: "End-to-end registration with custom forms, ticket tiers and automated confirmation workflows." },
              { icon: RiPriceTag3Line, title: "Ticket pricing", body: "Flexible pricing engine for early bird, standard, VIP and group rates with dynamic discount rules." },
              { icon: RiIdCardLine, title: "Badge design & smart badge issuance", body: "Design branded delegate badges and issue smart badges in NFC, NFC+QR and UWB real-time sensor formats." },
              { icon: RiSmartphoneLine, title: "Real-time networking app", body: "Live spatial networking app that maps every attendee in real time and surfaces the most relevant connections." },
              { icon: RiPaletteLine, title: "Event branding designer", body: "AI-enabled module for signage, banners, backdrops and branded collateral - no design team required." },
              { icon: RiBarChartBoxLine, title: "Real-time analytics", body: "Live dashboards tracking session attendance, exhibitor traffic, zone occupancy and audience engagement." },
              { icon: RiCommandLine, title: "Operational command center", body: "Real-time operations hub powered by Voice AI - monitor, coordinate and respond from one screen." },
              { icon: RiMailSendLine, title: "Email & marketing campaigns", body: "Pre-event reminders, session announcements, sponsor promotions and post-event follow-ups." },
              { icon: RiCalendarScheduleLine, title: "Agenda & speaker management", body: "Build and publish your agenda, manage speaker profiles, coordinate schedules and push live updates." },
              { icon: RiTruckLine, title: "Event equipment tracking", body: "Track AV equipment, furniture and event assets in real time across your venue using smart sensor badges." },
            ]}
          />
          <Reveal className="mt-14">
            <VideoPlayer src={VIDEOS.realtime} webm={WEBM.realtime} poster="/images/poster-rt-v2.jpg" title="Identyca Real-time - product explainer" />
          </Reveal>
        </Container>
      </Section>

      {/* ROI */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Built for event ROI"
            title={
              <>
                Identyca doesn&apos;t cost your event money - it <Accent>makes</Accent> your event money.
              </>
            }
          />
          <FeatureGrid
            className="mt-14"
            items={[
              { icon: RiUserStarLine, title: "Increase sponsor ROI", body: "Sponsors connect only with pre-qualified, relevant attendees. Every conversation has intent. Expect a 3–5× increase in exhibitor satisfaction." },
              { icon: RiMoneyDollarCircleLine, title: "New revenue stream", body: "Rent AR glasses to sponsors and VIP delegates at a premium. Fully offset the platform cost - and profit on the hardware." },
              { icon: RiVipCrownLine, title: "Premium VIP experience", body: "A truly differentiated experience for top-tier delegates. AR networking becomes the most talked-about feature of your event." },
              { icon: RiTrophyLine, title: "Differentiate your event", body: "In a crowded market, AR networking is a defensible differentiator. Be first in your category to offer spatial intelligence." },
              { icon: RiDatabase2Line, title: "Monetizable data & analytics", body: "Post-event reports on attendee movement, booth dwell time, networking density and connection conversion rates." },
              { icon: RiCompass3Line, title: "Model it first", body: "Use the ROI Calculator to see sponsor uplift, renewal improvements and cost offsets - modelled to your event.", meta: <Link href="/roi-calculator" className="text-body-medium text-signal">Open ROI Calculator →</Link> },
            ]}
          />
        </Container>
      </Section>

      <Testimonials />
      <CtaBand />
    </>
  );
}
