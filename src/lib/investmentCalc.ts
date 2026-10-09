// Indicative cost model (public rates, 2025/26). Confirm with local advisers before relying on it.
export type MarketKey = "antalya" | "dubai" | "bali";

export type MarketModel = {
  label: string;
  purchaseCosts: { label: string; pct: number }[];
  yearlyPct: { label: string; pct: number }[]; // % of price per year
  rentalTaxPct: number; // tax on net rental profit
  defaults: { nightly: number; occupancy: number; managementPct: number };
};

export const MARKETS: Record<MarketKey, MarketModel> = {
  antalya: {
    label: "Antalya, Turkey",
    purchaseCosts: [
      { label: "Title deed fee", pct: 4 },
      { label: "Legal, translation & valuation", pct: 1.5 },
      { label: "Stamp duty & admin", pct: 0.5 },
    ],
    yearlyPct: [
      { label: "Property tax", pct: 0.2 },
      { label: "Building fee & maintenance", pct: 0.8 },
      { label: "Insurance (DASK + home)", pct: 0.1 },
    ],
    rentalTaxPct: 20,
    defaults: { nightly: 90, occupancy: 55, managementPct: 20 },
  },
  dubai: {
    label: "Dubai, UAE",
    purchaseCosts: [
      { label: "DLD transfer fee", pct: 4 },
      { label: "Registration & trustee", pct: 0.4 },
      { label: "Legal & admin", pct: 0.5 },
    ],
    yearlyPct: [
      { label: "Service charge", pct: 1.2 },
      { label: "Insurance", pct: 0.1 },
      { label: "Holiday-home permit & DTCM", pct: 0.2 },
    ],
    rentalTaxPct: 0,
    defaults: { nightly: 160, occupancy: 70, managementPct: 20 },
  },
  bali: {
    label: "Bali, Indonesia",
    purchaseCosts: [
      { label: "Notary & PPAT fees", pct: 1.5 },
      { label: "Buyer transfer tax (BPHTB)", pct: 5 },
      { label: "Legal due diligence", pct: 1 },
    ],
    yearlyPct: [
      { label: "Land & building tax", pct: 0.3 },
      { label: "Villa maintenance & staff", pct: 2 },
      { label: "Insurance", pct: 0.2 },
    ],
    rentalTaxPct: 10,
    defaults: { nightly: 140, occupancy: 65, managementPct: 25 },
  },
};

export type CalcInput = {
  price: number;
  downPaymentPct: number;
  nightly: number;
  occupancy: number; // %
  managementPct: number;
  loanRatePct: number;
};

export const SCENARIOS = [
  { key: "careful", label: "Careful", occFactor: 0.7, rateFactor: 0.85 },
  { key: "base", label: "Base", occFactor: 1, rateFactor: 1 },
  { key: "optimistic", label: "Optimistic", occFactor: 1.15, rateFactor: 1.1 },
  { key: "stress", label: "Vacancy stress", occFactor: 0.4, rateFactor: 0.8 },
] as const;

export function calculate(market: MarketKey, input: CalcInput, occFactor = 1, rateFactor = 1) {
  const m = MARKETS[market];
  const price = Math.max(0, input.price);
  const purchaseCosts = m.purchaseCosts.reduce((s, c) => s + (price * c.pct) / 100, 0);
  const cashInvested = (price * input.downPaymentPct) / 100 + purchaseCosts;
  const loan = price * (1 - input.downPaymentPct / 100);
  const yearlyInterest = (loan * input.loanRatePct) / 100;
  const occupancy = Math.min(100, input.occupancy * occFactor);
  const nights = Math.round((365 * occupancy) / 100);
  const gross = nights * input.nightly * rateFactor;
  const management = (gross * input.managementPct) / 100;
  const fixed = m.yearlyPct.reduce((s, c) => s + (price * c.pct) / 100, 0);
  const preTax = gross - management - fixed - yearlyInterest;
  const tax = preTax > 0 ? (preTax * m.rentalTaxPct) / 100 : 0;
  const net = preTax - tax;
  return {
    purchaseCosts,
    cashInvested,
    nights,
    gross,
    management,
    fixed,
    yearlyInterest,
    tax,
    net,
    monthly: net / 12,
    grossYield: price ? (gross / price) * 100 : 0,
    cashOnCash: cashInvested ? (net / cashInvested) * 100 : 0,
  };
}
