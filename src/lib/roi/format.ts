/** `$12,345` — rounds, en-US thousands. Negative values render `-$12,345`. */
export function fmtUSD(n: number): string {
  if (n === 0) return "$0";
  const abs = Math.abs(Math.round(n));
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("en-US");
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** `+464%` / `-12%` */
export function fmtSignedPct(n: number): string {
  const r = Math.round(n);
  return (r >= 0 ? "+" : "") + r.toLocaleString("en-US") + "%";
}

/** en-GB long date, e.g. `12 November 2026`. Call only on the client / at request time. */
export function fmtReportDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}
