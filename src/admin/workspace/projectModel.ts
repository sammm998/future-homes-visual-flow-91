// Pure helpers for projects, time tracking and approvals.
export type PTask = { id: string; status: string; depends_on: string | null; starts_on: string | null; ends_on: string | null };

/** A task is blocked while the task it depends on is not done. */
export const isBlocked = (t: PTask, all: PTask[]) => !!t.depends_on && all.find((x) => x.id === t.depends_on)?.status !== "done";

export const projectProgress = (tasks: { status: string }[]) => (tasks.length ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0);

/** Total tracked minutes; a running entry counts up to `now`. */
export function trackedMinutes(entries: { started_at: string; ended_at: string | null }[], now = Date.now()): number {
  return Math.round(entries.reduce((sum, e) => sum + Math.max(0, (e.ended_at ? Date.parse(e.ended_at) : now) - Date.parse(e.started_at)), 0) / 60000);
}

/** Gantt bar position in percent of the project window. */
export function ganttBar(start: string | null, end: string | null, winStart: number, winEnd: number) {
  if (!start) return null;
  const s = Date.parse(start), e = Date.parse(end ?? start) + 864e5, span = Math.max(winEnd - winStart, 864e5);
  return { left: ((s - winStart) / span) * 100, width: Math.max(((e - s) / span) * 100, 1.5) };
}

/** Discounts above this percentage, or deals above this value, need a manager's approval. */
export const APPROVAL_DISCOUNT_PCT = 5;
export const APPROVAL_DEAL_EUR = 1_000_000;
export const requiresApproval = (discountPct: number, valueEur: number) => discountPct > APPROVAL_DISCOUNT_PCT || valueEur > APPROVAL_DEAL_EUR;

export const absenceDays = (start: string, end: string) => Math.max(0, Math.round((Date.parse(end) - Date.parse(start)) / 864e5) + 1);

/** Companies that look like the same customer (same e-mail domain or same normalised name). */
export function findDuplicates<T extends { id: string; name: string; email: string | null }>(rows: T[]): T[][] {
  const key = (r: T) => r.name.toLowerCase().replace(/\b(ltd|llc|inc|gmbh|ab|as|sa|co)\b|[^a-z0-9]/g, "");
  const groups = new Map<string, T[]>();
  for (const r of rows) { const k = key(r); if (!k) continue; groups.set(k, [...(groups.get(k) ?? []), r]); }
  return [...groups.values()].filter((g) => g.length > 1);
}
