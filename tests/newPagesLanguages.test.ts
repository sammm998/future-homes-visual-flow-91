import { expect, test } from "bun:test";
import { EN, newPagesCopy } from "../src/content/newPagesCopy";
const LANGS = ["sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "es", "de", "fr", "id"];
test("new guide pages exist in all 12 non-English languages", () => {
  for (const l of LANGS) {
    const c = newPagesCopy(l);
    expect(c.meta.yield.title).not.toBe(EN.meta.yield.title);
    expect(c.guide.steps.length).toBe(EN.guide.steps.length);
  }
});
