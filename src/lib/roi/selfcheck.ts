/**
 * ROI engine self-check against the reference vectors from the content brief
 * (computed with the original roi-calculator.js).
 *
 *   npx tsx src/lib/roi/selfcheck.ts
 *
 * Exits non-zero on any mismatch.
 */
import { DEFAULT_FORM, calculate, orDefault, toInputs } from "./engine";
import type { RoiFormValues, RoiResult, ScenarioKey } from "./types";

type Expect = Partial<{
  tier: string;
  base: number;
  disc: number;
  cost: number;
  techSav: number;
  netCost: number;
  units: number;
  arApp: number;
  analytics: number;
  spons: number;
  exhRenew: number;
  sponRenew: number;
  ticket: number;
  totalNew: number;
  netProfit: number;
  roi: number;
  ndi: number | null;
  ndiLabel: string;
  sw: number;
  swi: number | null;
  pw: number;
  pwi: number | null;
  eng: number | null;
  annual: number;
  cplWith: number;
  connWith: number;
  leadsWith: number;
}>;

const cases: { name: string; form: Partial<RoiFormValues>; key: ScenarioKey; expect: Expect }[] = [
  { name: "Defaults / conservative", form: {}, key: "conservative", expect: { tier: "VISION", base: 19000, disc: 0, cost: 19000, techSav: 9500, netCost: 9500, units: 30, arApp: 12000, analytics: 12000, spons: 3000, exhRenew: 18750, sponRenew: 7500, ticket: 0, totalNew: 53250, netProfit: 43750, roi: 230.26, ndi: 51, ndiLabel: "Very Difficult", sw: 48, swi: 24, pw: 10, pwi: 98, eng: 89, cplWith: 428.57, connWith: 12, leadsWith: 35 } },
  { name: "Defaults / baseline", form: {}, key: "baseline", expect: { tier: "VISION", base: 19000, disc: 0, cost: 19000, techSav: 9500, netCost: 9500, units: 40, arApp: 16000, analytics: 15000, spons: 6000, exhRenew: 37500, sponRenew: 15000, ticket: 8100, totalNew: 97600, netProfit: 88100, roi: 463.68, ndi: 51, sw: 48, swi: 14, pw: 10, pwi: 98, eng: 100, cplWith: 333.33, connWith: 16, leadsWith: 45 } },
  { name: "Defaults / aggressive", form: {}, key: "aggressive", expect: { tier: "VISION", base: 19000, disc: 0, cost: 19000, techSav: 9500, netCost: 9500, units: 52, arApp: 20800, analytics: 19500, spons: 9000, exhRenew: 56250, sponRenew: 22500, ticket: 13500, totalNew: 141550, netProfit: 132050, roi: 695, ndi: 51, sw: 48, swi: 7, pw: 10, pwi: 98, eng: 100, cplWith: 272.73, connWith: 20, leadsWith: 55 } },
  { name: "AR off (D3=100) / baseline", form: { D1: false, D3app: 100 }, key: "baseline", expect: { tier: "CONNECT", base: 9750, disc: 0, cost: 9750, techSav: 9500, netCost: 250, units: 40, arApp: 3000, analytics: 15000, spons: 6000, exhRenew: 37500, sponRenew: 15000, ticket: 8100, totalNew: 84600, netProfit: 84350, roi: 865.13, ndi: 51, sw: 48, swi: 14, pw: 10, pwi: 85, eng: 100 } },
  { name: "2000 pax, 8000 sqm / baseline", form: { A2: 2000, A9: 8000, D3insight: 100 }, key: "baseline", expect: { tier: "INSIGHT", base: 14000, disc: 0, cost: 14000, techSav: 9500, netCost: 4500, units: 160, arApp: 12000, analytics: 15000, spons: 6000, exhRenew: 37500, sponRenew: 15000, ticket: 32400, totalNew: 117900, netProfit: 113400, roi: 810, ndi: 70, ndiLabel: "Needle in a Haystack", sw: 198, swi: 59, pw: 1, pwi: 92, eng: 100 } },
  { name: "NFC badges / baseline", form: { D0: "nfc" }, key: "baseline", expect: { tier: "LITE", base: 2750, disc: 0, cost: 2750, techSav: 9500, netCost: -6750, units: 0, arApp: 0, analytics: 0, spons: 0, exhRenew: 37500, sponRenew: 15000, ticket: 8100, totalNew: 60600, netProfit: 67350, roi: 2449.09, ndi: null, sw: 48, swi: null, pw: 10, pwi: null, eng: null } },
  { name: "Defaults, 10 events/yr / baseline", form: { A10: 10 }, key: "baseline", expect: { tier: "VISION", base: 19000, disc: 1900, cost: 17100, techSav: 9500, netCost: 7600, units: 40, arApp: 16000, analytics: 15000, spons: 6000, exhRenew: 37500, sponRenew: 15000, ticket: 8100, totalNew: 97600, netProfit: 90000, roi: 526.32, annual: 900000, ndi: 51, sw: 48, swi: 14, pw: 10, pwi: 98, eng: 100 } },
];

const actual = (r: RoiResult): Required<Expect> => ({
  tier: r.tier,
  base: r.basePlatformFee,
  disc: r.volDiscountAmt,
  cost: r.totalIdentycaCost,
  techSav: r.techSavings,
  netCost: r.netCost,
  units: r.arOrAppUnits,
  arApp: r.arAppProfit,
  analytics: r.exhibitorAnalyticsRev,
  spons: r.sponsorshipRev,
  exhRenew: r.exhibRenewalRev,
  sponRenew: r.sponRenewalRev,
  ticket: r.ticketRev,
  totalNew: r.totalNewRevenue,
  netProfit: r.netProfit,
  roi: r.roi,
  ndi: r.ndi,
  ndiLabel: r.ndiLabel,
  sw: r.searchWithout,
  swi: r.searchWith,
  pw: r.pFindWithout,
  pwi: r.pFindWith,
  eng: r.engagementScore,
  annual: r.annualProfit,
  cplWith: r.costPerLeadWith ?? NaN,
  connWith: r.connectionsWith ?? NaN,
  leadsWith: r.leadsWith ?? NaN,
});

function close(a: unknown, e: unknown): boolean {
  if (typeof a === "number" && typeof e === "number") return Math.abs(a - e) < 0.01; // brief rounds to 2 dp
  return a === e;
}

let failures = 0;
for (const c of cases) {
  const r = actual(calculate(toInputs({ ...DEFAULT_FORM, ...c.form }), c.key));
  const rows: string[] = [];
  for (const [k, e] of Object.entries(c.expect)) {
    const a = r[k as keyof Expect];
    const ok = close(a, e);
    if (!ok) failures++;
    const shown = typeof a === "number" ? Number(a.toFixed(2)) : a;
    rows.push(`${ok ? " " : "✗"} ${k}=${shown}${ok ? "" : ` (expected ${e})`}`);
  }
  console.log(`\n${c.name}\n  ${rows.join("  ")}`);
}

// Parity quirk: an entered 0 falls back to the default (original `||` behaviour).
const zero = toInputs({ ...DEFAULT_FORM, A6: 0, D6: 0, B5: 0 });
const quirkOk = zero.A6 === 25 && zero.D6 === 2 && zero.B5 === 0.65 && orDefault(0, 7) === 7;
if (!quirkOk) failures++;
console.log(`\n${quirkOk ? " " : "✗"} zero-fallback parity: A6=${zero.A6} D6=${zero.D6} B5=${zero.B5}`);

console.log(failures ? `\n${failures} mismatch(es)` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
