/** Shared (browser-safe) shape of the AI-derived building description used by the 3D viewer. */
export type BuildingRoom = { image: string; type: string; label: string };
export type BuildingSpec = {
  floors: number;
  width: number;
  depth: number;
  facadeColor: string;
  accentColor: string;
  glassColor: string;
  balconies: "none" | "projecting" | "recessed" | "wraparound";
  roof: "flat" | "terrace" | "pitched";
  hasPool: boolean;
  greenery: "low" | "medium" | "high";
  blocks: number;
  rooms: BuildingRoom[];
};

const clamp = (n: unknown, lo: number, hi: number, d: number) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : d;
};
const hex = (v: unknown, d: string) => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : d);
const pick = <T extends string>(v: unknown, opts: readonly T[], d: T): T => (opts.includes(v as T) ? (v as T) : d);

/** Validates untrusted model output into a renderable spec. */
export function normalizeBuildingSpec(raw: any, images: string[]): BuildingSpec {
  const rooms: BuildingRoom[] = Array.isArray(raw?.rooms)
    ? raw.rooms
        .map((r: any) => ({ i: Number(r?.imageIndex), type: String(r?.type ?? "room").slice(0, 30), label: String(r?.label ?? r?.type ?? "Room").slice(0, 40) }))
        .filter((r: any) => Number.isInteger(r.i) && images[r.i])
        .map((r: any) => ({ image: images[r.i]!, type: r.type, label: r.label }))
        .slice(0, 12)
    : [];
  return {
    floors: clamp(raw?.floors, 1, 40, 5),
    width: clamp(raw?.width, 8, 80, 24),
    depth: clamp(raw?.depth, 8, 60, 16),
    facadeColor: hex(raw?.facadeColor, "#efeae2"),
    accentColor: hex(raw?.accentColor, "#5b4636"),
    glassColor: hex(raw?.glassColor, "#6f8a9c"),
    balconies: pick(raw?.balconies, ["none", "projecting", "recessed", "wraparound"] as const, "projecting"),
    roof: pick(raw?.roof, ["flat", "terrace", "pitched"] as const, "flat"),
    hasPool: Boolean(raw?.hasPool),
    greenery: pick(raw?.greenery, ["low", "medium", "high"] as const, "medium"),
    blocks: clamp(raw?.blocks, 1, 4, 1),
    rooms,
  };
}
