import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiBroadcastLine,
  RiRadarLine,
  RiLayoutGridLine,
  RiCalculatorLine,
  RiTeamLine,
  RiCompass3Line,
  RiArticleLine,
  RiShieldCheckLine,
} from "@remixicon/react";

export type IconType = RemixiconComponentType;

export const CONTACT_EMAIL = "contact@identyca.io";
export const DEMO_HREF = "/demo";

export const LOGINS = [
  { title: "Identyca Real-time", href: "https://platform.identyca.io/", sub: "platform.identyca.io" },
  { title: "Event Intelligence", href: "https://intel.identyca.io/", sub: "intel.identyca.io" },
];

export const PRODUCTS: { title: string; href: string; description: string; icon: IconType }[] = [
  {
    title: "Real-time",
    href: "/real-time",
    description: "Smart badges, AR glasses and the live event platform.",
    icon: RiBroadcastLine,
  },
  {
    title: "Event Intelligence",
    href: "/event-intelligence",
    description: "Sponsors, speakers, venues and dates — researched for you.",
    icon: RiRadarLine,
  },
  {
    title: "Spaces",
    href: "/spaces",
    description: "Persistent networking for venues, campuses and HQs.",
    icon: RiLayoutGridLine,
  },
];

export const COMPANY: { title: string; href: string; description: string; icon: IconType }[] = [
  { title: "About", href: "/about", description: "Who we are and why we're building this.", icon: RiTeamLine },
  { title: "Future vision", href: "/vision", description: "Where networking intelligence goes next.", icon: RiCompass3Line },
  { title: "Insights", href: "/insights", description: "Research and notes on event ROI.", icon: RiArticleLine },
  { title: "Privacy", href: "/privacy-policy", description: "Opt-in by design. No facial recognition.", icon: RiShieldCheckLine },
];

export const ROI_LINK = { title: "ROI Calculator", href: "/roi-calculator", icon: RiCalculatorLine };
