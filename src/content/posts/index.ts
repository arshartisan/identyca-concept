import whyNetworkingFails from "./why-conference-networking-fails.body";
import sponsorRoi from "./increase-sponsor-roi.body";
import digitalTwin from "./real-time-digital-twin.body";
import organizerResearch from "./ai-ending-organizer-research.body";
import { DEMO_HREF } from "@/lib/site";

export type PostCta = {
  title: string;
  lead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
};

export type PostSource = {
  slug: string;
  title: string;
  /** SEO description (from the original <meta name="description">). */
  description: string;
  category: string;
  /** ISO date, used for <time dateTime>. */
  date: string;
  /** Display date, formatted statically (no runtime Date in server components). */
  dateLabel: string;
  excerpt: string;
  /** Markdown body (h2, paragraphs, lists, quotes, hr, inline bold/italic/links). */
  body: string;
  /** End-of-article call to action. Omitted → the site's default CtaBand. */
  cta?: PostCta;
};

/** Ordered newest first. */
export const POST_SOURCES: PostSource[] = [
  {
    slug: "ai-ending-organizer-research",
    title: "Why Conference Organizers Spend 40% of Their Time on Research - And How AI Is Ending That",
    description:
      "Conference organizers lose nearly half their planning time to manual research. AI-powered Event Intelligence platforms are changing that - here's how.",
    category: "Event Intelligence",
    date: "2026-10-05",
    dateLabel: "5 Oct 2026",
    excerpt:
      "Industry research shows conference organizers invest weeks in sponsor discovery, speaker sourcing, and venue selection before a single delegate ticket is sold. AI-native platforms like Identyca Event Intelligence are compressing that research cycle from months to minutes.",
    body: organizerResearch,
  },
  {
    slug: "real-time-digital-twin",
    title: "The Future of Event Management Is a Real-Time Digital Twin",
    description:
      "Digital Twins are reshaping how events are planned, run, and experienced. Real-time location, Voice AI, and Augmented Reality are converging to make every event floor fully visible, live.",
    category: "Event Technology",
    date: "2026-08-26",
    dateLabel: "26 Aug 2026",
    excerpt:
      "Digital Twins are reshaping how events are planned, run, and experienced. Real-time location, hands-free Voice AI, and Augmented Reality are converging to make every event floor fully visible - live.",
    body: digitalTwin,
    cta: {
      title: "See How It Works",
      lead: "Explore how Identyca's real-time spatial platform works end-to-end - from smart badge issuance to live AR networking to the Operational Command Center.",
      primary: { label: "How It Works", href: "/real-time" },
      secondary: null,
    },
  },
  {
    slug: "increase-sponsor-roi",
    title: "How Event Organizers Can Increase Sponsor ROI",
    description:
      "Sponsor ROI at events is often invisible in real time. Identyca explores how organizers can change that and turn networking technology into a new revenue stream.",
    category: "Sponsor ROI",
    date: "2026-05-26",
    dateLabel: "26 May 2026",
    excerpt:
      "Ask any event organizer what keeps sponsors coming back and you'll hear the same thing: \"They want ROI.\" But sponsor ROI at events is often unclear - and mostly invisible in real time.",
    body: sponsorRoi,
    cta: {
      title: "Want to offer sponsors more than a logo placement?",
      lead: "See how Identyca gives organizers a powerful new sponsor ROI proposition.",
      primary: { label: "Book a Demo", href: DEMO_HREF },
      secondary: { label: "More Insights", href: "/insights" },
    },
  },
  {
    slug: "why-conference-networking-fails",
    title: "Why Conference Networking Fails at Large Events",
    description:
      "At large events, the biggest networking challenge isn't lack of people. It's lack of clarity. Identyca explores why conference networking breaks down and what the fix looks like.",
    category: "Networking",
    date: "2026-05-26",
    dateLabel: "26 May 2026",
    excerpt:
      "Most people go to conferences expecting great conversations. But networking often feels random. You see hundreds of people and think: \"Who should I even talk to?\" The core issue isn't effort - it's signal.",
    body: whyNetworkingFails,
    cta: {
      title: "Ready to transform networking at your next event?",
      lead: "See how Identyca brings spatial networking intelligence to conferences.",
      primary: { label: "Book a Demo", href: DEMO_HREF },
      secondary: { label: "More Insights", href: "/insights" },
    },
  },
];
