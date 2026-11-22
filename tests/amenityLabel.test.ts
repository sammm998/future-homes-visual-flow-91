import { describe, it, expect } from "bun:test";
import { amenityTranslations, translateAmenityFromTable } from "../src/utils/amenityTranslations";
import { translateAmenity } from "../src/utils/amenityLabel";
import { ensureLanguage } from "../src/utils/translations";

describe("amenity labels from per-language dictionaries", () => {
  it("match the full translation table in every language", async () => {
    const labels = [...new Set(Object.values(amenityTranslations).flatMap((d) => Object.keys(d)))];
    for (const lang of Object.keys(amenityTranslations)) {
      await ensureLanguage(lang);
      for (const label of [...labels, "sea view", " Swimming Pool ", "Unknown amenity"]) {
        expect(translateAmenity(label, lang)).toBe(translateAmenityFromTable(label, lang));
      }
    }
  });
});
