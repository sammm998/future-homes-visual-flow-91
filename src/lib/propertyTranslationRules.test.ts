import { describe, it, expect } from "bun:test";
import { PROPERTY_TRANSLATION_LANGUAGES, isCompletePropertyTranslation, propertyTranslationSourceChanged } from "./propertyTranslationRules";

const source = { title: "Luxury villas in Antalya", description: "A villa near the beach.", location: "Antalya" };
describe("property translation completeness", () => {
  it("covers all twelve translations plus the English original", () => {
    expect([...PROPERTY_TRANSLATION_LANGUAGES].sort()).toEqual(["sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "de", "fr", "es", "id"].sort());
    expect(PROPERTY_TRANSLATION_LANGUAGES.length + 1).toBe(13);
  });
  it("does not count English titles as Indonesian translations", () => {
    expect(isCompletePropertyTranslation({ ...source, description: "Vila dekat pantai." }, source)).toBe(false);
  });
  it("does not count missing paragraphs or location as complete", () => {
    expect(isCompletePropertyTranslation({ title: "Vila mewah", description: " " }, source)).toBe(false);
    expect(isCompletePropertyTranslation({ title: "Vila mewah", description: "Vila dekat pantai." }, source)).toBe(false);
  });
  it("allows unchanged proper place names with translated prose", () => {
    expect(isCompletePropertyTranslation({ title: "Vila mewah di Antalya", description: "Vila dekat pantai.", location: "Antalya" }, source)).toBe(true);
  });
  it("retranslates changed source text, but not whitespace-only edits", () => {
    expect(propertyTranslationSourceChanged(source, { ...source, description: "Two villas near the beach." })).toBe(true);
    expect(propertyTranslationSourceChanged(source, { ...source, title: " Luxury villas in Antalya " })).toBe(false);
  });
});