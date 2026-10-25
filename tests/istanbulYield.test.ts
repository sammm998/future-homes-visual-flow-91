import { expect, test } from "bun:test";
import { netYield } from "../src/pages/IstanbulRentalYield";
test("net yield deducts management, costs and tax", () => {
  const r = netYield({ price: 200000, monthlyRent: 1000, occupancy: 100, managementPct: 10, annualCosts: 800, taxPct: 20 });
  expect(r.grossYield).toBeCloseTo(6);
  expect(r.netIncome).toBeCloseTo((12000 * 0.9 - 800) * 0.8);
});
