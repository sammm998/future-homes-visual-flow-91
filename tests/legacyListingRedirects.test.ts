import { expect, test } from "bun:test";
import { resolveRedirect } from "../src/lib/redirects";
const go = (p: string) => resolveRedirect(`https://futurehomesinternational.com${p}`);
test("old filtered listing links land on their dedicated pages", () => {
  expect(go("/properties?type=villa")).toBe("https://futurehomesinternational.com/luxury-villas-in-turkey");
  expect(go("/properties?type=apartment")).toBe("https://futurehomesinternational.com/apartments-for-sale-in-turkey");
  expect(go("/properties?status=off-plan")).toBe("https://futurehomesinternational.com/off-plan-property-turkey");
  expect(go("/properties?citizenship-eligible=true")).toBe("https://futurehomesinternational.com/turkish-citizenship-by-investment");
  expect(go("/property-for-sale-in-turkey?type=villa")).toBe("https://futurehomesinternational.com/luxury-villas-in-turkey");
});
