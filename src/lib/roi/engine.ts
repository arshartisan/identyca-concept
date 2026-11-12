import { ADDON_UNIT_COST, TIER_FEE, volumeDiscount } from "./fees";
import type {
  BadgeType,
  RoiFormValues,
  RoiInputs,
  RoiResult,
  RoiResults,
  Scenario,
  ScenarioKey,
  Tier,
} from "./types";

/* ------------------------------------------------------------------ tiers */

export function selectTier(attendees: number, badgeType: BadgeType, wantsAR: boolean): Tier {
  if (badgeType === "nfc") return "LITE";
  if (attendees > 1000) return "INSIGHT"; // Insight never has AR glasses
  return wantsAR ? "VISION" : "CONNECT";
}

export const TIER_LABEL: Record<Tier, string> = {
  LITE: "Lite",
  CONNECT: "Connect",
  VISION: "Vision",
  INSIGHT: "Insight",
};

/* -------------------------------------------------------------- scenarios */

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  conservative: { adoptionMult: 0.75, analyticsMult: 0.75, sponsorSlotDelta: -1, renewalUplift: 0.05, ticketUplift: 0.0, connectionsMult: 1.5, leadsMult: 1.4, searchReduction: 0.5 },
  baseline: { adoptionMult: 1.0, analyticsMult: 1.0, sponsorSlotDelta: 0, renewalUplift: 0.1, ticketUplift: 0.03, connectionsMult: 2.0, leadsMult: 1.8, searchReduction: 0.7 },
  aggressive: { adoptionMult: 1.3, analyticsMult: 1.25, sponsorSlotDelta: 1, renewalUplift: 0.15, ticketUplift: 0.05, connectionsMult: 2.5, leadsMult: 2.2, searchReduction: 0.85 },
};

export const SCENARIO_KEYS: ScenarioKey[] = ["conservative", "baseline", "aggressive"];

/* ------------------------------------------------- networking difficulty */

/** Networking Difficulty Index, 5–100. */
export function calcNDI(attendees: number, venueSqm: number, days: number) {
  const attendeeScore = Math.min(Math.max((Math.log(Math.max(attendees, 50) / 100) / Math.log(2)) * 22, 0), 70);
  const density = attendees / Math.max(venueSqm, 100);
  const densityModifier = Math.min(Math.max((density - 0.25) * 20, 0), 15);
  const durationBonus = Math.max(0, (2 - days) * 15); // 1 day → +15
  return Math.min(Math.max(Math.round(attendeeScore + densityModifier + durationBonus), 5), 100);
}

export type NdiBand = "moderate" | "difficult" | "very-difficult" | "needle";

export const ndiBand = (s: number): NdiBand =>
  s <= 35 ? "moderate" : s <= 50 ? "difficult" : s <= 65 ? "very-difficult" : "needle";

export const ndiLabel = (s: number) =>
  s <= 35 ? "Moderate" : s <= 50 ? "Difficult" : s <= 65 ? "Very Difficult" : "Needle in a Haystack";

/** Minutes per day spent finding a specific person, 5–480. */
export function calcSearchTime(attendees: number, venueSqm: number, days: number) {
  const crowdScanMin = ((attendees / 2) * 6) / 60; // 6 s per person checked
  const noiseMult = 1 + Math.log(Math.max(attendees, 50) / 50) / Math.log(4);
  const walkingOverhead = Math.min((venueSqm / 80) * 2, 30);
  const perDay = (crowdScanMin * noiseMult + walkingOverhead) / days;
  return Math.max(5, Math.min(Math.round(perDay), 480));
}

/** Probability (%) of finding a specific person without a system, 1–99. */
export function calcFindProbability(attendees: number, venueSqm: number, days: number) {
  const numSweeps = Math.min((240 * days) / (Math.max(venueSqm, 100) / 15), 8);
  const recognition = 1 / (1 + attendees / 100);
  const availability = 0.7 / (1 + attendees / 300);
  const p = 1 - Math.pow(1 - availability * recognition, numSweeps);
  return Math.max(1, Math.min(99, Math.round(p * 100)));
}

export const findProbLabel = (p: number) =>
  p >= 70 ? "Likely" : p >= 40 ? "Uncertain" : p >= 15 ? "Unlikely" : "Near Impossible";

export function calcFindProbWithIdentyca(tier: Tier, without: number): number | null {
  const floor = tier === "VISION" ? 98 : tier === "INSIGHT" ? 92 : tier === "CONNECT" ? 85 : null;
  return floor === null ? null : Math.min(99, Math.max(floor, without + 5));
}

export const findProbWithLabel = (p: number) => (p >= 90 ? "Near Certain" : p >= 70 ? "Likely" : "Probable");

/* ------------------------------------------------------------- calculate */

export function calculate(i: RoiInputs, key: ScenarioKey): RoiResult {
  const s = SCENARIOS[key];
  const tier = selectTier(i.A2, i.D0, i.D1);
  const hasRealtime = tier !== "LITE";

  const adoptionRate = Math.min(i.D2 * s.adoptionMult, 0.6);
  const analyticsRate = Math.min(i.D5 * s.analyticsMult, 0.8);
  const sponsorSlots = tier === "LITE" ? 0 : Math.max(i.D6 + s.sponsorSlotDelta, 1); // min 1 slot for real-time tiers
  const pool = i.A2 * (i.A4 + i.A5); // vendor + VIP delegates eligible for upgrades

  const basePlatformFee = TIER_FEE[tier](i.A2);
  const volDiscountAmt = Math.round(basePlatformFee * volumeDiscount(i.A10));
  const platformFee = Math.max(0, basePlatformFee - volDiscountAmt);

  const arOrAppUnits = tier === "LITE" ? 0 : Math.round(pool * adoptionRate);
  const arOrAppUnitCost = ADDON_UNIT_COST[tier];
  const arOrAppResale = tier === "LITE" ? 0 : i.D3;
  const arOrAppCost = arOrAppUnits * arOrAppUnitCost; // pass-through, excluded from organiser cost

  // Badges are bundled in the platform fee: no badge cost, analytics fee or badge offset.
  const badgeCost = 0;
  const analyticsFee = 0;
  const badgeOffset = 0;
  const totalIdentycaCost = platformFee + badgeCost + analyticsFee;
  // Ticketing (C1), app (C2), lead retrieval (C4) and other (C5) are replaced; badge printing (C3) is not.
  const techSavings = i.C1 + i.C2 + i.C4 + i.C5;
  const netCost = totalIdentycaCost - badgeOffset - techSavings;

  const arAppProfit = hasRealtime ? arOrAppUnits * (arOrAppResale - arOrAppUnitCost) : 0;
  const exhibitorAnalyticsRev = hasRealtime ? Math.round(i.A6 * analyticsRate) * i.D4 : 0;
  const sponsorshipRev = sponsorSlots * i.D7;
  const newExhibRenewal = Math.min(i.B5 + s.renewalUplift, 0.95);
  const exhibRenewalRev = i.A6 * (newExhibRenewal - i.B5) * i.B3;
  const newSponRenewal = Math.min(i.B6 + s.renewalUplift, 0.95);
  const sponRenewalRev = i.A7 * (newSponRenewal - i.B6) * i.B4;
  // Ticket premium applies to buyers + vendors only
  const ticketRev = i.A2 * i.A3 * i.B1 * s.ticketUplift + i.A2 * i.A4 * i.B2 * s.ticketUplift;

  const totalNewRevenue = arAppProfit + exhibitorAnalyticsRev + sponsorshipRev + exhibRenewalRev + sponRenewalRev + ticketRev;
  const totalValue = totalNewRevenue + techSavings;
  const netProfit = totalValue - totalIdentycaCost + badgeOffset;
  const roi = (netProfit / Math.max(totalIdentycaCost - badgeOffset, 1)) * 100;

  // Engagement (Lite has no real-time networking: most metrics are null)
  const searchWithout = calcSearchTime(i.A2, i.A9, i.A8);
  const searchWith = hasRealtime ? Math.max(2, Math.round(searchWithout * (1 - s.searchReduction))) : null;
  const pFindWithout = calcFindProbability(i.A2, i.A9, i.A8);
  const pFindWith = calcFindProbWithIdentyca(tier, pFindWithout);
  const connectionsWithout = hasRealtime ? i.E1 : null;
  const connectionsWith = hasRealtime ? i.E1 * s.connectionsMult : null;
  const leadsWithout = hasRealtime ? i.E2 : null;
  const leadsWith = hasRealtime ? i.E2 * s.leadsMult : null;
  const costPerLeadWithout = hasRealtime ? i.B3 / i.E2 : null;
  const costPerLeadWith = hasRealtime && leadsWith !== null ? i.B3 / leadsWith : null;
  const engagementScore =
    hasRealtime && connectionsWith !== null && connectionsWithout !== null && leadsWith !== null && leadsWithout !== null
      ? Math.min(
          100,
          Math.round(
            (connectionsWith / connectionsWithout) * 25 +
              (leadsWith / leadsWithout) * 25 +
              s.searchReduction * 30 +
              (arOrAppUnits / Math.max(i.A2, 1)) * 20,
          ),
        )
      : null;
  const ndi = hasRealtime ? calcNDI(i.A2, i.A9, i.A8) : null;

  return {
    tier,
    tierDisplayName: TIER_LABEL[tier],
    basePlatformFee,
    volDiscountAmt,
    ssDiscountAmt: 0, // no self-service discount: every tier is self-service
    platformFee,
    arOrAppCost,
    arOrAppUnits,
    arOrAppUnitCost,
    arOrAppResale,
    badgeCost,
    analyticsFee,
    totalIdentycaCost,
    badgeOffset,
    techSavings,
    netCost,
    arAppProfit,
    exhibitorAnalyticsRev,
    sponsorshipRev,
    exhibRenewalRev,
    sponRenewalRev,
    ticketRev,
    totalNewRevenue,
    totalValue,
    netProfit,
    roi,
    ndi,
    ndiLabel: ndi !== null ? ndiLabel(ndi) : "",
    searchWithout,
    searchWith,
    pFindWithout,
    pFindWithoutLabel: findProbLabel(pFindWithout),
    pFindWith,
    pFindWithLabel: pFindWith === null ? "" : findProbWithLabel(pFindWith),
    hasRealtime,
    connectionsWithout,
    connectionsWith,
    leadsWithout,
    leadsWith,
    costPerLeadWithout,
    costPerLeadWith,
    engagementScore,
    annualProfit: netProfit * i.A10,
    annualCost: totalIdentycaCost * i.A10,
    scenarioKey: key,
  };
}

export function calculateAll(i: RoiInputs): RoiResults {
  return {
    conservative: calculate(i, "conservative"),
    baseline: calculate(i, "baseline"),
    aggressive: calculate(i, "aggressive"),
  };
}

/* ----------------------------------------------------------- form → inputs */

export const DEFAULT_FORM: RoiFormValues = {
  A1: "",
  A2: 500,
  A3: 60,
  A4: 30,
  A5: 10,
  A6: 25,
  A7: 5,
  A8: 2,
  A9: 3000,
  A10: 1,
  B1: 500,
  B2: 800,
  B3: 15000,
  B4: 30000,
  B5: 65,
  B6: 60,
  C1: 3000,
  C2: 5000,
  C3: 2000,
  C4: 1500,
  C5: 0,
  D0: "rt",
  D1: true,
  D2: 20,
  D3: 700,
  D2app: 20,
  D3app: 100,
  D2insight: 20,
  D3insight: 100,
  D4: 1500,
  D5: 40,
  D6: 2,
  D7: 3000,
  E1: 8,
  E2: 25,
};

/**
 * Fallback used when reading form values - PARITY WITH THE ORIGINAL SITE.
 *
 * The original `readInputs()` used `value || default`, so an entered 0 (or an
 * empty / NaN field) silently becomes the default - e.g. 0 exhibitors → 25,
 * 0 sponsorship slots → 2, 0% renewal → 65%. Kept deliberately so results
 * match the legacy calculator. To let users enter real zeros, change this to
 * `Number.isFinite(value) ? value : fallback` (note: that changes outputs for
 * zero entries).
 */
export function orDefault(value: number, fallback: number): number {
  return Number.isFinite(value) && value !== 0 ? value : fallback;
}

/** Non-fallback numeric read (tech-spend fields allow 0). */
const num = (v: number) => (Number.isFinite(v) ? v : 0);

/** Convert UI form state into normalised calculator inputs (original `readInputs`). */
export function toInputs(f: RoiFormValues): RoiInputs {
  const A2 = Math.max(50, num(f.A2));
  const D0: BadgeType = f.D0 === "nfc" ? "nfc" : "rt";
  const D1 = !!f.D1;
  const tier = selectTier(A2, D0, D1);

  // A single internal D2/D3 per tier (Vision = AR glasses, Connect/Insight = app upgrade)
  let D2: number;
  let D3: number;
  if (tier === "CONNECT") {
    D2 = orDefault(f.D2app, 20) / 100;
    D3 = orDefault(f.D3app, 100);
  } else if (tier === "INSIGHT") {
    D2 = orDefault(f.D2insight, 20) / 100;
    D3 = orDefault(f.D3insight, 100);
  } else {
    D2 = orDefault(f.D2, 20) / 100;
    D3 = orDefault(f.D3, 700);
  }

  return {
    A1: f.A1.trim(),
    A2,
    A3: orDefault(f.A3, 60) / 100,
    A4: orDefault(f.A4, 30) / 100,
    A5: orDefault(f.A5, 10) / 100,
    A6: orDefault(f.A6, 25),
    A7: orDefault(f.A7, 5),
    A8: orDefault(f.A8, 2),
    A9: Math.max(100, orDefault(f.A9, 3000)),
    A10: orDefault(f.A10, 1),
    B1: orDefault(f.B1, 500),
    B2: orDefault(f.B2, 800),
    B3: orDefault(f.B3, 15000),
    B4: orDefault(f.B4, 30000),
    B5: orDefault(f.B5, 65) / 100,
    B6: orDefault(f.B6, 60) / 100,
    C1: num(f.C1),
    C2: num(f.C2),
    C3: num(f.C3),
    C4: num(f.C4),
    C5: num(f.C5),
    D0,
    D1,
    D2,
    D3,
    D4: orDefault(f.D4, 1500),
    D5: orDefault(f.D5, 40) / 100,
    D6: orDefault(f.D6, 2),
    D7: orDefault(f.D7, 3000),
    E1: orDefault(f.E1, 8),
    E2: orDefault(f.E2, 25),
    E3: 0.4,
  };
}

/** Rescale the three delegate percentages to total 100 (residue goes to A3). */
export function normalizePct(a3: number, a4: number, a5: number): [number, number, number] {
  const total = a3 + a4 + a5;
  if (total === 0) return [a3, a4, a5];
  const factor = 100 / total;
  const n4 = Math.round(a4 * factor);
  const n5 = Math.round(a5 * factor);
  let n3 = Math.round(a3 * factor);
  n3 += 100 - (n3 + n4 + n5);
  return [n3, n4, n5];
}

/** Totals the full current tech spend shown under Card C (includes badge printing). */
export const totalTechSpend = (f: Pick<RoiFormValues, "C1" | "C2" | "C3" | "C4" | "C5">) =>
  num(f.C1) + num(f.C2) + num(f.C3) + num(f.C4) + num(f.C5);
