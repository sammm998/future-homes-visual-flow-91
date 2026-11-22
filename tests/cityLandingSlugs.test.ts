import { describe, it, expect } from "bun:test";
import { cityLandingPages } from "../src/data/cityLandingPages";
import { CITY_LANDING_SLUGS } from "../src/data/cityLandingSlugs";

describe("city landing slug index", () => {
  it("lists exactly the configured landing pages", () => {
    expect([...CITY_LANDING_SLUGS]).toEqual(cityLandingPages.map((c) => c.slug));
  });
});
