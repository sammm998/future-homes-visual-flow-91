// Pure CRM rules shared by admin pages, server routes and tests.
export type QuoteItem = { qty: number; unit_price: number };

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function quoteTotals(items: QuoteItem[], discountPct: number) {
  const subtotal = round2(items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0));
  const pct = Math.min(100, Math.max(0, Number(discountPct) || 0));
  const discount = round2((subtotal * pct) / 100);
  return { subtotal, discount, total: round2(subtotal - discount) };
}

export type InvoiceState = "draft" | "sent" | "partial" | "paid" | "overdue";

export function invoiceBalance(amount: number, payments: { amount: number }[]) {
  const paid = round2(payments.reduce((s, p) => s + (Number(p.amount) || 0), 0));
  return { paid, balance: round2(Math.max(0, amount - paid)) };
}

/** Derived status: paid/partial come from payments; overdue when unpaid after due date. */
export function invoiceStatus(
  inv: { status: string; amount: number; due_date: string | null },
  payments: { amount: number }[],
  today = new Date().toISOString().slice(0, 10),
): InvoiceState {
  const { paid, balance } = invoiceBalance(inv.amount, payments);
  if (inv.amount > 0 && balance === 0) return "paid";
  if (inv.status === "draft" && paid === 0) return "draft";
  if (inv.due_date && inv.due_date < today) return "overdue";
  return paid > 0 ? "partial" : "sent";
}

/** Probability that an open deal in a stage closes (used for weighted forecast). */
export const STAGE_WEIGHTS: Record<string, number> = {
  new: 0.05, contacted: 0.1, viewing: 0.25, negotiation: 0.5, reservation: 0.8, won: 1, lost: 0,
};

export function forecast(deals: { stage: string; value_eur: number }[]) {
  let weighted = 0, open = 0, won = 0;
  for (const d of deals) {
    const v = Number(d.value_eur) || 0;
    if (d.stage === "won") won += v;
    else if (d.stage !== "lost") { open += v; weighted += v * (STAGE_WEIGHTS[d.stage] ?? 0); }
  }
  return { open: round2(open), weighted: round2(weighted), won: round2(won) };
}

/** Share of deals that reached each stage (or later), in pipeline order. */
export function stageConversion(order: string[], reached: Map<string, Set<string>>, totalDeals: number) {
  return order.map((stage) => {
    const n = reached.get(stage)?.size ?? 0;
    return { stage, count: n, rate: totalDeals ? round2((n / totalDeals) * 100) : 0 };
  });
}

export function signatureTokenUsable(req: { status: string; expires_at: string }, now = new Date()) {
  if (req.status !== "pending") return false;
  return new Date(req.expires_at).getTime() > now.getTime();
}

/** E.164 digits only, no "+", as WhatsApp expects. Returns null when not plausible. */
export function normalizeWaNumber(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  d = d.replace(/^\+/, "");
  return /^\d{8,15}$/.test(d) ? d : null;
}

const STATUS_RANK: Record<string, number> = { accepted: 0, sent: 1, delivered: 2, read: 3, failed: 4 };
/** An older "sent" must never overwrite "delivered"/"read"; "failed" always wins. */
export function nextMessageStatus(current: string, incoming: string) {
  return (STATUS_RANK[incoming] ?? -1) > (STATUS_RANK[current] ?? -1) ? incoming : current;
}

export function median(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

export function toCsv(rows: (string | number | null)[][]) {
  return rows.map((r) => r.map((c) => {
    const v = c == null ? "" : String(c);
    return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(",")).join("\n");
}
