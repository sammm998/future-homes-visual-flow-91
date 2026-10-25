import { describe, it, expect } from "bun:test";
import { pickPropertyTranslation, propertyTranslationSourceHash } from "../src/lib/propertyTranslationRules";

const source = { title: "Luxury villas in Antalya", description: "A villa near the beach.", location: "Antalya" };
const cloud = { title: "Vila mewah di Antalya", description: "Vila dekat pantai.", location: "Antalya", source_hash: propertyTranslationSourceHash(source) };

import { containsCopiedSourceProse } from "../src/lib/propertyTranslationRules";
describe("copied English detection", () => {
  it("allows place-name distance lines kept in English", () => {
    const src = "A calm villa with a pool and garden in Tabanan.\nNgurah Rai International Airport (DPS): 25 km";
    expect(containsCopiedSourceProse("En rolig villa med pool og have i Tabanan.\nNgurah Rai International Airport (DPS): 25 km", src)).toBe(false);
  });
});

describe("choosing the translation visitors see", () => {
  it("uses the Cloud translation when the original database has none", () => {
    expect(pickPropertyTranslation(null, cloud, source)?.title).toBe("Vila mewah di Antalya");
  });
  it("uses the Cloud translation instead of a copied English one", () => {
    expect(pickPropertyTranslation({ ...source }, cloud, source)?.title).toBe("Vila mewah di Antalya");
  });
  it("keeps a complete original-database translation", () => {
    const legacy = { title: "Villa di Antalya", description: "Dekat pantai.", location: "Antalya" };
    expect(pickPropertyTranslation(legacy, cloud, source)?.title).toBe("Villa di Antalya");
  });
  it("ignores a Cloud translation once the English text has changed", () => {
    expect(pickPropertyTranslation(null, cloud, { ...source, description: "A new villa." })).toBeNull();
  });
});
