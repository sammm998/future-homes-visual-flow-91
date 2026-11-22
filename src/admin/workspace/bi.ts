// Pure BI aggregation helpers for the report builder.
export type Metric = "leads" | "deals" | "revenue" | "won";
export type Dimension = "source" | "owner" | "country" | "month" | "stage" | "status";
export type Row = Record<string, unknown>;

export function dimensionValue(row: Row, dim: Dimension): string {
  if (dim === "month") return String(row["created_at"] ?? "").slice(0, 7) || "—";
  if (dim === "country") {
    const c = row["country"] ?? (Array.isArray(row["preferred_countries"]) ? (row["preferred_countries"] as string[])[0] : null);
    return c ? String(c) : "—";
  }
  if (dim === "owner") return String(row["owner_id"] ?? row["assigned_to"] ?? "") || "Unassigned";
  return String(row[dim] ?? "") || "—";
}

export function aggregate(rows: Row[], metric: Metric, dim: Dimension): { key: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (metric === "won" && r["stage"] !== "won") continue;
    const k = dimensionValue(r, dim);
    const add = metric === "revenue" ? (r["stage"] === "won" ? Number(r["value_eur"]) || 0 : 0) : 1;
    map.set(k, (map.get(k) ?? 0) + add);
  }
  return [...map.entries()].map(([key, value]) => ({ key, value })).sort((a, b) => (dim === "month" ? a.key.localeCompare(b.key) : b.value - a.value));
}

export function toCsv(rows: { key: string; value: number }[], header: [string, string]): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [header.map(esc).join(","), ...rows.map((r) => `${esc(r.key)},${r.value}`)].join("\n");
}
