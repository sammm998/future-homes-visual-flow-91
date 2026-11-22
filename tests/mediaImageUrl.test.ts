import { describe, it, expect } from "bun:test";
import { getOptimizedImageUrl } from "../src/utils/imageOptimization";

describe("listing photo URLs", () => {
  const photo = "https://futurehomesinternational.com/api/public/media/legacy/property-images/1474/a.jpg";

  it("asks the media endpoint for a resized copy", () => {
    expect(getOptimizedImageUrl(photo, 640, 72)).toBe(`${photo}?w=640&q=72`);
  });

  it("keeps relative media paths and replaces an earlier size", () => {
    expect(getOptimizedImageUrl("/api/public/media/x.webp?w=1600&q=80", 400, 70)).toBe("/api/public/media/x.webp?w=400&q=70");
  });

  it("leaves the original when no width is requested", () => {
    expect(getOptimizedImageUrl(photo)).toBe(photo);
  });
});
