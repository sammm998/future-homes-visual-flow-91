import { describe, it, expect } from "vitest";
import { aggregate, toCsv } from "@/admin/workspace/bi";
import { newRoomUrl, shareExpiry } from "@/admin/workspace/meeting";

const deals = [
  { stage: "won", value_eur: 100000, owner_id: "a", created_at: "2026-10-03" },
  { stage: "won", value_eur: 50000, owner_id: "b", created_at: "2026-11-01" },
  { stage: "lost", value_eur: 90000, owner_id: "a", created_at: "2026-11-02" },
];
describe("BI builder", () => {
  it("revenue counts only won deals", () => expect(aggregate(deals, "revenue", "owner")).toEqual([{ key: "a", value: 100000 }, { key: "b", value: 50000 }]));
  it("month dimension sorts chronologically", () => expect(aggregate(deals, "deals", "month").map((r) => r.key)).toEqual(["2026-10", "2026-11"]));
  it("csv escapes commas", () => expect(toCsv([{ key: "Antalya, TR", value: 2 }], ["Country", "Leads"])).toBe('Country,Leads\n"Antalya, TR",2'));
});
describe("meetings and share links", () => {
  it("room url is a Jitsi room", () => expect(newRoomUrl("Viewing Ahmed!", () => "x1")).toBe("https://meet.jit.si/FutureHomes-viewing-ahmed-x1"));
  it("share links expire within 1-90 days", () => {
    expect(shareExpiry(500, 0)).toBe(new Date(90 * 864e5).toISOString());
    expect(shareExpiry(0, 0)).toBe(new Date(864e5).toISOString());
  });
});
