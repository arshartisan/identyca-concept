/**
 * Client-side ROI report PDF (A4 portrait). jsPDF is loaded lazily on submit
 * so it never enters the page's initial bundle.
 *
 * 6 pages for real-time tiers, 3 for Lite. Content follows the original
 * report (content brief §6.8).
 */
import { fmtReportDate, fmtUSD } from "./format";
import type { RoiInputs, RoiLead, RoiResults, Tier } from "./types";

type RGB = [number, number, number];

export const TIER_FEATURES: Record<Tier, string[]> = {
  VISION: [
    "Live AR Label Display",
    "Nearby Attendees (radar + alerts)",
    "Navigation to delegates",
    "Attendee profiles (LinkedIn sync)",
    "Meeting requests + scheduling",
    "Schedule management (30min slots)",
    "Live Translation (AR Glasses)",
    "Live Transcription & Notes (AR Glasses)",
    "Live Teleprompter (AR Glasses)",
    "AI Search Chatbot (AR Glasses)",
    "Smart filtering",
    "AI match-making",
    "Conference agenda + alerts",
    "QR scanning + lead retrieval",
    "Wayfinding (AR + phone)",
    "Exhibition booth alerts + analytics",
    "Team coordination (sponsors)",
    "In-app real time sponsorships",
    "Opt-out controls",
    "Organizer analytics dashboard",
  ],
  INSIGHT: [
    "Live Label Display (phone app)",
    "AI search chatbot (phone app)",
    "Nearby Attendees (phone app)",
    "Navigation (phone app)",
    "Attendee profiles",
    "Meeting requests + scheduling",
    "Schedule management",
    "Smart filtering",
    "AI match-making",
    "Conference agenda + alerts",
    "QR scanning + lead retrieval",
    "Wayfinding (phone)",
    "Session alerts (badge + phone)",
    "Exhibition booth alerts + analytics",
    "Team coordination (sponsors)",
    "In-app real time sponsorships",
    "Opt-out controls",
    "Organizer analytics",
    "Smart Networking App Upgrade available for VIP/sponsor markup",
  ],
  CONNECT: [
    "Nearby Attendees",
    "Navigation",
    "Attendee profiles",
    "Smart filtering",
    "AI match-making",
    "QR scanning",
    "Lead retrieval",
    "Opt-out controls",
    "Tag exit alerts",
  ],
  LITE: ["NFC tap-to-exchange badge", "Full event app", "Lead capture", "Registration", "Ticketing", "No real-time positioning"],
};

export async function generateRoiPdf(inputs: RoiInputs, lead: RoiLead, results: RoiResults, now: Date): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PW = 210;
  const PH = 297;
  const M = 20;
  const CW = PW - 2 * M;

  // PDF palette (print colours - not UI tokens)
  const navy: RGB = [15, 23, 42];
  const blue: RGB = [37, 99, 235];
  const cyan: RGB = [6, 182, 212];
  const darkGray: RGB = [51, 65, 85];
  const medGray: RGB = [100, 116, 139];
  const lightBg: RGB = [248, 250, 252];
  const white: RGB = [255, 255, 255];
  const green: RGB = [34, 197, 94];
  const deepGreen: RGB = [22, 163, 74];
  const orange: RGB = [249, 115, 22];
  const red: RGB = [239, 68, 68];
  const deepRed: RGB = [220, 38, 38];
  const redSoft: RGB = [254, 226, 226];
  const greenSoft: RGB = [220, 252, 231];

  const b = results.baseline;
  const c = results.conservative;
  const a = results.aggressive;
  const ev = inputs.A1 || "Your Event";
  const totalPages = b.hasRealtime ? 6 : 3;
  const dateStr = fmtReportDate(now);

  const fillRect = (x: number, y: number, w: number, h: number, color: RGB, r?: number) => {
    doc.setFillColor(...color);
    if (r) doc.roundedRect(x, y, w, h, r, r, "F");
    else doc.rect(x, y, w, h, "F");
  };

  const txt = (
    text: string | number,
    x: number,
    y: number,
    opts: { style?: "normal" | "bold"; size?: number; color?: RGB; align?: "left" | "center" | "right"; maxW?: number } = {},
  ) => {
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(opts.size ?? 10);
    doc.setTextColor(...(opts.color ?? darkGray));
    doc.text(String(text), x, y, { align: opts.align ?? "left", ...(opts.maxW ? { maxWidth: opts.maxW } : {}) });
  };

  const ndiColorArr = (score: number): RGB =>
    score <= 35 ? [132, 204, 22] : score <= 50 ? [234, 179, 8] : score <= 65 ? [249, 115, 22] : [239, 68, 68];

  const footer = (pageNum: number, section: string) => {
    doc.setDrawColor(200, 210, 220);
    doc.line(M, PH - 15, PW - M, PH - 15);
    txt("identyca.io", M, PH - 9, { size: 8, color: blue, style: "bold" });
    txt(`Page ${pageNum} of ${totalPages}  |  ${section}`, PW - M, PH - 9, { size: 8, color: medGray, align: "right" });
  };

  /* ---------------------------------------------------------------- cover */
  fillRect(0, 0, PW, PH, navy);
  for (let i = 0; i < 100; i++) {
    const t = i / 100;
    fillRect(0, i * 1.2, PW, 1.3, [Math.round(6 + 133 * t), Math.round(182 - 90 * t), Math.round(212 + 34 * t)]);
  }
  fillRect(0, 120, PW, 2, red);
  txt("Your Identyca ROI Report", M, 68, { size: 26, color: white, style: "bold" });
  txt(ev, M, 134, { size: 13, color: cyan });
  txt("See Who Matters. Connect Instantly.", M, 150, { size: 11, color: [220, 230, 255] });
  txt("Prepared for:", M, 170, { size: 9, color: medGray });
  txt(`${lead.name}, ${lead.role}`, M, 179, { size: 11, color: white, style: "bold" });
  txt(`Company: ${lead.company}`, M, 188, { size: 10, color: [200, 215, 235] });
  txt(`Event: ${ev}`, M, 196, { size: 10, color: [200, 215, 235] });
  txt(`Generated: ${dateStr}`, M, 204, { size: 9, color: medGray });
  fillRect(M, 216, CW, 26, [10, 30, 70], 4);
  doc.setDrawColor(...cyan);
  doc.roundedRect(M, 216, CW, 26, 4, 4, "S");
  txt(`Recommended Tier: ${b.tierDisplayName}`, M + 8, 233, { size: 12, color: cyan, style: "bold" });
  doc.setDrawColor(60, 80, 110);
  doc.line(M, PH - 16, PW - M, PH - 16);
  txt(`CONFIDENTIAL - Prepared by Identyca.io for ${lead.company}`, M, PH - 9, { size: 7, color: medGray });
  txt("identyca.io", PW - M, PH - 9, { size: 8, color: cyan, style: "bold", align: "right" });

  /* -------------------------------------------- networking difficulty (RT) */
  if (b.hasRealtime && b.ndi !== null && b.searchWith !== null && b.pFindWith !== null) {
    doc.addPage();
    txt("Networking Difficulty Analysis", M, 28, { size: 18, color: navy, style: "bold" });
    txt("How hard is it to find the right person at your event?", M, 37, { size: 10, color: medGray });
    fillRect(M, 45, CW, 38, lightBg, 4);
    txt("NETWORKING DIFFICULTY INDEX (NDI)", M + 8, 57, { size: 8, color: medGray, style: "bold" });
    txt(String(b.ndi), M + 8, 74, { size: 22, color: ndiColorArr(b.ndi), style: "bold" });
    txt(b.ndiLabel, M + 28, 74, { size: 13, color: navy, style: "bold" });
    txt("Score out of 100", M + 8, 79, { size: 7, color: medGray });

    const gaugeY = 90;
    const gaugeH = 6;
    fillRect(M, gaugeY, CW * 0.35, gaugeH, [220, 237, 200]);
    fillRect(M + CW * 0.35, gaugeY, CW * 0.15, gaugeH, [255, 243, 194]);
    fillRect(M + CW * 0.5, gaugeY, CW * 0.15, gaugeH, [254, 226, 200]);
    fillRect(M + CW * 0.65, gaugeY, CW * 0.35, gaugeH, [254, 210, 210]);
    fillRect(M, gaugeY, CW * (b.ndi / 100), gaugeH, ndiColorArr(b.ndi));
    const markerX = M + CW * (b.ndi / 100);
    doc.setFillColor(...navy);
    doc.triangle(markerX - 2, gaugeY - 1, markerX + 2, gaugeY - 1, markerX, gaugeY - 4, "F");
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    for (const f of [0.35, 0.5, 0.65]) doc.line(M + CW * f, gaugeY, M + CW * f, gaugeY + gaugeH + 2);
    const legendY = gaugeY + gaugeH + 5;
    txt("Moderate", M, legendY, { size: 6, color: [100, 170, 30] });
    txt("Difficult", M + CW * 0.35, legendY, { size: 6, color: [180, 130, 0] });
    txt("Very Difficult", M + CW * 0.5, legendY, { size: 6, color: [200, 80, 0] });
    txt("Needle in a Haystack", M + CW * 0.65, legendY, { size: 6, color: [200, 40, 40] });

    const boxW = 58;
    const gap = 54;
    const centerX = M + boxW + gap / 2;

    const stY = 118;
    txt("Average Time to Find a Specific Person", M, stY, { size: 11, color: navy, style: "bold" });
    fillRect(M, stY + 6, boxW, 30, redSoft, 4);
    txt("Without Identyca", M + 4, stY + 17, { size: 7, color: medGray });
    txt(`~${b.searchWithout} min`, M + 4, stY + 28, { size: 14, color: red, style: "bold" });
    const speedup = b.searchWithout > 0 ? Math.round((1 - b.searchWith / b.searchWithout) * 100) : 0;
    txt(`${speedup}%`, centerX, stY + 18, { size: 11, color: green, style: "bold", align: "center" });
    txt("faster", centerX, stY + 25, { size: 7, color: green, align: "center" });
    txt(">", centerX, stY + 32, { size: 14, color: blue, style: "bold", align: "center" });
    fillRect(M + boxW + gap, stY + 6, boxW, 30, greenSoft, 4);
    txt("With Identyca", M + boxW + gap + 4, stY + 17, { size: 7, color: medGray });
    txt(`~${b.searchWith} min`, M + boxW + gap + 4, stY + 28, { size: 14, color: green, style: "bold" });

    const pY = 165;
    txt("Probability of Actually Finding Them", M, pY, { size: 11, color: navy, style: "bold" });
    fillRect(M, pY + 6, boxW, 35, redSoft, 4);
    txt("Without Identyca", M + 4, pY + 17, { size: 7, color: medGray });
    txt(`${b.pFindWithout}%`, M + 4, pY + 32, { size: 18, color: orange, style: "bold" });
    txt(`+${b.pFindWith - b.pFindWithout} pts`, centerX, pY + 22, { size: 10, color: green, style: "bold", align: "center" });
    txt(">", centerX, pY + 32, { size: 14, color: blue, style: "bold", align: "center" });
    fillRect(M + boxW + gap, pY + 6, boxW, 35, greenSoft, 4);
    txt("With Identyca", M + boxW + gap + 4, pY + 17, { size: 7, color: medGray });
    txt(`${b.pFindWith}%`, M + boxW + gap + 4, pY + 32, { size: 18, color: green, style: "bold" });

    const narr = `At ${ev} with ${inputs.A2.toLocaleString("en-US")} attendees across ${inputs.A9.toLocaleString("en-US")} sqm over ${inputs.A8} day(s), finding a specific person without a system takes an estimated ~${b.searchWithout} minutes - and there is only a ${b.pFindWithout}% chance of finding them. With Identyca, that probability jumps to ${b.pFindWith}% and search time drops to ~${b.searchWith} minutes.`;
    fillRect(M, 215, CW, 32, lightBg, 4);
    txt(narr, M + 5, 224, { size: 9, color: darkGray, maxW: CW - 10 });
    footer(2, "Networking Difficulty Analysis");
  }

  /* ------------------------------------------------------ financial summary */
  doc.addPage();
  txt("Financial Summary", M, 28, { size: 18, color: navy, style: "bold" });
  txt(`Three-scenario analysis per event  |  Tier: ${b.tierDisplayName}`, M, 37, { size: 10, color: medGray });
  const cw = [58, 38, 38, 36];
  const colX = [M, M + cw[0], M + cw[0] + cw[1], M + cw[0] + cw[1] + cw[2]];
  let ty = 46;
  fillRect(M, ty - 4, CW, 9, navy);
  txt("Line Item", colX[0] + 2, ty + 1, { size: 8, color: white, style: "bold" });
  txt("Conservative", colX[1] + cw[1] - 2, ty + 1, { size: 8, color: white, style: "bold", align: "right" });
  txt("Baseline", colX[2] + cw[2] - 2, ty + 1, { size: 8, color: white, style: "bold", align: "right" });
  txt("Aggressive", colX[3] + cw[3] - 2, ty + 1, { size: 8, color: white, style: "bold", align: "right" });
  ty += 11;

  const row = (label: string, v1: string, v2: string, v3: string, opts: { bold?: boolean; hl?: boolean } = {}) => {
    if (opts.hl) fillRect(M, ty - 4, CW, 8, [235, 243, 255]);
    const style = opts.bold ? "bold" : "normal";
    const color = opts.bold ? navy : darkGray;
    txt(label, colX[0] + 2, ty, { size: 8, color, style });
    txt(v1, colX[1] + cw[1] - 2, ty, { size: 7, color, style, align: "right" });
    txt(v2, colX[2] + cw[2] - 2, ty, { size: 7, color, style, align: "right" });
    txt(v3, colX[3] + cw[3] - 2, ty, { size: 7, color, style, align: "right" });
    ty += 7;
  };
  const gapRow = () => {
    ty += 4;
  };

  row("Identyca Platform Fee (Base)", fmtUSD(b.basePlatformFee), fmtUSD(b.basePlatformFee), fmtUSD(b.basePlatformFee));
  if (b.volDiscountAmt > 0) {
    const d = `(-${fmtUSD(b.volDiscountAmt)})`;
    row("  Volume Discount", d, d, d);
  }
  row("Gross Identyca Cost (badges incl.)", fmtUSD(c.totalIdentycaCost), fmtUSD(b.totalIdentycaCost), fmtUSD(a.totalIdentycaCost), { bold: true });
  row("Less: Tech Spend Replaced (excl. badge printing)", fmtUSD(-c.techSavings), fmtUSD(-b.techSavings), fmtUSD(-a.techSavings));
  row("Net Incremental Cost", fmtUSD(c.netCost), fmtUSD(b.netCost), fmtUSD(a.netCost), { bold: true, hl: true });
  gapRow();

  const adopt = (m: number) => Math.round(Math.min(inputs.D2 * m, 0.6) * 100);
  const upgradeLabel =
    b.tier === "VISION" ? "AR Glasses Markup Revenue *" : b.tier === "CONNECT" || b.tier === "INSIGHT" ? "App Upgrade Markup Revenue *" : "";
  if (upgradeLabel) {
    row(
      upgradeLabel,
      `${fmtUSD(c.arAppProfit)} (${adopt(0.75)}% adopt.)`,
      `${fmtUSD(b.arAppProfit)} (${adopt(1)}% adopt.)`,
      `${fmtUSD(a.arAppProfit)} (${adopt(1.3)}% adopt.)`,
    );
  }
  if (b.hasRealtime) {
    const pkgs = (m: number) => Math.round(inputs.A6 * Math.min(inputs.D5 * m, 0.8));
    row(
      "Exhibitor Analytics Revenue",
      `${fmtUSD(c.exhibitorAnalyticsRev)} (${pkgs(0.75)} pkgs)`,
      `${fmtUSD(b.exhibitorAnalyticsRev)} (${pkgs(1)} pkgs)`,
      `${fmtUSD(a.exhibitorAnalyticsRev)} (${pkgs(1.25)} pkgs)`,
    );
    row("Sponsorship Slot Revenue", fmtUSD(c.sponsorshipRev), fmtUSD(b.sponsorshipRev), fmtUSD(a.sponsorshipRev));
  }
  row("Exhibitor Renewal Uplift", `${fmtUSD(c.exhibRenewalRev)} (+5pp)`, `${fmtUSD(b.exhibRenewalRev)} (+10pp)`, `${fmtUSD(a.exhibRenewalRev)} (+15pp)`);
  row("Sponsor Renewal Uplift", `${fmtUSD(c.sponRenewalRev)} (+5pp)`, `${fmtUSD(b.sponRenewalRev)} (+10pp)`, `${fmtUSD(a.sponRenewalRev)} (+15pp)`);
  row("Ticket Premium Uplift", `${fmtUSD(c.ticketRev)} (0%)`, `${fmtUSD(b.ticketRev)} (+3%)`, `${fmtUSD(a.ticketRev)} (+5%)`);
  row("Total New Revenue", fmtUSD(c.totalNewRevenue), fmtUSD(b.totalNewRevenue), fmtUSD(a.totalNewRevenue), { bold: true });
  gapRow();
  row("Net Profit (per event)", fmtUSD(c.netProfit), fmtUSD(b.netProfit), fmtUSD(a.netProfit), { bold: true, hl: true });
  row("ROI %", `${Math.round(c.roi)}%`, `${Math.round(b.roi)}%`, `${Math.round(a.roi)}%`, { bold: true, hl: true });
  row(`Annualised Net Profit (×${inputs.A10 || 1} events)`, fmtUSD(c.annualProfit), fmtUSD(b.annualProfit), fmtUSD(a.annualProfit), { bold: true });
  txt("* Adoption rate per scenario reflects conservative / baseline / aggressive uptake assumptions.", M, ty + 4, { size: 6.5, color: medGray });
  footer(b.hasRealtime ? 3 : 2, "Financial Summary");

  /* --------------------------------------- engagement + value card (RT) */
  if (
    b.hasRealtime &&
    b.connectionsWith !== null &&
    b.connectionsWithout !== null &&
    b.leadsWith !== null &&
    b.leadsWithout !== null &&
    b.costPerLeadWith !== null &&
    b.costPerLeadWithout !== null &&
    b.searchWith !== null &&
    b.pFindWith !== null
  ) {
    doc.addPage();
    txt("Engagement Impact", M, 28, { size: 18, color: navy, style: "bold" });
    txt(`Baseline scenario  |  ${ev}`, M, 37, { size: 10, color: medGray });
    const ew = [58, 33, 44, 35];
    const ex = [M, M + ew[0], M + ew[0] + ew[1], M + ew[0] + ew[1] + ew[2]];
    let ey = 46;
    fillRect(M, ey - 4, CW, 9, navy);
    txt("Metric", ex[0] + 2, ey + 1, { size: 8, color: white, style: "bold" });
    txt("Without Identyca", ex[1] + 2, ey + 1, { size: 8, color: white, style: "bold" });
    txt("With Identyca", ex[2] + 2, ey + 1, { size: 8, color: white, style: "bold" });
    txt("Improvement", ex[3] + 2, ey + 1, { size: 8, color: white, style: "bold" });
    ey += 11;
    const eRow = (label: string, wo: string | number, wi: string | number, imp: string, hl = false) => {
      if (hl) fillRect(M, ey - 4, CW, 8, [240, 249, 255]);
      txt(label, ex[0] + 2, ey, { size: 8, color: darkGray });
      txt(wo, ex[1] + 2, ey, { size: 8, color: darkGray });
      txt(wi, ex[2] + 2, ey, { size: 8, color: navy, style: "bold" });
      txt(imp, ex[3] + 2, ey, { size: 8, color: green, style: "bold" });
      ey += 8;
    };
    const cplReduction = Math.round((1 - b.costPerLeadWith / Math.max(b.costPerLeadWithout, 1)) * 100);
    eRow("Meaningful connections / attendee", b.connectionsWithout, Math.round(b.connectionsWith), `+${Math.round((b.connectionsWith / b.connectionsWithout - 1) * 100)}%`);
    eRow("Qualified leads / exhibitor", b.leadsWithout, Math.round(b.leadsWith), `+${Math.round((b.leadsWith / b.leadsWithout - 1) * 100)}%`, true);
    eRow("Time to find a specific person", `~${b.searchWithout} min`, `~${b.searchWith} min`, `-${Math.round((1 - b.searchWith / Math.max(b.searchWithout, 1)) * 100)}%`);
    eRow("Probability of finding someone", `${b.pFindWithout}%`, `${b.pFindWith}%`, `+${b.pFindWith - b.pFindWithout} pts`, true);
    eRow("Cost per qualified lead (exhibitors)", fmtUSD(Math.round(b.costPerLeadWithout)), fmtUSD(Math.round(b.costPerLeadWith)), `-${cplReduction}%`);
    eRow("Event Engagement Score (0-100)", "-", `${b.engagementScore} / 100`, "Platform Enabled", true);
    footer(4, "Engagement Impact");

    doc.addPage();
    txt("Exhibitor / Sponsor Value Card", M, 30, { size: 20, color: navy, style: "bold" });
    txt("Ready to share in your exhibitor and sponsor sales conversations", M, 40, { size: 11, color: medGray });
    fillRect(M, 52, CW, 100, lightBg, 6);
    txt("Why Identyca Makes Your Event a Must-Book", M + 10, 66, { size: 14, color: navy, style: "bold" });
    txt("for Exhibitors & Sponsors", M + 10, 75, { size: 14, color: navy, style: "bold" });
    const cardText = `At ${ev}, your ${fmtUSD(inputs.B3)} exhibitor/sponsor package currently delivers approximately ${b.leadsWithout} qualified leads (${fmtUSD(Math.round(b.costPerLeadWithout))}/lead). With Identyca's real-time attendee identification and proximity alerts, exhibitors and sponsors at comparable events generate ${Math.round(b.leadsWith)}+ qualified leads - reducing cost-per-lead to ${fmtUSD(Math.round(b.costPerLeadWith))}, a ${cplReduction}% improvement.`;
    txt(cardText, M + 10, 88, { size: 10, color: darkGray, maxW: CW - 20 });

    const bw = 60;
    const bh = 35;
    const bg = 30;
    const startX = M + (CW - (bw * 2 + bg)) / 2;
    const boxY = 122;
    fillRect(startX, boxY, bw, bh, redSoft, 6);
    txt(String(b.leadsWithout), startX + bw / 2, boxY + 16, { size: 22, color: deepRed, style: "bold", align: "center" });
    txt("Qualified leads today", startX + bw / 2, boxY + 26, { size: 8, color: medGray, align: "center" });
    txt(">", startX + bw + bg / 2, boxY + 20, { size: 20, color: blue, style: "bold", align: "center" });
    fillRect(startX + bw + bg, boxY, bw, bh, greenSoft, 6);
    txt(`${Math.round(b.leadsWith)}+`, startX + bw + bg + bw / 2, boxY + 16, { size: 22, color: deepGreen, style: "bold", align: "center" });
    txt("Qualified leads with Identyca", startX + bw + bg + bw / 2, boxY + 26, { size: 8, color: medGray, align: "center" });

    const cplY = boxY + bh + 15;
    fillRect(M, cplY, CW, 40, white, 6);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(M, cplY, CW, 40, 6, 6, "S");
    txt("Cost Per Qualified Lead", M + 10, cplY + 12, { size: 11, color: navy, style: "bold" });
    txt("Without Identyca:", M + 10, cplY + 24, { size: 9, color: medGray });
    txt(`${fmtUSD(Math.round(b.costPerLeadWithout))}/lead`, M + 55, cplY + 24, { size: 10, color: deepRed, style: "bold" });
    txt("With Identyca:", M + 10, cplY + 33, { size: 9, color: medGray });
    txt(`${fmtUSD(Math.round(b.costPerLeadWith))}/lead`, M + 55, cplY + 33, { size: 10, color: deepGreen, style: "bold" });
    fillRect(M + CW - 55, cplY + 10, 45, 22, greenSoft, 6);
    txt(`${cplReduction}%`, M + CW - 32, cplY + 22, { size: 16, color: deepGreen, style: "bold", align: "center" });
    txt("reduction", M + CW - 32, cplY + 29, { size: 7, color: medGray, align: "center" });
    footer(5, "Exhibitor / Sponsor Value Card");
  }

  /* --------------------------------------------- what's included + next */
  doc.addPage();
  txt(`What's Included - ${b.tierDisplayName} Tier`, M, 30, { size: 20, color: navy, style: "bold" });
  txt("Features included in your recommended package", M, 40, { size: 11, color: medGray });
  const features = TIER_FEATURES[b.tier];
  const startY = 50;
  const lineH = 7;
  const mid = Math.ceil(features.length / 2);
  features.forEach((f, i) => {
    const left = i < mid;
    const fx = left ? M + 5 : M + CW / 2 + 5;
    const fy = startY + (left ? i : i - mid) * lineH;
    txt("-", fx, fy, { size: 9, color: cyan, style: "bold" });
    txt(f, fx + 6, fy, { size: 8.5, color: darkGray, maxW: CW / 2 - 12 });
  });
  const endY = startY + mid * lineH + 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(M, endY, PW - M, endY);
  const nsY = endY + 10;
  txt("Your Next Steps", M, nsY, { size: 16, color: navy, style: "bold" });
  const steps = [
    "Book a 20-minute live demo at www.identyca.io",
    "Reserve your pilot dates - pilot cohort slots for 2026 are limited.",
    "Configure your event - our team will build a tailored onboarding plan.",
  ];
  steps.forEach((s, i) => {
    txt(`${i + 1}.`, M + 5, nsY + 12 + i * 10, { size: 10, color: cyan, style: "bold" });
    txt(s, M + 14, nsY + 12 + i * 10, { size: 10, color: darkGray });
  });
  const ctaY = nsY + 52;
  fillRect(M, ctaY, CW, 25, lightBg, 4);
  txt("Ready to talk? Our team is standing by to personalise this model further.", M + 8, ctaY + 10, { size: 10, color: navy, style: "bold" });
  txt("contact@identyca.io  |  www.identyca.io", M + 8, ctaY + 18, { size: 10, color: cyan });
  doc.setDrawColor(200, 210, 220);
  doc.line(M, PH - 20, PW - M, PH - 20);
  txt(`CONFIDENTIAL - Prepared by Identyca.io for ${lead.company}`, M, PH - 12, { size: 8, color: medGray });
  txt(dateStr, PW - M, PH - 12, { size: 8, color: medGray, align: "right" });

  const dataUri = doc.output("datauristring");
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
  // Never send an empty/garbled PDF - the caller surfaces this as an error.
  if (!base64 || base64.length < 100 || doc.getNumberOfPages() !== totalPages) {
    throw new Error("PDF generation produced an invalid document");
  }
  return base64;
}
