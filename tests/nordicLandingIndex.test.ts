import { describe, it, expect } from "bun:test";
import { NORDIC_LANDING_PAGES } from "../src/data/nordicLandingPages";
import { NORDIC_LANDING_INDEX, nordicAlternates } from "../src/data/nordicLandingIndex";

describe("Nordic landing index", () => {
  it("mirrors every full landing page", () => {
    const full = NORDIC_LANDING_PAGES.map(({ locale, slug, title, description, listingsPath }) => ({ locale, slug, title, description, listingsPath }));
    expect(NORDIC_LANDING_INDEX).toEqual(full);
  });

  it("links each topic in Swedish, Norwegian and Danish", () => {
    for (const page of NORDIC_LANDING_INDEX) {
      const alternates = nordicAlternates(page);
      expect(Object.keys(alternates).sort()).toEqual(["da", "no", "sv"]);
      expect(alternates[page.locale]).toBe(`https://futurehomesinternational.com/${page.locale}/${page.slug}`);
    }
  });
});
