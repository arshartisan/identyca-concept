/**
 * ROI calculator types. Percentages in `RoiInputs` are fractions (0.6 = 60%);
 * the UI-facing `RoiFormValues` keeps them as whole percents.
 */

export type Tier = "LITE" | "CONNECT" | "VISION" | "INSIGHT";
export type BadgeType = "rt" | "nfc";
export type ScenarioKey = "conservative" | "baseline" | "aggressive";

/** Normalised calculator inputs (mirrors the original `readInputs()` output). */
export interface RoiInputs {
  A1: string;
  A2: number;
  A3: number;
  A4: number;
  A5: number;
  A6: number;
  A7: number;
  A8: number;
  A9: number;
  A10: number;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
  B5: number;
  B6: number;
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  C5: number;
  D0: BadgeType;
  D1: boolean;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
  D6: number;
  D7: number;
  E1: number;
  E2: number;
  /** Legacy field, emitted for API parity but unused. */
  E3: 0.4;
}

/** Raw form state in UI units (percent sliders as 0–100). */
export interface RoiFormValues {
  A1: string;
  A2: number;
  A3: number;
  A4: number;
  A5: number;
  A6: number;
  A7: number;
  A8: number;
  A9: number;
  A10: number;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
  B5: number;
  B6: number;
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  C5: number;
  D0: BadgeType;
  D1: boolean;
  /** Vision: smart glasses adoption % / resale $ */
  D2: number;
  D3: number;
  /** Connect: app adoption % / resale $ */
  D2app: number;
  D3app: number;
  /** Insight: app upgrade adoption % / resale $ */
  D2insight: number;
  D3insight: number;
  D4: number;
  D5: number;
  D6: number;
  D7: number;
  E1: number;
  E2: number;
}

export interface Scenario {
  adoptionMult: number;
  analyticsMult: number;
  sponsorSlotDelta: number;
  renewalUplift: number;
  ticketUplift: number;
  connectionsMult: number;
  leadsMult: number;
  searchReduction: number;
}

export interface RoiResult {
  tier: Tier;
  tierDisplayName: string;
  basePlatformFee: number;
  volDiscountAmt: number;
  ssDiscountAmt: number;
  platformFee: number;
  arOrAppCost: number;
  arOrAppUnits: number;
  arOrAppUnitCost: number;
  arOrAppResale: number;
  badgeCost: number;
  analyticsFee: number;
  totalIdentycaCost: number;
  badgeOffset: number;
  techSavings: number;
  netCost: number;
  arAppProfit: number;
  exhibitorAnalyticsRev: number;
  sponsorshipRev: number;
  exhibRenewalRev: number;
  sponRenewalRev: number;
  ticketRev: number;
  totalNewRevenue: number;
  totalValue: number;
  netProfit: number;
  roi: number;
  ndi: number | null;
  ndiLabel: string;
  searchWithout: number;
  searchWith: number | null;
  pFindWithout: number;
  pFindWithoutLabel: string;
  pFindWith: number | null;
  pFindWithLabel: string;
  hasRealtime: boolean;
  connectionsWithout: number | null;
  connectionsWith: number | null;
  leadsWithout: number | null;
  leadsWith: number | null;
  costPerLeadWithout: number | null;
  costPerLeadWith: number | null;
  engagementScore: number | null;
  annualProfit: number;
  annualCost: number;
  scenarioKey: ScenarioKey;
}

export type RoiResults = Record<ScenarioKey, RoiResult>;

export interface RoiLead {
  name: string;
  company: string;
  role: string;
  email: string;
}

/** POST /api/roi-report body. */
export interface RoiReportRequest {
  lead: RoiLead;
  inputs: RoiInputs;
  results: RoiResults;
  /** Raw base64 PDF, no data: prefix. */
  pdfBase64: string;
}
