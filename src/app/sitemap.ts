import type { MetadataRoute } from "next";
import { SOLUTION_LINKS } from "@/lib/solutions-index";
import { getAllPosts } from "@/lib/posts";

const BASE = "https://www.identyca.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/problem",
    "/real-time",
    "/event-intelligence",
    "/spaces",
    "/roi-calculator",
    "/solutions",
    "/insights",
    "/about",
    "/vision",
    "/demo",
    "/privacy-policy",
  ];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...SOLUTION_LINKS.map((s) => ({ url: `${BASE}/solutions/${s.slug}`, priority: 0.7 })),
    ...getAllPosts().map((p) => ({ url: `${BASE}/insights/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}
