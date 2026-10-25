import { describe, it, expect } from "bun:test";
import { PROPERTY_TRANSLATION_LANGUAGES, isCompletePropertyTranslation, propertyTranslationSourceChanged } from "../src/lib/propertyTranslationRules";

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
  it("rejects mixed descriptions containing an untranslated English paragraph", () => {
    const original = { ...source, description: "Located in Antalya, this project offers comfortable family living.\nOutdoor swimming pool and a modern fitness center." };
    expect(isCompletePropertyTranslation({ title: "Apartamentos en Antalya", location: "Antalya", description: "Situado en Antalya, este proyecto ofrece una cómoda vida familiar.\nOutdoor swimming pool and a modern fitness center." }, original)).toBe(false);
    expect(isCompletePropertyTranslation({ title: "Apartamentos en Antalya", location: "Antalya", description: "Situado en Antalya, este proyecto ofrece una cómoda vida familiar.\nPiscina al aire libre y un gimnasio moderno." }, original)).toBe(true);
  });
  it("retranslates changed source text, but not whitespace-only edits", () => {
    expect(propertyTranslationSourceChanged(source, { ...source, description: "Two villas near the beach." })).toBe(true);
    expect(propertyTranslationSourceChanged(source, { ...source, title: " Luxury villas in Antalya " })).toBe(false);
  });
});