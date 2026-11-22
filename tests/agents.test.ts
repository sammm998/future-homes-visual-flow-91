import { describe, expect, it } from "vitest";
import { needsApproval, parseMention } from "@/admin/agents/agents";

describe("agent approvals", () => {
  it("requires approval before sending e-mail", () => expect(needsApproval("send_email", {})).toBe(true));
  it("requires approval for deletes", () => expect(needsApproval("delete_task", { id: "x" })).toBe(true));
  it("runs CRM record creation directly", () => expect(needsApproval("create_task", { title: "Call" })).toBe(false));
  it("requires approval for app actions that write", () =>
    expect(needsApproval("COMPOSIO_MULTI_EXECUTE_TOOL", { tools: [{ tool_slug: "GMAIL_SEND_EMAIL" }] })).toBe(true));
  it("lets read-only app actions run", () =>
    expect(needsApproval("COMPOSIO_MULTI_EXECUTE_TOOL", { tools: [{ tool_slug: "GMAIL_FETCH_EMAILS" }, { tool_slug: "GOOGLECALENDAR_LIST_EVENTS" }] })).toBe(false));
});

describe("agent mentions", () => {
  it("routes @marketing to the marketing agent", () => expect(parseMention("@marketing write a post")).toEqual({ agent: "marketing", text: "write a post" }));
  it("ignores unknown handles", () => expect(parseMention("@bob hi").agent).toBeNull());
});
