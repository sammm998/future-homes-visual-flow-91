import { describe, expect, it } from "vitest";
import { absenceDays, findDuplicates, isBlocked, projectProgress, requiresApproval, trackedMinutes } from "@/admin/workspace/projectModel";

describe("projects", () => {
  const tasks = [{ id: "a", status: "todo", depends_on: null, starts_on: null, ends_on: null }, { id: "b", status: "todo", depends_on: "a", starts_on: null, ends_on: null }];
  it("blocks a task until its dependency is done", () => expect(isBlocked(tasks[1]!, tasks)).toBe(true));
  it("unblocks once the dependency is done", () => expect(isBlocked(tasks[1]!, [{ ...tasks[0]!, status: "done" }, tasks[1]!])).toBe(false));
  it("computes progress", () => expect(projectProgress([{ status: "done" }, { status: "todo" }])).toBe(50));
});
describe("time and absence", () => {
  it("adds tracked minutes", () => expect(trackedMinutes([{ started_at: "2026-01-01T08:00:00Z", ended_at: "2026-01-01T09:30:00Z" }])).toBe(90));
  it("counts absence days inclusive", () => expect(absenceDays("2026-07-01", "2026-07-05")).toBe(5));
});
describe("approvals", () => {
  it("needs approval above 5 % discount", () => expect(requiresApproval(6, 100_000)).toBe(true));
  it("does not need approval at 5 %", () => expect(requiresApproval(5, 100_000)).toBe(false));
});
describe("companies", () => {
  it("finds duplicates ignoring legal suffix", () => expect(findDuplicates([{ id: "1", name: "Acme Ltd", email: null }, { id: "2", name: "ACME", email: null }, { id: "3", name: "Other", email: null }])).toHaveLength(1));
});
