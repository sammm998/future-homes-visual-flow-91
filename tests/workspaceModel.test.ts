import { describe, it, expect } from "vitest";
import { DEAL_STAGES, summarizeStages, filterDeals, ruleMatches, reminderDue, fillTemplate } from "@/admin/workspace/model";

describe("deal pipeline", () => {
  it("has stages in order New → Won/Lost", () => {
    expect(DEAL_STAGES.map((s) => s.key)).toEqual(["new", "contacted", "viewing", "negotiation", "reservation", "won", "lost"]);
  });
  it("sums count and value per stage", () => {
    const s = summarizeStages([{ stage: "new", value_eur: 100 }, { stage: "new", value_eur: "50" }, { stage: "won", value_eur: 7 }]);
    expect(s["new"]).toEqual({ count: 2, total: 150 });
    expect(s["won"]).toEqual({ count: 1, total: 7 });
  });
  it("filters by owner and country", () => {
    const d = [{ stage: "new", value_eur: 1, owner_id: "a", country: "Turkey" }, { stage: "new", value_eur: 1, owner_id: "b", country: "UAE" }];
    expect(filterDeals(d, { owner: "a" })).toHaveLength(1);
    expect(filterDeals(d, { country: "uae" })[0]?.owner_id).toBe("b");
  });
});

describe("automation rules", () => {
  it("fires only on its own trigger", () => {
    expect(ruleMatches("lead_created", {}, "viewing_booked", {})).toBe(false);
    expect(ruleMatches("lead_created", {}, "lead_created", {})).toBe(true);
  });
  it("respects target stage", () => {
    expect(ruleMatches("deal_stage_changed", { to_stage: "won" }, "deal_stage_changed", { to_stage: "lost" })).toBe(false);
    expect(ruleMatches("deal_stage_changed", { to_stage: "won" }, "deal_stage_changed", { to_stage: "won" })).toBe(true);
  });
  it("stale rule needs at least N idle days", () => {
    expect(ruleMatches("deal_stale", { days: 7 }, "deal_stale", { idle_days: 6 })).toBe(false);
    expect(ruleMatches("deal_stale", { days: 7 }, "deal_stale", { idle_days: 7 })).toBe(true);
  });
  it("fills name placeholders", () => {
    expect(fillTemplate("Hi {name}", { name: "Ali" })).toBe("Hi Ali");
  });
});

describe("calendar reminders", () => {
  const now = new Date("2026-11-22T10:00:00Z");
  it("sends 60 minutes before start", () => {
    expect(reminderDue("2026-11-22T10:59:00Z", 60, now, null)).toBe(true);
    expect(reminderDue("2026-11-22T11:30:00Z", 60, now, null)).toBe(false);
  });
  it("never sends twice or after start", () => {
    expect(reminderDue("2026-11-22T10:30:00Z", 60, now, "x")).toBe(false);
    expect(reminderDue("2026-11-22T09:30:00Z", 60, now, null)).toBe(false);
  });
});
