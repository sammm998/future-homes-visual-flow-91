/**
 * Shared (browser-safe) description of a home's building, produced once by an
 * admin-triggered AI analysis of the listing photos and rendered by the 3D
 * viewer. Everything coming from the model is validated here.
 */
export type BuildingRoom = { image: string; type: string; label: string };

/** Four corners (top-left, top-right, bottom-right, bottom-left) in a photo, normalised 0–1, y down. */
export type FacadeQuad = [[number, number], [number, number], [number, number], [number, number]];

/**
 * A facade visible in an exterior photo. "left"/"right" is its side of the
 * building corner nearest the camera; the viewer maps "left" onto the face
 * along `width` and "right" onto the face along `depth`.
 */
export type FacadePhoto = { image: string; side: "left" | "right"; quad: FacadeQuad };

export type BuildingKind = "apartment_block" | "tower" | "villa" | "townhouses" | "complex";
export type BuildingSpec = {
  kind: BuildingKind;
  footprint: "rectangle" | "L" | "U";
  floors: number;
  /** Metres along the face that appears on the left of the nearest corner. */
  width: number;
  /** Metres along the face that appears on the right of the nearest corner. */
  depth: number;
  blocks: number;
  blockLayout: "row" | "grid" | "staggered";
  podiumFloors: number;
  podiumColor: string;
  facadeColor: string;
  accentColor: string;
  secondaryColor: string;
  glassColor: string;
  roofColor: string;
  material: "render" | "stone" | "concrete" | "wood" | "brick" | "glass";
  windowStyle: "floor_to_ceiling" | "punched" | "ribbon";
  windowRatio: number;
  balconies: "none" | "projecting" | "recessed" | "wraparound";
  railing: "glass" | "metal" | "solid";
  corners: "sharp" | "rounded";
  roof: "flat" | "terrace" | "pitched" | "pergola";
  hasPool: boolean;
  greenery: "low" | "medium" | "high";
  palms: boolean;
  setting: "seaside" | "city" | "hills" | "tropical" | "suburban";
  facades: FacadePhoto[];
  rooms: BuildingRoom[];
};

const clamp = (n: unknown, lo: number, hi: number, d: number, round = true) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return d;
  const c = Math.min(hi, Math.max(lo, v));
  return round ? Math.round(c) : c;
};
const hex = (v: unknown, d: string) => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : d);
const pick = <T extends string>(v: unknown, opts: readonly T[], d: T): T => (opts.includes(v as T) ? (v as T) : d);

const KIND_DEFAULTS: Record<BuildingKind, { floors: number; width: number; depth: number }> = {
  apartment_block: { floors: 6, width: 26, depth: 16 },
  tower: { floors: 20, width: 30, depth: 20 },
  villa: { floors: 2, width: 16, depth: 12 },
  townhouses: { floors: 2, width: 30, depth: 10 },
  complex: { floors: 6, width: 26, depth: 16 },
};

const point = (p: unknown): [number, number] | null => {
  if (!Array.isArray(p) || p.length < 2) return null;
  const x = Number(p[0]);
  const y = Number(p[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  // Accept 0–1 or 0–1000 (Gemini-style) coordinates.
  const s = Math.max(Math.abs(x), Math.abs(y)) > 1.5 ? 1000 : 1;
  return [Math.min(1, Math.max(0, x / s)), Math.min(1, Math.max(0, y / s))];
};

const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
  (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

/** A usable facade outline: convex, correctly ordered and not a sliver. */
export function validQuad(raw: unknown): FacadeQuad | null {
  if (!Array.isArray(raw) || raw.length !== 4) return null;
  const pts = raw.map(point);
  if (pts.some((p) => !p)) return null;
  const q = pts as FacadeQuad;
  const turns = [0, 1, 2, 3].map((i) => cross(q[i], q[(i + 1) % 4], q[(i + 2) % 4]));
  // Image y points down, so a clockwise tl→tr→br→bl outline has positive turns.
  if (!turns.every((t) => t > 0)) return null;
  const area = Math.abs(turns.reduce((acc, _, i) => acc + (q[i][0] * q[(i + 1) % 4][1] - q[(i + 1) % 4][0] * q[i][1]), 0)) / 2;
  if (area < 0.01) return null;
  // Top edge must be above the bottom edge on both sides.
  if (q[0][1] >= q[3][1] || q[1][1] >= q[2][1]) return null;
  return q;
}

/** Validates untrusted model output (or an older stored spec) into a renderable spec. */
export function normalizeBuildingSpec(raw: any, images: string[]): BuildingSpec {
  const imageAt = (i: unknown): string | null => {
    const n = Number(i);
    return Number.isInteger(n) && images[n] ? images[n]! : null;
  };
  const rooms: BuildingRoom[] = Array.isArray(raw?.rooms)
    ? raw.rooms
        .map((r: any) => ({
          image: typeof r?.image === "string" ? r.image : imageAt(r?.imageIndex),
          type: String(r?.type ?? "room").slice(0, 30),
          label: String(r?.label ?? r?.type ?? "Room").slice(0, 40),
        }))
        .filter((r: any) => typeof r.image === "string" && /^https?:\/\//.test(r.image))
        .slice(0, 12)
    : [];
  const facades: FacadePhoto[] = Array.isArray(raw?.facades)
    ? raw.facades
        .map((f: any) => ({
          image: typeof f?.image === "string" ? f.image : imageAt(f?.imageIndex),
          side: pick(f?.side, ["left", "right"] as const, "left"),
          quad: validQuad(f?.quad),
        }))
        .filter((f: any) => typeof f.image === "string" && /^https?:\/\//.test(f.image) && f.quad)
        // One photo per side: the first (best) one the analysis listed.
        .filter((f: FacadePhoto, i: number, arr: FacadePhoto[]) => arr.findIndex((g) => g.side === f.side) === i)
    : [];

  const kind = pick(raw?.kind, ["apartment_block", "tower", "villa", "townhouses", "complex"] as const, "apartment_block");
  const d = KIND_DEFAULTS[kind];
  const facadeColor = hex(raw?.facadeColor, "#efeae2");
  return {
    kind,
    footprint: pick(raw?.footprint, ["rectangle", "L", "U"] as const, "rectangle"),
    floors: clamp(raw?.floors, 1, 60, d.floors),
    width: clamp(raw?.width, 6, 120, d.width),
    depth: clamp(raw?.depth, 6, 80, d.depth),
    blocks: clamp(raw?.blocks, 1, 6, 1),
    blockLayout: pick(raw?.blockLayout, ["row", "grid", "staggered"] as const, "row"),
    podiumFloors: clamp(raw?.podiumFloors, 0, 4, 0),
    podiumColor: hex(raw?.podiumColor, hex(raw?.accentColor, "#5b4636")),
    facadeColor,
    accentColor: hex(raw?.accentColor, "#5b4636"),
    secondaryColor: hex(raw?.secondaryColor, facadeColor),
    glassColor: hex(raw?.glassColor, "#6f8a9c"),
    roofColor: hex(raw?.roofColor, kind === "villa" || raw?.roof === "pitched" ? "#8a4b35" : "#d9d4cb"),
    material: pick(raw?.material, ["render", "stone", "concrete", "wood", "brick", "glass"] as const, "render"),
    windowStyle: pick(raw?.windowStyle, ["floor_to_ceiling", "punched", "ribbon"] as const, "floor_to_ceiling"),
    windowRatio: clamp(raw?.windowRatio, 0.2, 0.95, 0.6, false),
    balconies: pick(raw?.balconies, ["none", "projecting", "recessed", "wraparound"] as const, "projecting"),
    railing: pick(raw?.railing, ["glass", "metal", "solid"] as const, "glass"),
    corners: pick(raw?.corners, ["sharp", "rounded"] as const, "sharp"),
    roof: pick(raw?.roof, ["flat", "terrace", "pitched", "pergola"] as const, kind === "villa" ? "flat" : "flat"),
    hasPool: Boolean(raw?.hasPool),
    greenery: pick(raw?.greenery, ["low", "medium", "high"] as const, "medium"),
    palms: Boolean(raw?.palms),
    setting: pick(raw?.setting, ["seaside", "city", "hills", "tropical", "suburban"] as const, "suburban"),
    facades,
    rooms,
  };
}

/**
 * Projective map from the unit square (u right, v down) onto a photo quad:
 * returns the row-major 3×3 matrix H with [x, y, w] = H · [u, v, 1].
 */
export function squareToQuad(q: FacadeQuad): number[] {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) {
    return [x1 - x0, x3 - x0, x0, y1 - y0, y3 - y0, y0, 0, 0, 1];
  }
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const h = (dx1 * dy3 - dx3 * dy1) / det;
  return [x1 - x0 + g * x1, x3 - x0 + h * x3, x0, y1 - y0 + g * y1, y3 - y0 + h * y3, y0, g, h, 1];
}

export const applyHomography = (H: number[], u: number, v: number): [number, number] => {
  const w = H[6] * u + H[7] * v + H[8];
  return [(H[0] * u + H[1] * v + H[2]) / w, (H[3] * u + H[4] * v + H[5]) / w];
};
