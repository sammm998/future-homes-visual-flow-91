import { expect, test } from "bun:test";
import { investmentNumbers, marketFor, parsePrice } from "../src/portal/investment";

test("Dubai listings use the Dubai cost model", () => expect(marketFor("Dubai Marina", null)).toBe("dubai"));
test("Turkish listings default to the Antalya model", () => expect(marketFor("Mersin", "Turkey")).toBe("antalya"));
test("price strings are parsed", () => expect(parsePrice("€126,000")).toBe(126000));
test("Antalya base scenario: 4% deed + 2% legal/stamp on a cash purchase", () => {
  const r = investmentNumbers(100000, "antalya");
  const base = r.scenarios.find((s) => s.key === "base")!;
  expect(base.purchaseCosts).toBe(6000);
  expect(base.cashInvested).toBe(106000);
  expect(base.yearlyInterest).toBe(0);
});
