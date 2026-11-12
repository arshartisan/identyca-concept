/**
 * POST /api/roi-report - emails the client-generated ROI report PDF via Resend.
 *
 * Ported from the original Cloudflare Pages Function. Body:
 *   { lead: { name, company, role, email }, inputs, results: { conservative, baseline, aggressive }, pdfBase64 }
 * (pdfBase64 is raw base64, no data: prefix.)
 *
 * Env: RESEND_API_KEY (required - without it the route answers 503 instead of
 * pretending success). The original's optional KV lead backup is dropped.
 *
 * Runs on the default Node.js runtime (Cache Components forbids a `runtime` export).
 */
import type { RoiInputs, RoiLead, RoiResult } from "@/lib/roi/types";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const FROM = "Identyca.io <leads@identyca.io>";
const INTERNAL_TO = "vibhas@identyca.io";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** ~12 MB of base64 - far above a real report (~30–60 KB), guards abuse. */
const MAX_PDF_BASE64 = 12 * 1024 * 1024;

const json = (body: unknown, status: number) => Response.json(body, { status, headers: CORS });

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    const { lead, inputs, results, pdfBase64 } = (body ?? {}) as {
      lead?: Partial<RoiLead>;
      inputs?: Partial<RoiInputs>;
      results?: { conservative?: RoiResult; baseline?: RoiResult; aggressive?: RoiResult };
      pdfBase64?: unknown;
    };

    const clean = (s: unknown) => (typeof s === "string" ? s.trim() : "");
    const l: RoiLead = { name: clean(lead?.name), company: clean(lead?.company), role: clean(lead?.role), email: clean(lead?.email) };
    if (!l.name || !l.company || !l.role || !l.email) return json({ error: "Missing required lead fields" }, 400);
    if (!EMAIL_RE.test(l.email)) return json({ error: "Invalid email address" }, 400);
    if (typeof pdfBase64 !== "string" || pdfBase64.length < 100 || pdfBase64.length > MAX_PDF_BASE64 || !/^[A-Za-z0-9+/=\s]+$/.test(pdfBase64)) {
      return json({ error: "Missing or invalid pdfBase64" }, 400);
    }
    const base = results?.baseline;
    const cons = results?.conservative;
    const agg = results?.aggressive;
    if (!base || !cons || !agg) return json({ error: "Missing results" }, 400);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[roi-report] RESEND_API_KEY not set - cannot send report");
      return json({ error: "Email delivery is not configured. Please email contact@identyca.io." }, 503);
    }

    const eventName = clean(inputs?.A1) || "Your Event";
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const filename = `Identyca_ROI_Report_${eventName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    const attachments = [{ filename, content: pdfBase64 }];

    await sendEmail(apiKey, {
      from: FROM,
      to: [l.email],
      subject: `Your Identyca ROI Report - ${eventName}`,
      html: buildEmailHtml(l, eventName, base, dateStr),
      attachments,
    });
    await sendEmail(apiKey, {
      from: FROM,
      to: [INTERNAL_TO],
      subject: `New ROI Lead: ${l.name} - ${l.company} - ${inputs?.A2 ?? "?"} pax`,
      html: buildInternalHtml(l, inputs ?? {}, eventName, base, cons, agg),
      attachments,
    });

    return json({ success: true }, 200);
  } catch (err) {
    console.error("[roi-report] error:", err);
    return json({ error: "Internal error", detail: err instanceof Error ? err.message : String(err) }, 500);
  }
}

/* ------------------------------------------------------------------ email */

async function sendEmail(
  apiKey: string,
  payload: { from: string; to: string[]; subject: string; html: string; attachments?: { filename: string; content: string }[] },
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

function esc(s: unknown) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const money = (n: number) => `$${Math.round(Number(n) || 0).toLocaleString("en-US")}`;
const pct = (n: number) => `${Math.round(Number(n) || 0)}%`;

function buildEmailHtml(lead: RoiLead, eventName: string, b: RoiResult, dateStr: string) {
  const pages = b.hasRealtime === false ? "3" : "6";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:600px;margin:32px auto;">
  <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:30px 28px;border-radius:12px 12px 0 0;">
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#93c5fd;text-transform:uppercase;">ROI Analysis Report</p>
    <h1 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;">Your Identyca ROI Report</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#93c5fd;">${esc(eventName)}  &middot;  ${esc(dateStr)}</p>
  </div>
  <div style="background:#ffffff;padding:28px;border:1px solid #e2e8f0;border-top:none;">
    <p style="color:#334155;margin:0 0 14px;">Hi ${esc(lead.name)},</p>
    <p style="color:#334155;margin:0 0 14px;">Thank you for using the Identyca ROI Calculator. Your personalised ${pages}-page analysis for <strong>${esc(eventName)}</strong> is <strong>attached to this email as a PDF</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:18px 0;">
      <tr>
        <td style="padding:14px 10px;background:#f8fafc;border-radius:8px;text-align:center;width:32%;">
          <div style="font-size:11px;color:#64748b;">Recommended Tier</div>
          <div style="font-size:17px;font-weight:900;color:#1e3a5f;margin-top:5px;">${esc(b.tierDisplayName)}</div>
        </td>
        <td style="width:6px;"></td>
        <td style="padding:14px 10px;background:#f8fafc;border-radius:8px;text-align:center;width:32%;">
          <div style="font-size:11px;color:#64748b;">Baseline ROI</div>
          <div style="font-size:17px;font-weight:900;color:#2563eb;margin-top:5px;">${pct(b.roi)}</div>
        </td>
        <td style="width:6px;"></td>
        <td style="padding:14px 10px;background:#f8fafc;border-radius:8px;text-align:center;width:32%;">
          <div style="font-size:11px;color:#64748b;">Est. Net Profit / Event</div>
          <div style="font-size:17px;font-weight:900;color:#16a34a;margin-top:5px;">${money(b.netProfit)}</div>
        </td>
      </tr>
    </table>
    <p style="background:#eff6ff;padding:14px 16px;border-radius:8px;border-left:4px solid #2563eb;color:#1e40af;font-size:13px;margin:0 0 18px;">
      &#128206; <strong>Open the attached PDF</strong> for your complete analysis - including the 3-scenario financial model${b.hasRealtime === false ? "" : ", networking difficulty analysis, exhibitor value card,"} and feature breakdown.
    </p>
    <p style="color:#334155;margin:0 0 18px;">We'd love to walk you through these numbers in a 20-minute live demo.</p>
    <div style="text-align:center;margin:22px 0;">
      <a href="https://www.identyca.io" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#ffffff;text-decoration:none;border-radius:25px;font-weight:700;font-size:14px;">Book a Live Demo &rarr;</a>
    </div>
    <p style="color:#64748b;font-size:12px;margin:0;">Questions? Reply to this email or reach us at <a href="mailto:contact@identyca.io" style="color:#2563eb;">contact@identyca.io</a>.</p>
    <p style="color:#334155;margin:16px 0 0;">Best,<br/><strong>The Identyca Team</strong></p>
  </div>
  <div style="padding:14px 28px;background:#f8fafc;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;text-align:center;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; 2026 Identyca.io &middot; See Who Matters. Connect Instantly. &middot; <a href="https://www.identyca.io" style="color:#2563eb;">www.identyca.io</a></p>
  </div>
</div>
</body></html>`;
}

function buildInternalHtml(lead: RoiLead, inputs: Partial<RoiInputs>, eventName: string, b: RoiResult, c: RoiResult, a: RoiResult) {
  const r = (label: string, value: string, w?: number) =>
    `<tr><td style="padding:6px 12px 6px 0;font-weight:700;${w ? `width:${w}px;` : ""}">${label}</td><td>${value}</td></tr>`;
  const pages = b.hasRealtime === false ? "3" : "6";
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;color:#334155;padding:20px;max-width:600px;">
  <h2 style="color:#1e3a5f;">New ROI Calculator Lead</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
    ${r("Name", esc(lead.name), 120)}
    ${r("Company", esc(lead.company))}
    ${r("Role", esc(lead.role))}
    ${r("Email", `<a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>`)}
  </table>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0;"/>
  <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
    ${r("Event", esc(eventName), 160)}
    ${r("Attendees", esc(inputs.A2 ?? "?"))}
    ${r("Tier", esc(b.tierDisplayName))}
    ${r("Baseline ROI", `<strong>${pct(b.roi)}</strong>`)}
    ${r("Baseline Net Profit", `<strong>${money(b.netProfit)}</strong>`)}
    ${r("Conservative ROI", pct(c.roi))}
    ${r("Aggressive ROI", pct(a.roi))}
    ${b.ndi != null ? r("NDI Score", `${esc(b.ndi)} - ${esc(b.ndiLabel)}`) : ""}
    ${r("Tech Spend (saved)", money(b.techSavings))}
    ${r("Smart Glasses", inputs.D1 ? "Yes" : "No")}
    ${r("Days", esc(inputs.A8 ?? "?"))}
    ${r("Venue sqm", esc(inputs.A9 ?? "?"))}
    ${r("Events/yr", esc(inputs.A10 ?? "?"))}
  </table>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0;"/>
  <p style="color:#64748b;font-size:12px;">Full ${pages}-page report is attached as PDF. Review and follow up within 24 hours.</p>
</body></html>`;
}
