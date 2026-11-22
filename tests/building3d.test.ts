import { describe, it, expect } from "bun:test";
import { applyHomography, normalizeBuildingSpec, squareToQuad, validQuad, type FacadeQuad } from "../src/lib/building3d";

const quad: FacadeQuad = [[0.37, 0.31], [0.58, 0.2], [0.58, 0.7], [0.37, 0.71]];

describe("facade photo mapping", () => {
  it("maps the unit square corners onto the photo quad", () => {
    const H = squareToQuad(quad);
    const corners: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1]];
    corners.forEach(([u, v], i) => {
      const [x, y] = applyHomography(H, u, v);
      expect(x).toBeCloseTo(quad[i][0], 6);
      expect(y).toBeCloseTo(quad[i][1], 6);
    });
  });

  it("rejects crossed, tiny or upside-down outlines", () => {
    expect(validQuad(quad)).not.toBeNull();
    expect(validQuad([[0.58, 0.2], [0.37, 0.31], [0.58, 0.7], [0.37, 0.71]])).toBeNull();
    expect(validQuad([[0.5, 0.5], [0.51, 0.5], [0.51, 0.51], [0.5, 0.51]])).toBeNull();
    expect(validQuad([[0.37, 0.71], [0.58, 0.7], [0.58, 0.2], [0.37, 0.31]])).toBeNull();
  });

  it("accepts 0–1000 coordinates", () => {
    expect(validQuad([[370, 310], [580, 200], [580, 700], [370, 710]])?.[1]).toEqual([0.58, 0.2]);
  });
});

describe("building spec validation", () => {
  const images = ["https://x.test/a.jpg", "https://x.test/b.jpg"];

  it("resolves facade and room photos by index and keeps one facade per side", () => {
    const spec = normalizeBuildingSpec({
      kind: "tower", floors: 18,
      facades: [
        { imageIndex: 0, side: "left", quad },
        { imageIndex: 1, side: "left", quad },
        { imageIndex: 9, side: "right", quad },
      ],
      rooms: [{ imageIndex: 1, type: "living", label: "Living room" }],
    }, images);
    expect(spec.facades).toHaveLength(1);
    expect(spec.facades[0].image).toBe(images[0]);
    expect(spec.rooms[0]).toEqual({ image: images[1], type: "living", label: "Living room" });
    expect(spec.floors).toBe(18);
  });

  it("still renders specs stored before facades existed", () => {
    const old = { floors: 5, width: 24, depth: 16, facadeColor: "#efeae2", balconies: "projecting", roof: "flat", rooms: [{ image: "https://x.test/r.jpg", type: "bedroom", label: "Bedroom" }] };
    const spec = normalizeBuildingSpec(old, []);
    expect(spec.kind).toBe("apartment_block");
    expect(spec.rooms).toHaveLength(1);
    expect(spec.facades).toEqual([]);
  });

  it("clamps untrusted numbers and colours", () => {
    const spec = normalizeBuildingSpec({ floors: 500, width: -3, facadeColor: "red", windowRatio: 7 }, []);
    expect(spec.floors).toBe(60);
    expect(spec.width).toBe(6);
    expect(spec.facadeColor).toBe("#efeae2");
    expect(spec.windowRatio).toBe(0.95);
  });
});
