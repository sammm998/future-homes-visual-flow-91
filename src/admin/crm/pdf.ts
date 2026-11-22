import { jsPDF } from "jspdf";
import { quoteTotals } from "./model";

const NAVY: [number, number, number] = [7, 24, 39];
const GOLD: [number, number, number] = [213, 183, 119];
const money = (n: number, c: string) => `${c} ${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function header(doc: jsPDF, title: string, no: string) {
  doc.setFillColor(...NAVY); doc.rect(0, 0, 210, 34, "F");
  doc.setTextColor(...GOLD); doc.setFontSize(9); doc.text("FUTURE HOMES INTERNATIONAL", 15, 13);
  doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.text(title, 15, 25);
  doc.setFontSize(10); doc.text(no, 195, 25, { align: "right" });
  doc.setTextColor(...NAVY);
}
function footer(doc: jsPDF) {
  doc.setFontSize(8); doc.setTextColor(120);
  doc.text("Future Homes International · info@futurehomesturkey.com · futurehomesinternational.com", 105, 287, { align: "center" });
}

export type QuotePdf = {
  quote_no: string; client_name: string; client_email: string | null; property_ref: string | null; unit_type: string | null;
  currency: string; discount_pct: number; payment_plan: string | null; notes: string | null; valid_until: string | null; created_at: string;
  items: { description: string; qty: number; unit_price: number }[];
};

export function quotePdf(q: QuotePdf) {
  const doc = new jsPDF();
  header(doc, "Quotation", q.quote_no);
  doc.setFontSize(10);
  let y = 46;
  doc.text(`Client: ${q.client_name}${q.client_email ? ` (${q.client_email})` : ""}`, 15, y);
  doc.text(`Date: ${q.created_at.slice(0, 10)}${q.valid_until ? `   Valid until: ${q.valid_until}` : ""}`, 15, (y += 6));
  if (q.property_ref) doc.text(`Property: REF ${q.property_ref}${q.unit_type ? ` · ${q.unit_type}` : ""}`, 15, (y += 6));
  y += 10;
  doc.setFillColor(245, 240, 228); doc.rect(15, y - 5, 180, 8, "F");
  doc.text("Description", 17, y); doc.text("Qty", 130, y); doc.text("Amount", 193, y, { align: "right" });
  for (const it of q.items) {
    y += 8;
    doc.text(doc.splitTextToSize(it.description || "-", 105), 17, y);
    doc.text(String(it.qty), 130, y);
    doc.text(money(it.qty * it.unit_price, q.currency), 193, y, { align: "right" });
  }
  const t = quoteTotals(q.items, q.discount_pct);
  y += 12; doc.line(120, y - 5, 195, y - 5);
  doc.text("Subtotal", 130, y); doc.text(money(t.subtotal, q.currency), 193, y, { align: "right" });
  if (t.discount) { y += 6; doc.text(`Discount ${q.discount_pct}%`, 130, y); doc.text(`- ${money(t.discount, q.currency)}`, 193, y, { align: "right" }); }
  y += 8; doc.setFontSize(13); doc.text("Total", 130, y); doc.text(money(t.total, q.currency), 193, y, { align: "right" }); doc.setFontSize(10);
  if (q.payment_plan) { y += 14; doc.setFontSize(11); doc.text("Payment plan", 15, y); doc.setFontSize(10); const l = doc.splitTextToSize(q.payment_plan, 180); doc.text(l, 15, (y += 6)); y += l.length * 5; }
  if (q.notes) { y += 8; const l = doc.splitTextToSize(q.notes, 180); doc.text(l, 15, y); }
  footer(doc);
  return doc;
}

export function invoicePdf(inv: { invoice_no: string; client_name: string; client_email: string | null; description: string | null; currency: string; amount: number; issue_date: string; due_date: string | null; notes: string | null }, paid: number) {
  const doc = new jsPDF();
  header(doc, "Invoice", inv.invoice_no);
  doc.setFontSize(10);
  doc.text(`Billed to: ${inv.client_name}${inv.client_email ? ` (${inv.client_email})` : ""}`, 15, 46);
  doc.text(`Issue date: ${inv.issue_date}${inv.due_date ? `   Due: ${inv.due_date}` : ""}`, 15, 52);
  doc.text(doc.splitTextToSize(inv.description || "Property services", 180), 15, 66);
  doc.setFontSize(12);
  doc.text("Amount", 130, 96); doc.text(money(inv.amount, inv.currency), 193, 96, { align: "right" });
  doc.text("Paid", 130, 104); doc.text(money(paid, inv.currency), 193, 104, { align: "right" });
  doc.setFontSize(14); doc.text("Balance", 130, 114); doc.text(money(Math.max(0, inv.amount - paid), inv.currency), 193, 114, { align: "right" });
  if (inv.notes) { doc.setFontSize(10); doc.text(doc.splitTextToSize(inv.notes, 180), 15, 130); }
  footer(doc);
  return doc;
}

export function signedPdf(r: { title: string; body: string; signed_name: string | null; signed_at: string | null; signature_png: string | null; signer_ip: string | null }) {
  const doc = new jsPDF();
  header(doc, "Signed agreement", r.signed_at?.slice(0, 10) ?? "");
  doc.setFontSize(13); doc.text(r.title, 15, 46); doc.setFontSize(10);
  const lines = doc.splitTextToSize(r.body, 180) as string[];
  let y = 56;
  for (const l of lines) { if (y > 230) { footer(doc); doc.addPage(); y = 20; } doc.text(l, 15, y); y += 5; }
  if (y > 230) { doc.addPage(); y = 20; }
  y += 10;
  if (r.signature_png) doc.addImage(r.signature_png, "PNG", 15, y, 70, 21);
  doc.text(`Signed by ${r.signed_name ?? ""} on ${r.signed_at ?? ""}${r.signer_ip ? ` · IP ${r.signer_ip}` : ""}`, 15, y + 28);
  footer(doc);
  return doc;
}

export const pdfBase64 = (doc: jsPDF) => doc.output("datauristring").split(",")[1] ?? "";
