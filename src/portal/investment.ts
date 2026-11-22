import { calculate, MARKETS, SCENARIOS, type MarketKey } from "@/lib/investmentCalc";

/** Maps a listing's location/country to the cost model used by the investment calculator. */
export function marketFor(location?: string | null, country?: string | null): MarketKey {
  const s = `${location ?? ""} ${country ?? ""}`.toLowerCase();
  if (/dubai|uae|emirates/.test(s)) return "dubai";
  if (/bali|indonesia/.test(s)) return "bali";
  return "antalya";
}

export function parsePrice(v: unknown): number {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Deterministic numbers the AI narrative must build on (cash purchase, calculator defaults). */
export function investmentNumbers(price: number, market: MarketKey, nightly?: number) {
  const d = MARKETS[market].defaults;
  const input = { price, downPaymentPct: 100, nightly: nightly && nightly > 0 ? nightly : d.nightly, occupancy: d.occupancy, managementPct: d.managementPct, loanRatePct: 0 };
  const scenarios = SCENARIOS.map((s) => ({ key: s.key, label: s.label, ...calculate(market, input, s.occFactor, s.rateFactor) }));
  const base = scenarios.find((s) => s.key === "base")!;
  const growth = { careful: 3, base: 6, optimistic: 9 };
  const projections = Object.entries(growth).map(([k, g]) => ({
    scenario: k,
    value5y: price * Math.pow(1 + g / 100, 5),
    value10y: price * Math.pow(1 + g / 100, 10),
    total10y: price * Math.pow(1 + g / 100, 10) - price + base.net * 10,
  }));
  return { market, marketLabel: MARKETS[market].label, input, scenarios, projections };
}
