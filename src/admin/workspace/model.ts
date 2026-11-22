export const DEAL_STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "viewing", label: "Viewing booked" },
  { key: "negotiation", label: "Negotiation" },
  { key: "reservation", label: "Reservation" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
] as const;
export type DealStage = (typeof DEAL_STAGES)[number]["key"];

export const isDealStage = (s: string): s is DealStage => DEAL_STAGES.some((d) => d.key === s);
export const stageIndex = (s: string) => DEAL_STAGES.findIndex((d) => d.key === s);

export type DealLite = { stage: string; value_eur: number | string | null; owner_id?: string | null; country?: string | null };

export function summarizeStages(deals: DealLite[]) {
  const out: Record<string, { count: number; total: number }> = {};
  for (const s of DEAL_STAGES) out[s.key] = { count: 0, total: 0 };
  for (const d of deals) {
    const b = out[d.stage];
    if (!b) continue;
    b.count += 1;
    b.total += Number(d.value_eur) || 0;
  }
  return out;
}

export function filterDeals<T extends DealLite>(deals: T[], f: { owner?: string; country?: string }) {
  return deals.filter((d) => (!f.owner || d.owner_id === f.owner) && (!f.country || (d.country ?? "").toLowerCase() === f.country.toLowerCase()));
}

export const TRIGGERS = [
  { key: "lead_created", label: "New lead" },
  { key: "deal_stage_changed", label: "Deal changes stage" },
  { key: "viewing_booked", label: "Viewing booked" },
  { key: "deal_stale", label: "Deal idle for N days" },
] as const;

export const ACTIONS = [
  { key: "create_task", label: "Create task" },
  { key: "assign", label: "Assign to" },
  { key: "send_email", label: "Send email" },
  { key: "feed_post", label: "Post in feed" },
  { key: "move_deal", label: "Move deal to stage" },
] as const;

export type RuleConditions = { to_stage?: string; source?: string; days?: number };
export type RuleCtx = { to_stage?: string; source?: string; idle_days?: number };

/** Mirrors the database rule matcher so the editor can preview whether a rule fires. */
export function ruleMatches(trigger: string, cond: RuleConditions, event: string, ctx: RuleCtx) {
  if (trigger !== event) return false;
  if (cond.to_stage && cond.to_stage !== ctx.to_stage) return false;
  if (cond.source && cond.source !== ctx.source) return false;
  if (event === "deal_stale" && (ctx.idle_days ?? 0) < (cond.days ?? 7)) return false;
  return true;
}

/** True when a reminder for an event should be sent now. */
export function reminderDue(startsAt: string, remindMinutes: number, now: Date, sentAt: string | null) {
  if (sentAt) return false;
  const start = new Date(startsAt).getTime();
  return start > now.getTime() && start - remindMinutes * 60_000 <= now.getTime();
}

export const fillTemplate = (s: string, vars: Record<string, string | undefined | null>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export const EVENT_KINDS = [
  { key: "viewing", label: "Viewing", cls: "bg-primary text-primary-foreground" },
  { key: "meeting", label: "Meeting", cls: "bg-accent text-accent-foreground" },
  { key: "call", label: "Call", cls: "bg-secondary text-secondary-foreground" },
] as const;
