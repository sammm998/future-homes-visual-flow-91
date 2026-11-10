import { describe, expect, it } from "vitest";
import { propertyCompletionDate } from "../src/admin/propertyCompletionDate";

describe("property completion dates", () => {
  it("saves a completion month as a full database date", () => {
    expect(propertyCompletionDate("2027-03")).toBe("2027-03-01");
    expect(propertyCompletionDate("03/2027")).toBe("2027-03-01");
  });
  it("preserves an existing completion day", () => {
    expect(propertyCompletionDate("2027-03-19")).toBe("2027-03-19");
  });
  it("rejects incomplete and impossible dates before saving", () => {
    for (const value of ["3", "2027-13", "2027-02-29", "2027-00", "2027-03-00"]) {
      expect(() => propertyCompletionDate(value)).toThrow();
    }
    expect(propertyCompletionDate("2028-02-29")).toBe("2028-02-29");
  });
  it("allows an unspecified completion date", () => {
    expect(propertyCompletionDate(" ")).toBeNull();
  });
});