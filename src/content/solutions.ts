/**
 * "By Organization Type" solution pages - copy from content brief §5.
 * Slugs match SOLUTION_LINKS in lib/solutions-index.ts (nav + routes).
 *
 * Feature images are kept exactly as the source assigns them (several are
 * placeholders that repeat). The page template shows each screenshot once per
 * page; later rows that reuse an image render as text-only cards.
 */
import { SOLUTION_LINKS } from "@/lib/solutions-index";

export type SolutionSlug = (typeof SOLUTION_LINKS)[number]["slug"];
export type ProductKey = "realtime" | "intel" | "spaces";

export type SolutionFeature = { title: string; body: string; image?: string };
export type SolutionGroup = { product: ProductKey; features: SolutionFeature[] };

export type Solution = {
  slug: SolutionSlug;
  /** Short nav title (from SOLUTION_LINKS). */
  title: string;
  /** Rendered as "For <eyebrow>". */
  eyebrow: string;
  /** Headline split around one serif accent word. */
  headline: { pre: string; accent: string; post?: string };
  lead: string;
  /** Secondary hero CTA. */
  explore: { label: string; href: string };
  groups: SolutionGroup[];
};

const RT = (name: string) => `/images/rt/${name}.png`;
const EI = (name: string) => `/images/ei/${name}.png`;

const EXPLORE_RT = { label: "Explore Real-time", href: "/real-time" };
const EXPLORE_EI = { label: "Explore Event Intelligence", href: "/event-intelligence" };
const EXPLORE_SPACES = { label: "Explore Identyca Spaces", href: "/spaces" };

const titleOf = (slug: SolutionSlug): string => SOLUTION_LINKS.find((l) => l.slug === slug)?.title ?? slug;

const DATA: Omit<Solution, "title">[] = [
  /* ------------------------------------------------------------------ pco */
  {
    slug: "conference-organizers",
    eyebrow: "Professional Conference Organizers",
    headline: { pre: "The complete stack for conference ", accent: "organizers" },
    lead: "From first sponsor outreach to post-event analytics - Identyca Real-time and Event Intelligence power every stage of your conference lifecycle.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Ticketing", body: "End-to-end ticket management with flexible tiers, discount codes, group pricing, and automated confirmation workflows - all in one system.", image: RT("ticketing") },
          { title: "Registration", body: "Custom registration forms, delegate data capture, and pre-event communications - fully integrated with your ticketing and badge system.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Live spatial networking app that maps every attendee in real-time, surfaces relevant connections, and enables ambient introductions without scanning.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Design and issue branded smart badges in NFC, NFC+QR, and UWB formats. Every badge becomes a live identity node on the event floor.", image: RT("badge-design") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Sponsor booth traffic heatmaps, dwell time reports, and NFC lead capture - giving every exhibitor measurable ROI data after the event.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Attendee journey maps, networking density reports, session engagement scores, and sponsor ROI summaries - ready to share with your board the same day.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Real-time event ops hub powered by Voice AI. Monitor session attendance, coordinate staff, and respond to incidents - all from one screen.", image: RT("analytics") },
          { title: "Website Design", body: "Professional event website built and managed within Identyca - registration-integrated, mobile-optimised, and updated in real time as your programme evolves.", image: RT("website-design") },
          { title: "Email & Marketing Campaigns", body: "Targeted email campaigns to delegates, sponsors, and speakers - with open rate tracking, segmentation, and automated follow-up sequences built in.", image: RT("email-marketing") },
          { title: "Agenda & Speaker Management", body: "Build, publish, and update your full conference programme from one dashboard. Speaker profiles, session descriptions, and schedule changes sync to the app instantly.", image: RT("agenda-speaker") },
          { title: "Event Equipment Tracking", body: "Track AV equipment, furniture, and event assets in real-time across your venue using smart sensor badges - know where everything is, always.", image: RT("registration") },
          { title: "Event Branding Designer", body: "Design your event's visual identity - badge templates, app themes, email headers, and website colour schemes - all within Identyca's integrated branding studio.", image: RT("badge-design") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Sponsor Finder", body: "AI-matched sponsor recommendations from a live global events graph, each fit-scored against your audience profile with outreach drafts ready to send.", image: EI("sponsor-finder") },
          { title: "Speaker Discovery", body: "Surface topic-relevant speakers with full speaking history and engagement metrics. AI explains why each speaker fits your programme and audience.", image: EI("speaker-discovery") },
          { title: "Agenda Intelligence", body: "AI analyses attendee profiles and trending topics to recommend agenda structures, session formats, and topic clusters that maximise delegate engagement.", image: EI("agenda-intelligence") },
          { title: "Venue Match", body: "Evidence-based venue shortlists matched to your event size, city, budget, and delegate profile - with capacity data and benchmark pricing included.", image: EI("venue-match") },
          { title: "Pricing Benchmarks", body: "Live delegate and sponsorship pricing benchmarked from comparable events in your vertical, city, and event size - set rates with market confidence.", image: EI("pricing-benchmarks") },
          { title: "Date Conflict Radar", body: "Automatically detect competing conferences on overlapping dates that target the same audience - and model alternative dates to find your optimal scheduling window.", image: EI("date-conflict-radar") },
          { title: "Market Intelligence", body: "Real-time landscape analysis of your event vertical - who is running what, when, where, and at what scale - giving you strategic clarity no industry report can match.", image: EI("market-intelligence") },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ tradeshow */
  {
    slug: "trade-shows",
    eyebrow: "Trade Shows & Exhibitions",
    headline: { pre: "Maximise ", accent: "exhibitor", post: " ROI at every trade show" },
    lead: "Give exhibitors qualified buyer traffic, and buyers a way to find exactly who they came to see - on the show floor in real time.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Registration", body: "Online and on-site registration for exhibitors, buyers, and visitors - with custom forms, badge printing queues, and automated confirmations.", image: RT("registration") },
          { title: "Smart Badge & NFC Lead Capture", body: "Replace business cards with instant NFC badge taps. Leads are captured digitally, exported to CRM, and enriched with contact data automatically.", image: RT("badge-design") },
          { title: "Real-time Networking App", body: "Real-time spatial networking connects qualified buyers with relevant exhibitors on the show floor - based on intent signals and profile data, not chance.", image: RT("networking-app") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Track which booths attract the most traffic, how long buyers stay, and which exhibitors deliver the best ROI - with reports ready post-show.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Real-time ops hub for your show floor team - monitor hall occupancy, manage exhibitor queries, and coordinate staff from a single dashboard.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Footfall, dwell time, networking connections, and exhibitor ROI summaries - delivered as branded reports for your exhibitors immediately after the show.", image: RT("analytics") },
          { title: "Event Equipment Tracking", body: "Track AV equipment, fixtures, and booth assets in real-time across every hall using smart sensor badges - know where everything is at all times.", image: RT("registration") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Sponsor Finder", body: "AI identifies which brands and companies are most likely to exhibit at your show based on their sponsorship history, audience match, and market position.", image: EI("sponsor-finder") },
          { title: "Pricing Benchmarks", body: "Benchmark your booth rates, headline packages, and digital add-ons against comparable trade shows in your category and geography.", image: EI("pricing-benchmarks") },
          { title: "Date Conflict Radar", body: "Automatically detect competing trade shows on overlapping dates that target the same exhibitor and buyer pool - and test alternative dates instantly.", image: EI("date-conflict-radar") },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- association */
  {
    slug: "industry-associations",
    eyebrow: "Industry Associations",
    headline: { pre: "Turn annual congresses into networking ", accent: "powerhouses" },
    lead: "Give your members real value at every event - intelligent networking, smarter agendas, and data that proves the ROI of membership.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Ticketing", body: "Member, non-member, early bird, and group ticket tiers - all in one system with automated confirmations and discount code management.", image: RT("ticketing") },
          { title: "Registration", body: "End-to-end congress registration with custom delegate fields, table assignments, and pre-event communication sequences built in.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Smart member matching surfaces the most relevant connections at your congress based on discipline, interest area, and seniority - at the right moment.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Branded member badges with NFC for contactless check-in and lead exchange. Every badge doubles as proof of professional attendance.", image: RT("badge-design") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Sponsor booth traffic heatmaps and NFC lead capture - giving your industrial sponsors measurable ROI data to justify their continued commitment.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Prove membership ROI with live session attendance data, sponsor booth traffic reports, and post-congress engagement analytics for your board.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Monitor session attendance, coordinate volunteers and staff, and manage congress logistics from one real-time operations screen.", image: RT("analytics") },
          { title: "Website Design", body: "Professional congress website with programme, speaker bios, and sponsor recognition - registration-integrated and updated in real time.", image: RT("website-design") },
          { title: "Email & Marketing Campaigns", body: "Member communication campaigns for call-for-abstracts, early bird deadlines, and post-congress follow-up - all sent from within Identyca.", image: RT("email-marketing") },
          { title: "Agenda & Speaker Management", body: "Full programme management with session tracks, abstract scheduling, and speaker profiles - synced live to the attendee app.", image: RT("agenda-speaker") },
          { title: "Event Equipment Tracking", body: "Track AV and congress equipment across your venue in real-time - so your team always knows where every asset is.", image: RT("registration") },
          { title: "Event Branding Designer", body: "Design your congress visual identity - badge templates, app themes, and email headers - all within Identyca's integrated branding studio.", image: RT("badge-design") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Sponsor Finder", body: "Find sponsors who have supported comparable associations and congresses. AI fit-scores each prospect against your member profile and event size.", image: EI("sponsor-finder") },
          { title: "Speaker Discovery", body: "AI-matched speaker recommendations aligned to your association's theme and audience. See speaking history, topic relevance, and engagement metrics before you reach out.", image: EI("speaker-discovery") },
          { title: "Agenda Intelligence", body: "AI-recommended programme structures based on trending topics in your industry vertical and the session formats that drive the highest engagement at comparable events.", image: EI("agenda-intelligence") },
          { title: "Venue Match", body: "Shortlist congress venues matched to your expected attendance, session format, and geography - with capacity data and benchmark day-delegate rates included.", image: EI("venue-match") },
          { title: "Pricing Benchmarks", body: "Delegate fee and venue pricing benchmarks from comparable industry congresses worldwide - so you set rates with confidence, not guesswork.", image: EI("pricing-benchmarks") },
          { title: "Date Conflict Radar", body: "Identify competing congresses in your sector on overlapping dates - and model alternative scheduling windows to protect your attendance numbers.", image: EI("date-conflict-radar") },
          { title: "Market Intelligence", body: "Landscape view of your industry's event calendar - who is running what, at what scale, and in which cities - so your association stays strategically positioned.", image: EI("market-intelligence") },
        ],
      },
    ],
  },

  /* --------------------------------------------------------------- agency */
  {
    slug: "event-agencies",
    eyebrow: "Event Agencies",
    headline: { pre: "Differentiate your agency with spatial ", accent: "intelligence" },
    lead: "Offer clients a platform that no other agency can match - from AI-driven planning to real-time floor intelligence on event day.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Ticketing", body: "End-to-end ticket management deployed for your clients - all branded to their event, with your agency managing the full setup and reporting.", image: RT("ticketing") },
          { title: "Registration", body: "Custom registration forms and delegate data capture deployed under your client's brand - with your agency controlling the full workflow.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Live spatial networking deployed for your client's attendees - maps every delegate, surfaces connections, and enables ambient introductions.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Deploy fully branded smart badges for your client. NFC, NFC+QR, and UWB formats - designed inside Identyca's branding studio, issued at check-in.", image: RT("badge-design") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Deliver branded post-event sponsor analytics to your clients - booth traffic, dwell time, and NFC lead capture data as part of your agency's reporting suite.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Footfall, session engagement, sponsor ROI, and networking density - delivered as branded client reports that elevate your agency's value proposition.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Real-time event operations screen for your production team - session status, staff locations, incident response, and crowd movement all in one view.", image: RT("analytics") },
          { title: "Website Design", body: "Client event websites built inside Identyca - registration-integrated, mobile-optimised, and updated in real time as the programme evolves.", image: RT("website-design") },
          { title: "Email & Marketing Campaigns", body: "Targeted delegate, sponsor, and speaker email campaigns managed by your agency within Identyca - with tracking and automated follow-up sequences.", image: RT("email-marketing") },
          { title: "Agenda & Speaker Management", body: "Build and publish your client's full event programme from one dashboard - speaker profiles, session scheduling, and live programme updates synced to the app.", image: RT("agenda-speaker") },
          { title: "Event Equipment Tracking", body: "Track AV, staging, and production assets in real-time across the venue using smart sensor badges - your production team always knows where everything is.", image: RT("registration") },
          { title: "Event Branding Designer", body: "Design client event visual identities - badge templates, app themes, email headers, and website colour schemes - all within Identyca's integrated branding studio.", image: RT("badge-design") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Opportunity Discovery", body: "Upcoming events matched to your agency's service capability, geography, and client history - so you are always first to know about relevant new opportunities.", image: EI("opportunity-discovery") },
          { title: "Event Record", body: "A structured record of every event you have delivered - venue, attendance, client, budget tier, and service scope - building your agency's intelligence asset over time.", image: EI("opportunity-discovery") },
          { title: "Price Posturing", body: "Benchmark your agency fees and service packages against comparable agencies in your market - so you price competitively and protect your margins.", image: EI("pricing-benchmarks") },
          { title: "Forward Calendar", body: "A rolling 18-month view of upcoming events in your target verticals - so you can plan your business development pipeline and resource allocation well in advance.", image: EI("forward-calendar") },
          { title: "Opportunity Alerts", body: "Automated alerts when new events matching your agency profile are added to the platform - so you pitch first and compete on timing, not just capability.", image: EI("market-intelligence") },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- media */
  {
    slug: "media-companies",
    eyebrow: "Media Companies",
    headline: { pre: "Make your flagship events ", accent: "unmissable" },
    lead: "Turn conferences and summits into high-ROI sponsorship assets backed by live data - and give your audience the networking experience they deserve.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Ticketing", body: "Reader, subscriber, VIP, and press passes all managed in one system. Flexible discount rules, group pricing, and automated confirmation workflows.", image: RT("ticketing") },
          { title: "Registration", body: "Custom registration capturing delegate job title, company, and editorial interests - so your commercial team knows exactly who is in the room.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Attract senior executives and decision-makers with a spatial networking experience they can't get anywhere else - elevating your event's brand and repeat attendance.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Branded smart badges issued at check-in - NFC-enabled for contactless lead exchange between your sponsors and senior attendees.", image: RT("badge-design") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Sponsor booth traffic, dwell time, and NFC lead capture data - giving your commercial partners the measurable ROI that justifies their sponsorship spend.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Real-time session attendance, audience heat maps, and engagement scores for your editorial and commercial teams - mid-event and post-event.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Manage your summit floor in real time - session status, AV coordination, VIP tracking, and staff communication from a single operations screen.", image: RT("analytics") },
          { title: "Website Design", body: "Professional event website with programme, speaker bios, and sponsor recognition - registration-integrated and updated in real time.", image: RT("website-design") },
          { title: "Email & Marketing Campaigns", body: "Subscriber, reader, and sponsor email campaigns for your event - with open rate tracking, segmentation by audience tier, and automated reminders.", image: RT("email-marketing") },
          { title: "Agenda & Speaker Management", body: "Build and publish your full event programme from one dashboard - speaker profiles, session scheduling, and live updates synced to the attendee app.", image: RT("agenda-speaker") },
          { title: "Event Equipment Tracking", body: "Track AV equipment and event assets in real-time across your venue - so your production team always knows where everything is.", image: RT("registration") },
          { title: "Event Branding Designer", body: "Design your summit's visual identity - badge templates, app themes, and email headers - all within Identyca's integrated branding studio.", image: RT("badge-design") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Sponsor Finder", body: "AI-matched sponsor recommendations by editorial vertical and audience segment, with fit scores and historical sponsorship data from comparable media events.", image: EI("sponsor-finder") },
          { title: "Speaker Discovery", body: "Find thought leaders whose expertise aligns with your editorial themes. Surface speaking history, audience engagement metrics, and a ranked rationale for each recommendation.", image: EI("speaker-discovery") },
          { title: "Agenda Intelligence", body: "AI recommends session themes and formats based on what is driving the highest audience engagement across comparable media summits and industry events.", image: EI("agenda-intelligence") },
          { title: "Venue Match", body: "Evidence-based venue shortlists matched to your expected attendance, editorial format, and city - with capacity data and benchmark pricing.", image: EI("venue-match") },
          { title: "Pricing Benchmarks", body: "Live pricing data from comparable media summits - set delegate rates and sponsorship packages backed by current market evidence.", image: EI("pricing-benchmarks") },
          { title: "Date Conflict Radar", body: "Identify competing media summits and industry events on overlapping dates - and model alternative scheduling windows to maximise attendance.", image: EI("date-conflict-radar") },
          { title: "Market Intelligence", body: "Real-time landscape view of your editorial vertical's event calendar - who is running what, at what scale, and with which sponsors - so you stay competitively positioned.", image: EI("market-intelligence") },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ nonprofit */
  {
    slug: "non-profits",
    eyebrow: "Non-Profit Organizations",
    headline: { pre: "Do more with your events ", accent: "budget" },
    lead: "Run fundraisers, galas, and awareness events that feel premium - without premium budgets. Identyca helps non-profits maximise every dollar spent on events.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Ticketing", body: "Donor, volunteer, and general admission ticketing with flexible pricing tiers - including donation add-ons and complimentary ticket management.", image: RT("ticketing") },
          { title: "Registration", body: "Simple registration with custom fields, table assignments, and dietary requirements - without the complexity or cost of enterprise event platforms.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Smart matching connects donors, volunteers, and beneficiaries based on shared interests and goals - making your gala or awareness event meaningfully connective.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Branded smart badges issued at check-in - adding a professional, premium feel to your fundraiser or gala without a large production budget.", image: RT("badge-design") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Give your sponsors verified booth traffic and engagement data - making it easier to retain their support year after year with evidence of ROI.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Attendance data, session engagement, donor interaction maps, and sponsor recognition metrics - consolidated into a report for your board and funders.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Coordinate volunteers, monitor event flow, and manage logistics from one real-time operations screen - keeping your lean team in full control.", image: RT("analytics") },
          { title: "Website Design", body: "Professional event website with your cause story, programme, and registration - built inside Identyca without external web design costs.", image: RT("website-design") },
          { title: "Email & Marketing Campaigns", body: "Donor, volunteer, and supporter email campaigns with segmentation, tracking, and automated follow-up - all sent from within Identyca.", image: RT("email-marketing") },
          { title: "Agenda & Speaker Management", body: "Programme management for your event - session schedule, speaker bios, and live updates synced to the attendee app.", image: RT("agenda-speaker") },
          { title: "Event Equipment Tracking", body: "Track AV and event assets in real-time across your venue - ensuring nothing is lost and your volunteer team is never searching for equipment.", image: RT("registration") },
          { title: "Event Branding Designer", body: "Design your event's visual identity inside Identyca - badge templates, app themes, and email headers - at no extra design cost.", image: RT("badge-design") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Sponsor Finder", body: "AI identifies corporate sponsors who have supported comparable non-profit events and causes - fit-scored to your mission and audience profile.", image: EI("sponsor-finder") },
          { title: "Speaker Discovery", body: "Surface relevant keynote speakers and community leaders whose expertise aligns with your cause - with speaking history and engagement metrics included.", image: EI("speaker-discovery") },
          { title: "Agenda Intelligence", body: "AI recommends programme structures based on what drives the highest engagement at comparable non-profit galas and awareness events.", image: EI("agenda-intelligence") },
          { title: "Venue Match", body: "Shortlist venues matched to your expected attendance and budget - with capacity data and benchmark pricing so you stay within your event budget.", image: EI("venue-match") },
          { title: "Pricing Benchmarks", body: "Ticket pricing and sponsorship package benchmarks from comparable non-profit and fundraising events - set rates that maximise revenue without alienating your community.", image: EI("pricing-benchmarks") },
          { title: "Date Conflict Radar", body: "Identify competing fundraising galas and awareness events on overlapping dates - so you schedule when your community's attention is fully available.", image: EI("date-conflict-radar") },
          { title: "Market Intelligence", body: "Track what other organisations in your space are running, how they are positioned, and which sponsors are supporting them - so you stay strategically ahead.", image: EI("market-intelligence") },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ corporate */
  {
    slug: "corporations",
    eyebrow: "Corporations",
    headline: { pre: "Elevate internal events and client ", accent: "summits" },
    lead: "From sales kickoffs to client-facing summits - make every corporate event a measurable success with live intelligence and seamless logistics.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Registration", body: "Custom registration for internal employees, clients, and partners - with dietary requirements, session preferences, and team allocation managed in one system.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Smart networking at summits, kickoffs, and client events surfaces the right connections in real-time - no awkward cold introductions, just relevant conversations.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Issue fully branded smart badges for your sales teams and client attendees. NFC taps capture leads and conversations digitally - ready for CRM export.", image: RT("badge-design") },
          { title: "Real-time Post-Event Analytics", body: "Track session attendance, audience engagement, and employee movement in real time - with post-event reports for your corporate events team and leadership.", image: RT("analytics") },
          { title: "Event Branding Designer", body: "Design fully branded event collateral - badge templates, app themes, email headers, and digital signage - all within Identyca's integrated branding studio.", image: RT("badge-design") },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------- academic */
  {
    slug: "academic-associations",
    eyebrow: "Academic Associations",
    headline: { pre: "Smarter academic conferences from paper to ", accent: "poster" },
    lead: "Help researchers, faculty, and students connect with purpose at academic conferences and symposia - powered by real-time spatial intelligence.",
    explore: EXPLORE_RT,
    groups: [
      {
        product: "realtime",
        features: [
          { title: "Ticketing", body: "Academic delegate, presenter, and student ticket tiers with early bird pricing, group rates, and automated confirmation workflows.", image: RT("ticketing") },
          { title: "Registration", body: "End-to-end congress registration capturing institution, discipline, and abstract submission reference - integrated with your badge and attendance system.", image: RT("registration") },
          { title: "Real-time Networking App", body: "Match attendees by research discipline, institution, and academic interest - so researchers find the right collaborators and faculty make meaningful introductions.", image: RT("networking-app") },
          { title: "Badge Design & Smart Badge Issuance", body: "Branded smart badges with NFC for contactless session check-in and CPD tracking - issued at registration and verified throughout the conference.", image: RT("badge-design") },
          { title: "Exhibitor Lead Capture & Analytics", body: "Industry sponsor booth traffic and engagement data - giving your exhibiting partners measurable ROI from their academic conference presence.", image: RT("analytics") },
          { title: "Real-time Post-Event Analytics", body: "Session attendance, audience density, networking connections, and sponsor engagement data - ready for your conference secretariat and board immediately post-event.", image: RT("analytics") },
          { title: "Operational Command Center", body: "Monitor session attendance, coordinate AV teams, and manage conference logistics from one real-time operations screen - keeping your secretariat in full control.", image: RT("analytics") },
          { title: "Website Design", body: "Professional academic conference website with call-for-abstracts, programme, and speaker profiles - registration-integrated and updated in real time.", image: RT("website-design") },
          { title: "Email & Marketing Campaigns", body: "Call-for-abstracts, early bird, and post-conference follow-up email campaigns - segmented by academic role and sent from within Identyca.", image: RT("email-marketing") },
          { title: "Agenda & Speaker Management", body: "Full programme management with parallel session tracks, abstract scheduling, and keynote profiles - all synced live to the attendee app.", image: RT("agenda-speaker") },
          { title: "Event Equipment Tracking", body: "Track AV equipment and conference assets across your venue in real-time - so your secretariat team always knows where everything is.", image: RT("registration") },
          { title: "Event Branding Designer", body: "Design your conference's visual identity inside Identyca - badge templates, app themes, and email headers - all aligned to your association's brand guidelines.", image: RT("badge-design") },
        ],
      },
      {
        product: "intel",
        features: [
          { title: "Sponsor Finder", body: "Identify research councils, academic publishers, and industry bodies who have sponsored comparable conferences - with fit scores and outreach drafts ready to use.", image: EI("sponsor-finder") },
          { title: "Speaker Discovery", body: "Surface researchers and academics with strong speaking track records in your conference's disciplines - ranked by topic fit, publication impact, and audience profile.", image: EI("speaker-discovery") },
          { title: "Agenda Intelligence", body: "AI recommends session tracks and formats based on trending research topics in your discipline and what drives the highest delegate engagement at comparable conferences.", image: EI("agenda-intelligence") },
          { title: "Venue Match", body: "Shortlist academic conference venues matched to your expected attendance, session format, and city - with capacity data and benchmark DDR pricing.", image: EI("venue-match") },
          { title: "Pricing Benchmarks", body: "Academic delegate, presenter, and student registration pricing from comparable conferences in your field - so you set rates backed by evidence, not tradition.", image: EI("pricing-benchmarks") },
          { title: "Date Conflict Radar", body: "Detect competing academic conferences in your discipline on overlapping dates - and model alternative scheduling windows to protect your abstract submission numbers.", image: EI("date-conflict-radar") },
          { title: "Market Intelligence", body: "Real-time landscape of your discipline's conference calendar - who is running what, at what scale, and with which sponsors - so your association stays strategically positioned.", image: EI("market-intelligence") },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- hotel */
  {
    slug: "hotels",
    eyebrow: "Hotels",
    headline: { pre: "Make your events wing the ", accent: "smartest", post: " space in the city" },
    lead: "Hotels with conference facilities can offer event clients something no competitor can - a permanently installed spatial intelligence layer that activates in minutes.",
    explore: EXPLORE_SPACES,
    groups: [
      {
        product: "spaces",
        features: [
          { title: "Conference Floor Wayfinding", body: "Instant turn-by-turn navigation from hotel lobby to any conference room, ballroom, or breakout space - badge-free, on attendees' own smartphones.", image: EI("venue-match") },
          { title: "Live Occupancy & F&B Queue Intelligence", body: "Monitor ballroom occupancy, foyer crowd density, and F&B queue build-up in real time - allowing your operations team to redirect staff before problems occur.", image: RT("analytics") },
          { title: "MICE Event Networking", body: "Real-time AI networking activates automatically for each MICE event hosted at your hotel - making your venue more commercially attractive than competing properties.", image: RT("networking-app") },
          { title: "Permanent Beacon Infrastructure", body: "Battery-powered beacons installed once across all conference rooms, ballrooms, and foyers. No reinstallation, no per-event hardware, no maintenance team required.", image: RT("registration") },
          { title: "Premium MICE Add-on Revenue", body: "Resell Identyca Spaces into every MICE booking as a premium technology package. Each event activation adds incremental revenue at near-zero marginal cost to your hotel.", image: RT("analytics") },
          { title: "Scales Across All Event Sizes", body: "From a 50-person boardroom to a 5,000-person gala - the same beacon infrastructure serves every event without any changes to hardware or configuration.", image: RT("badge-design") },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- venue */
  {
    slug: "convention-centers",
    eyebrow: "Expo & Convention Centers",
    headline: { pre: "Install once. Power every event ", accent: "forever", post: "." },
    lead: "Transform your venue into a permanently intelligent, navigable, and networkable environment. One-time beacon install. Annual licence. Resold into every event you host.",
    explore: EXPLORE_SPACES,
    groups: [
      {
        product: "spaces",
        features: [
          { title: "Indoor Wayfinding & Navigation", body: "Turn-by-turn navigation guides every attendee to any hall, booth, or session in your venue. No signage printing, no staff questions - just frictionless wayfinding.", image: EI("venue-match") },
          { title: "Real-time Crowd & Zone Analytics", body: "Live occupancy maps across all your halls and zones - so event organizers and your operations team can manage crowd flow and prevent bottlenecks in real time.", image: RT("analytics") },
          { title: "AI Attendee Networking", body: "Real-time spatial networking layer activated automatically for every event hosted in your venue - connecting attendees intelligently without any per-event setup.", image: RT("networking-app") },
          { title: "One-Time Beacon Install", body: "Battery-powered UWB and BLE beacons placed across all halls in one install day - no cabling, no structural changes, no maintenance team needed for reactivation.", image: RT("registration") },
          { title: "Gamification & Location Triggers", body: "Booth passport stamp games, treasure hunts, leaderboards, and location-triggered notifications - giving event organizers premium engagement tools built into your infrastructure.", image: RT("badge-design") },
          { title: "Revenue Per Event Model", body: "Licence once, resell into every event you host at your venue. Each activation adds an incremental revenue line for your venue - with no per-event reinstallation cost.", image: RT("analytics") },
        ],
      },
    ],
  },

  /* --------------------------------------------------------------- vendor */
  {
    slug: "event-vendors",
    eyebrow: "Event Vendors",
    headline: { pre: "Find and win the right events with ", accent: "data", post: ", not cold calls" },
    lead: "Identyca Event Intelligence gives AV companies, catering firms, agencies, hotels, and event service providers a structured discovery channel into the events market.",
    explore: EXPLORE_EI,
    groups: [
      {
        product: "intel",
        features: [
          { title: "Opportunity Discovery", body: "Upcoming events matched to your service category, city, and event size - updated continuously so you are always first to know about relevant new opportunities.", image: EI("opportunity-discovery") },
          { title: "Event Record", body: "A structured record of every event you have been involved in - venue, attendance, client, budget tier, and service scope - building your company's intelligence asset over time.", image: EI("opportunity-discovery") },
          { title: "Price Posturing", body: "Benchmark your service fees and packages against comparable vendors in your market and category - so you price competitively and protect your margins on every pitch.", image: EI("pricing-benchmarks") },
          { title: "Forward Calendar", body: "A rolling 18-month view of upcoming events in your target verticals and geographies - so you can plan your business development pipeline and resource allocation well in advance.", image: EI("forward-calendar") },
          { title: "Opportunity Alerts", body: "Automated alerts when new events matching your vendor profile are added to the platform - so you pitch first and compete on timing, not just capability.", image: EI("market-intelligence") },
        ],
      },
    ],
  },
];

const BY_SLUG = new Map<string, Solution>(DATA.map((s) => [s.slug, { ...s, title: titleOf(s.slug) }]));

/** All solutions in nav order (SOLUTION_LINKS). */
export const SOLUTIONS: Solution[] = SOLUTION_LINKS.map((l) => BY_SLUG.get(l.slug)).filter(
  (s): s is Solution => Boolean(s),
);

export function getSolution(slug: string): Solution | undefined {
  return BY_SLUG.get(slug);
}

export function solutionHeadline(s: Solution) {
  return `${s.headline.pre}${s.headline.accent}${s.headline.post ?? ""}`;
}

export function solutionProducts(s: Solution): ProductKey[] {
  return s.groups.map((g) => g.product);
}
