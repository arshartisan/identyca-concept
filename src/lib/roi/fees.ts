import type { Tier } from "./types";

/**
 * Identyca platform fees — USD per event, badges included.
 * Pricing as of October 2026 (70% badge-retrieval scenario).
 * Upper bounds are inclusive.
 */

/** Lite: NFC badges, any event size. */
export const liteFee = (n: number) =>
  n <= 200 ? 2000
  : n <= 500 ? 2750
  : n <= 1000 ? 4000
  : n <= 2000 ? 6500
  : n <= 5000 ? 11000
  : n <= 10000 ? 16000
  : n <= 20000 ? 22000
  : 28000;

/** Connect: real-time networking badges, up to 1,000 attendees, no AR. */
export const connectFee = (n: number) =>
  n <= 200 ? 3400 : n <= 400 ? 6750 : n <= 600 ? 9750 : n <= 800 ? 12000 : 13750;

/** Vision: real-time networking badges + AR glasses, up to 1,000 attendees. */
export const visionFee = (n: number) =>
  n <= 200 ? 7750 : n <= 400 ? 14500 : n <= 600 ? 19000 : n <= 800 ? 23500 : 27500;

/** Insight: real-time networking badges, 1,000+ attendees. */
export const insightFee = (n: number) =>
  n <= 2000 ? 14000 : n <= 5000 ? 18000 : n <= 10000 ? 23000 : n <= 20000 ? 29000 : 34000;

export const TIER_FEE: Record<Tier, (n: number) => number> = {
  LITE: liteFee,
  CONNECT: connectFee,
  VISION: visionFee,
  INSIGHT: insightFee,
};

/**
 * Per-unit add-on cost paid to Identyca. A pass-through (the organiser resells
 * to delegates), so it is NOT counted as organiser cost.
 * Vision: AR glasses rental. Connect/Insight: app upgrade. Lite: none.
 */
export const ADDON_UNIT_COST: Record<Tier, number> = {
  LITE: 0,
  CONNECT: 25,
  VISION: 300,
  INSIGHT: 25,
};

/** Volume discount on the base platform fee, all tiers. */
export const volumeDiscount = (eventsPerYear: number) =>
  eventsPerYear >= 20 ? 0.15 : eventsPerYear >= 10 ? 0.1 : eventsPerYear >= 5 ? 0.05 : 0;
