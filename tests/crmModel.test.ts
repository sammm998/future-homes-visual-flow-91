import { describe, expect, it } from "vitest";
import { forecast, invoiceStatus, nextMessageStatus, normalizeWaNumber, quoteTotals, signatureTokenUsable, toCsv } from "@/admin/crm/model";

describe("CRM rules", () => {
  it("quote totals apply percentage discount", () => {
    expect(quoteTotals([{ qty: 1, unit_price: 200000 }, { qty: 2, unit_price: 1500 }], 5)).toEqual({ subtotal: 203000, discount: 10150, total: 192850 });
  });
  it("discount is clamped between 0 and 100", () => {
    expect(quoteTotals([{ qty: 1, unit_price: 100 }], 150).total).toBe(0);
  });
  it("invoice becomes paid when payments cover amount", () => {
    expect(invoiceStatus({ status: "sent", amount: 1000, due_date: "2026-01-01" }, [{ amount: 600 }, { amount: 400 }], "2026-06-01")).toBe("paid");
  });
  it("unpaid invoice after due date is overdue", () => {
    expect(invoiceStatus({ status: "sent", amount: 1000, due_date: "2026-01-01" }, [{ amount: 100 }], "2026-01-02")).toBe("overdue");
  });
  it("weighted forecast uses stage probabilities and excludes won/lost", () => {
    expect(forecast([{ stage: "reservation", value_eur: 100000 }, { stage: "negotiation", value_eur: 100000 }, { stage: "won", value_eur: 50000 }, { stage: "lost", value_eur: 99 }]))
      .toEqual({ open: 200000, weighted: 130000, won: 50000 });
  });
  it("signing link only works while pending and before expiry", () => {
    const now = new Date("2026-11-22T12:00:00Z");
    expect(signatureTokenUsable({ status: "pending", expires_at: "2026-11-23T00:00:00Z" }, now)).toBe(true);
    expect(signatureTokenUsable({ status: "pending", expires_at: "2026-11-22T11:59:59Z" }, now)).toBe(false);
    expect(signatureTokenUsable({ status: "signed", expires_at: "2027-01-01T00:00:00Z" }, now)).toBe(false);
  });
  it("older WhatsApp 'sent' never overwrites 'read'", () => {
    expect(nextMessageStatus("read", "sent")).toBe("read");
    expect(nextMessageStatus("sent", "delivered")).toBe("delivered");
  });
  it("normalizes phone numbers to WhatsApp digits", () => {
    expect(normalizeWaNumber("+90 530 381 02 98")).toBe("905303810298");
    expect(normalizeWaNumber("0090-530-3810298")).toBe("905303810298");
    expect(normalizeWaNumber("123")).toBeNull();
  });
  it("csv escapes commas and quotes", () => {
    expect(toCsv([["a,b", 'say "hi"', null]])).toBe('"a,b","say ""hi""",');
  });
});
