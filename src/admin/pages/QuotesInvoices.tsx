import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Download, Send, Copy, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { quoteTotals, invoiceBalance, invoiceStatus } from "@/admin/crm/model";
import { quotePdf, invoicePdf, signedPdf, pdfBase64 } from "@/admin/crm/pdf";
import { sendCrmEmail } from "@/admin/crm/crm.functions";

type Deal = { id: string; title: string; client_name: string | null; client_email: string | null; property_ref: string | null; value_eur: number; lead_id: string | null };
type Item = { id?: string; description: string; qty: number; unit_price: number };
type Quote = { id: string; quote_no: string; deal_id: string | null; lead_id: string | null; client_name: string; client_email: string | null; property_ref: string | null; unit_type: string | null; currency: string; discount_pct: number; payment_plan: string | null; notes: string | null; valid_until: string | null; status: string; created_at: string; quote_items?: Item[] };
type Invoice = { id: string; invoice_no: string; deal_id: string | null; quote_id: string | null; client_name: string; client_email: string | null; description: string | null; currency: string; amount: number; issue_date: string; due_date: string | null; status: string; notes: string | null; invoice_payments?: { id: string; amount: number; paid_at: string; method: string | null }[] };
type Sig = { id: string; token: string; deal_id: string | null; quote_id: string | null; title: string; body: string; signer_name: string; signer_email: string | null; status: string; expires_at: string; signed_at: string | null; signed_name: string | null; signature_png: string | null; signer_ip: string | null; created_at: string };

const blankQuote = (): Omit<Quote, "id" | "quote_no" | "created_at" | "status"> & { items: Item[] } => ({
  deal_id: null, lead_id: null, client_name: "", client_email: "", property_ref: "", unit_type: "", currency: "EUR", discount_pct: 0,
  payment_plan: "30% on reservation\n40% during construction\n30% on handover", notes: "", valid_until: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
  items: [{ description: "Apartment purchase price", qty: 1, unit_price: 0 }],
});
const AGREEMENT = (name: string, ref: string, amount: string) => `RESERVATION AGREEMENT\n\nBetween Future Homes International ("the Agent") and ${name} ("the Buyer").\n\n1. The Buyer reserves property REF ${ref || "—"} at an agreed price of ${amount}.\n2. A reservation deposit is payable within 7 days of signing and is deducted from the purchase price.\n3. The property is removed from sale for 30 days while the sales contract is prepared.\n4. If the Buyer withdraws, the deposit is handled per the developer's terms communicated in writing.\n5. This agreement is governed by the laws of the country where the property is located.`;
const fmt = (n: number, c = "EUR") => `${c} ${Number(n).toLocaleString("en-GB", { maximumFractionDigits: 2 })}`;

export default function QuotesInvoices() {
  const { t } = useAdminT();
  const { me } = useAdminUsers();
  const sendMail = useServerFn(sendCrmEmail);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sigs, setSigs] = useState<Sig[]>([]);
  const [qEdit, setQEdit] = useState<(ReturnType<typeof blankQuote> & { id?: string }) | null>(null);
  const [iEdit, setIEdit] = useState<Partial<Invoice> | null>(null);
  const [sEdit, setSEdit] = useState<Partial<Sig> | null>(null);
  const [pay, setPay] = useState<{ invoice: Invoice; amount: string; method: string } | null>(null);

  const load = async () => {
    const [d, q, i, s] = await Promise.all([
      supabase.from("deals").select("id, title, client_name, client_email, property_ref, value_eur, lead_id").order("created_at", { ascending: false }).limit(500),
      supabase.from("quotes").select("*, quote_items(*)").order("created_at", { ascending: false }),
      supabase.from("invoices").select("*, invoice_payments(*)").order("created_at", { ascending: false }),
      supabase.from("signature_requests").select("*").order("created_at", { ascending: false }),
    ]);
    setDeals((d.data as Deal[]) ?? []); setQuotes((q.data as Quote[]) ?? []); setInvoices((i.data as Invoice[]) ?? []); setSigs((s.data as Sig[]) ?? []);
  };
  useEffect(() => {
    load().then(() => {
      const dealId = new URLSearchParams(window.location.search).get("deal");
      if (dealId) supabase.from("deals").select("*").eq("id", dealId).single().then(({ data }) => data && setQEdit({ ...blankQuote(), deal_id: data.id, lead_id: data.lead_id, client_name: data.client_name ?? "", client_email: data.client_email ?? "", property_ref: data.property_ref ?? "", items: [{ description: "Apartment purchase price", qty: 1, unit_price: Number(data.value_eur) || 0 }] }));
    });
  }, []);
  const dealTitle = (id: string | null) => deals.find((d) => d.id === id)?.title ?? "—";

  const pickDeal = (id: string) => {
    const d = deals.find((x) => x.id === id);
    if (!qEdit) return;
    setQEdit({ ...qEdit, deal_id: id || null, lead_id: d?.lead_id ?? null, client_name: d?.client_name ?? qEdit.client_name, client_email: d?.client_email ?? qEdit.client_email, property_ref: d?.property_ref ?? qEdit.property_ref });
  };

  const saveQuote = async () => {
    if (!qEdit || !qEdit.client_name.trim()) return toast.error(t("Client name is required"));
    const { items, id, quote_items: _qi, quote_no: _qn, created_at: _ca, ...row } = qEdit as typeof qEdit & Partial<Quote>;
    const payload = { ...row, client_email: row.client_email || null, valid_until: row.valid_until || null, created_by: me };
    const res = id ? await supabase.from("quotes").update(payload).eq("id", id).select("id").single() : await supabase.from("quotes").insert(payload).select("id").single();
    if (res.error) return toast.error(res.error.message);
    const qid = res.data.id;
    await supabase.from("quote_items").delete().eq("quote_id", qid);
    const ins = await supabase.from("quote_items").insert(items.map((it, position) => ({ quote_id: qid, description: it.description, qty: Number(it.qty) || 0, unit_price: Number(it.unit_price) || 0, position })));
    if (ins.error) return toast.error(ins.error.message);
    toast.success(t("Saved")); setQEdit(null); load();
  };
  const quoteDoc = (q: Quote) => quotePdf({ ...q, items: [...(q.quote_items ?? [])].sort((a: any, b: any) => a.position - b.position) });
  const emailQuote = async (q: Quote) => {
    if (!q.client_email) return toast.error(t("Client e-mail is missing"));
    try {
      await sendMail({ data: { to: q.client_email, subject: `Your quotation ${q.quote_no} — Future Homes International`, html: `<p>Dear ${q.client_name},</p><p>Please find your quotation ${q.quote_no} attached.</p><p>Kind regards,<br/>Future Homes International</p>`, attachment: { filename: `${q.quote_no}.pdf`, base64: pdfBase64(quoteDoc(q)) } } });
      await supabase.from("quotes").update({ status: "sent" }).eq("id", q.id); toast.success(t("Sent")); load();
    } catch (e) { toast.error(e instanceof Error ? e.message : String(e)); }
  };
  const toInvoice = (q: Quote) => setIEdit({ deal_id: q.deal_id, quote_id: q.id, client_name: q.client_name, client_email: q.client_email, currency: q.currency, amount: quoteTotals(q.quote_items ?? [], q.discount_pct).total, description: `Quotation ${q.quote_no}${q.property_ref ? ` · REF ${q.property_ref}` : ""}`, due_date: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), status: "draft" });
  const toSign = (q: Quote) => setSEdit({ deal_id: q.deal_id, quote_id: q.id, signer_name: q.client_name, signer_email: q.client_email, title: `Reservation agreement — REF ${q.property_ref ?? ""}`, body: AGREEMENT(q.client_name, q.property_ref ?? "", fmt(quoteTotals(q.quote_items ?? [], q.discount_pct).total, q.currency)) });

  const saveInvoice = async () => {
    if (!iEdit?.client_name) return toast.error(t("Client name is required"));
    const { id, invoice_payments, invoice_no, ...row } = iEdit as Invoice;
    const payload = { ...row, amount: Number(row.amount) || 0, client_email: row.client_email || null, due_date: row.due_date || null, created_by: me };
    const res = id ? await supabase.from("invoices").update(payload).eq("id", id) : await supabase.from("invoices").insert(payload);
    if (res.error) return toast.error(res.error.message);
    setIEdit(null); load();
  };
  const emailInvoice = async (inv: Invoice) => {
    if (!inv.client_email) return toast.error(t("Client e-mail is missing"));
    const paid = invoiceBalance(inv.amount, inv.invoice_payments ?? []).paid;
    try {
      await sendMail({ data: { to: inv.client_email, subject: `Invoice ${inv.invoice_no} — Future Homes International`, html: `<p>Dear ${inv.client_name},</p><p>Please find invoice ${inv.invoice_no} attached.</p><p>Kind regards,<br/>Future Homes International</p>`, attachment: { filename: `${inv.invoice_no}.pdf`, base64: pdfBase64(invoicePdf(inv, paid)) } } });
      if (inv.status === "draft") await supabase.from("invoices").update({ status: "sent" }).eq("id", inv.id);
      toast.success(t("Sent")); load();
    } catch (e) { toast.error(e instanceof Error ? e.message : String(e)); }
  };
  const addPayment = async () => {
    if (!pay) return;
    const amount = Number(pay.amount);
    if (!(amount > 0)) return toast.error(t("Enter an amount"));
    const { error } = await supabase.from("invoice_payments").insert({ invoice_id: pay.invoice.id, amount, method: pay.method || null });
    if (error) return toast.error(error.message);
    const all = [...(pay.invoice.invoice_payments ?? []), { amount }];
    await supabase.from("invoices").update({ status: invoiceStatus({ ...pay.invoice, status: "sent" }, all) }).eq("id", pay.invoice.id);
    setPay(null); load();
  };

  const signLink = (s: Sig) => `${window.location.origin}/sign/${s.token}`;
  const saveSig = async () => {
    if (!sEdit?.signer_name || !sEdit.title || !sEdit.body) return toast.error(t("Fill in all fields"));
    const { data, error } = await supabase.from("signature_requests").insert({ deal_id: sEdit.deal_id ?? null, quote_id: sEdit.quote_id ?? null, title: sEdit.title, body: sEdit.body, signer_name: sEdit.signer_name, signer_email: sEdit.signer_email || null, created_by: me }).select("*").single();
    if (error) return toast.error(error.message);
    setSEdit(null); await load();
    navigator.clipboard?.writeText(signLink(data as Sig)).catch(() => {});
    toast.success(t("Signing link copied"));
  };
  const emailSig = async (s: Sig) => {
    if (!s.signer_email) return toast.error(t("Client e-mail is missing"));
    try {
      await sendMail({ data: { to: s.signer_email, subject: `Please sign: ${s.title}`, html: `<p>Dear ${s.signer_name},</p><p>Please review and sign your agreement online:</p><p><a href="${signLink(s)}">${signLink(s)}</a></p><p>The link is valid until ${s.expires_at.slice(0, 10)}.</p><p>Kind regards,<br/>Future Homes International</p>` } });
      toast.success(t("Sent"));
    } catch (e) { toast.error(e instanceof Error ? e.message : String(e)); }
  };

  const statusBadge = (s: string) => <Badge variant={s === "paid" || s === "signed" || s === "accepted" ? "default" : s === "overdue" || s === "expired" ? "destructive" : "secondary"}>{t(s)}</Badge>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("Quotes & agreements")}</h1>
      <Tabs defaultValue="quotes">
        <TabsList><TabsTrigger value="quotes">{t("Quotes")}</TabsTrigger><TabsTrigger value="invoices">{t("Invoices")}</TabsTrigger><TabsTrigger value="sign">{t("E-signatures")}</TabsTrigger></TabsList>

        <TabsContent value="quotes" className="space-y-3">
          <Button onClick={() => setQEdit(blankQuote())}><Plus className="h-4 w-4 mr-1" />{t("New quote")}</Button>
          <Table><TableHeader><TableRow><TableHead>{t("Number")}</TableHead><TableHead>{t("Client")}</TableHead><TableHead>{t("Deal")}</TableHead><TableHead>REF</TableHead><TableHead className="text-right">{t("Total")}</TableHead><TableHead>{t("Status")}</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{quotes.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs">{q.quote_no}</TableCell><TableCell>{q.client_name}</TableCell><TableCell className="text-xs">{dealTitle(q.deal_id)}</TableCell><TableCell>{q.property_ref}</TableCell>
                <TableCell className="text-right">{fmt(quoteTotals(q.quote_items ?? [], q.discount_pct).total, q.currency)}</TableCell>
                <TableCell><select className="h-7 rounded border bg-background px-1 text-xs" value={q.status} onChange={async (e) => { await supabase.from("quotes").update({ status: e.target.value }).eq("id", q.id); load(); }}>{["draft", "sent", "accepted", "declined"].map((s) => <option key={s} value={s}>{t(s)}</option>)}</select></TableCell>
                <TableCell className="flex flex-wrap gap-1 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setQEdit({ ...q, client_email: q.client_email ?? "", property_ref: q.property_ref ?? "", unit_type: q.unit_type ?? "", payment_plan: q.payment_plan ?? "", notes: q.notes ?? "", items: [...(q.quote_items ?? [])].sort((a: any, b: any) => a.position - b.position) })}>{t("Edit")}</Button>
                  <Button size="icon" variant="ghost" title="PDF" onClick={() => quoteDoc(q).save(`${q.quote_no}.pdf`)}><Download className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" title={t("E-mail")} onClick={() => emailQuote(q)}><Send className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => toInvoice(q)}>{t("Invoice")}</Button>
                  <Button size="icon" variant="ghost" title={t("Send for signature")} onClick={() => toSign(q)}><FileSignature className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>))}
              {!quotes.length && <TableRow><TableCell colSpan={7} className="text-muted-foreground">{t("No quotes yet")}</TableCell></TableRow>}
            </TableBody></Table>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-3">
          <Button onClick={() => setIEdit({ client_name: "", currency: "EUR", amount: 0, status: "draft" })}><Plus className="h-4 w-4 mr-1" />{t("New invoice")}</Button>
          <Table><TableHeader><TableRow><TableHead>{t("Number")}</TableHead><TableHead>{t("Client")}</TableHead><TableHead>{t("Due")}</TableHead><TableHead className="text-right">{t("Amount")}</TableHead><TableHead className="text-right">{t("Balance")}</TableHead><TableHead>{t("Status")}</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{invoices.map((inv) => { const b = invoiceBalance(inv.amount, inv.invoice_payments ?? []); return (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs">{inv.invoice_no}</TableCell><TableCell>{inv.client_name}</TableCell><TableCell>{inv.due_date ?? "—"}</TableCell>
                <TableCell className="text-right">{fmt(inv.amount, inv.currency)}</TableCell><TableCell className="text-right">{fmt(b.balance, inv.currency)}</TableCell>
                <TableCell>{statusBadge(invoiceStatus(inv, inv.invoice_payments ?? []))}</TableCell>
                <TableCell className="flex gap-1 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setIEdit(inv)}>{t("Edit")}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setPay({ invoice: inv, amount: String(b.balance), method: "Bank transfer" })}>{t("Add payment")}</Button>
                  <Button size="icon" variant="ghost" onClick={() => invoicePdf(inv, b.paid).save(`${inv.invoice_no}.pdf`)}><Download className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => emailInvoice(inv)}><Send className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>); })}
              {!invoices.length && <TableRow><TableCell colSpan={7} className="text-muted-foreground">{t("No invoices yet")}</TableCell></TableRow>}
            </TableBody></Table>
        </TabsContent>

        <TabsContent value="sign" className="space-y-3">
          <Button onClick={() => setSEdit({ title: "Reservation agreement", body: AGREEMENT("", "", ""), signer_name: "" })}><Plus className="h-4 w-4 mr-1" />{t("New signature request")}</Button>
          <Table><TableHeader><TableRow><TableHead>{t("Agreement")}</TableHead><TableHead>{t("Signer")}</TableHead><TableHead>{t("Status")}</TableHead><TableHead>{t("Expires")}</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{sigs.map((s) => { const st = s.status === "pending" && new Date(s.expires_at) < new Date() ? "expired" : s.status; return (
              <TableRow key={s.id}>
                <TableCell>{s.title}</TableCell><TableCell>{s.signer_name}</TableCell><TableCell>{statusBadge(st)}{s.signed_at && <span className="ml-2 text-xs text-muted-foreground">{s.signed_at.slice(0, 16).replace("T", " ")}</span>}</TableCell><TableCell>{s.expires_at.slice(0, 10)}</TableCell>
                <TableCell className="flex gap-1 justify-end">
                  {st === "pending" && <><Button size="icon" variant="ghost" title={t("Copy link")} onClick={() => { navigator.clipboard?.writeText(signLink(s)); toast.success(t("Signing link copied")); }}><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" title={t("E-mail")} onClick={() => emailSig(s)}><Send className="h-4 w-4" /></Button></>}
                  {st === "signed" && <Button size="sm" variant="ghost" onClick={() => signedPdf(s).save(`signed-${s.signer_name.replace(/\W+/g, "-")}.pdf`)}><Download className="h-4 w-4 mr-1" />PDF</Button>}
                </TableCell>
              </TableRow>); })}
              {!sigs.length && <TableRow><TableCell colSpan={5} className="text-muted-foreground">{t("No signature requests yet")}</TableCell></TableRow>}
            </TableBody></Table>
          <p className="text-xs text-muted-foreground">{t("Simple electronic signature: name, drawn signature, time and IP address are recorded. Not BankID.")}</p>
        </TabsContent>
      </Tabs>

      <Dialog open={!!qEdit} onOpenChange={(o) => !o && setQEdit(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{qEdit?.id ? t("Edit quote") : t("New quote")}</DialogTitle></DialogHeader>
          {qEdit && (
            <div className="grid gap-3">
              <Label>{t("Deal")}<select className="mt-1 h-9 w-full rounded border bg-background px-2" value={qEdit.deal_id ?? ""} onChange={(e) => pickDeal(e.target.value)}><option value="">—</option>{deals.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}</select></Label>
              <div className="grid grid-cols-2 gap-3">
                <Label>{t("Client")}<Input className="mt-1" value={qEdit.client_name} onChange={(e) => setQEdit({ ...qEdit, client_name: e.target.value })} /></Label>
                <Label>{t("E-mail")}<Input className="mt-1" value={qEdit.client_email ?? ""} onChange={(e) => setQEdit({ ...qEdit, client_email: e.target.value })} /></Label>
                <Label>REF<Input className="mt-1" value={qEdit.property_ref ?? ""} onChange={(e) => setQEdit({ ...qEdit, property_ref: e.target.value })} /></Label>
                <Label>{t("Apartment type")}<Input className="mt-1" placeholder="2+1" value={qEdit.unit_type ?? ""} onChange={(e) => setQEdit({ ...qEdit, unit_type: e.target.value })} /></Label>
                <Label>{t("Currency")}<select className="mt-1 h-9 w-full rounded border bg-background px-2" value={qEdit.currency} onChange={(e) => setQEdit({ ...qEdit, currency: e.target.value })}>{["EUR", "USD", "GBP", "AED", "TRY"].map((c) => <option key={c}>{c}</option>)}</select></Label>
                <Label>{t("Valid until")}<Input className="mt-1" type="date" value={qEdit.valid_until ?? ""} onChange={(e) => setQEdit({ ...qEdit, valid_until: e.target.value })} /></Label>
              </div>
              <div className="space-y-2">
                <Label>{t("Lines")}</Label>
                {qEdit.items.map((it, i) => (
                  <div key={i} className="grid grid-cols-[1fr_70px_130px_36px] gap-2">
                    <Input value={it.description} onChange={(e) => setQEdit({ ...qEdit, items: qEdit.items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })} />
                    <Input type="number" value={it.qty} onChange={(e) => setQEdit({ ...qEdit, items: qEdit.items.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value) } : x)) })} />
                    <Input type="number" value={it.unit_price} onChange={(e) => setQEdit({ ...qEdit, items: qEdit.items.map((x, j) => (j === i ? { ...x, unit_price: Number(e.target.value) } : x)) })} />
                    <Button size="icon" variant="ghost" onClick={() => setQEdit({ ...qEdit, items: qEdit.items.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setQEdit({ ...qEdit, items: [...qEdit.items, { description: "", qty: 1, unit_price: 0 }] })}><Plus className="h-4 w-4 mr-1" />{t("Add line")}</Button>
              </div>
              <Label>{t("Discount %")}<Input className="mt-1 w-32" type="number" value={qEdit.discount_pct} onChange={(e) => setQEdit({ ...qEdit, discount_pct: Number(e.target.value) })} /></Label>
              {(() => { const tt = quoteTotals(qEdit.items, qEdit.discount_pct); return <div className="text-right text-sm">{t("Subtotal")} {fmt(tt.subtotal, qEdit.currency)} · {t("Discount")} {fmt(tt.discount, qEdit.currency)} · <b>{t("Total")} {fmt(tt.total, qEdit.currency)}</b></div>; })()}
              <Label>{t("Payment plan")}<Textarea className="mt-1" rows={3} value={qEdit.payment_plan ?? ""} onChange={(e) => setQEdit({ ...qEdit, payment_plan: e.target.value })} /></Label>
              <Label>{t("Notes")}<Textarea className="mt-1" rows={2} value={qEdit.notes ?? ""} onChange={(e) => setQEdit({ ...qEdit, notes: e.target.value })} /></Label>
              <Button onClick={saveQuote}>{t("Save")}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!iEdit} onOpenChange={(o) => !o && setIEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{iEdit?.id ? `${t("Invoice")} ${iEdit.invoice_no}` : t("New invoice")}</DialogTitle></DialogHeader>
          {iEdit && (
            <div className="grid gap-3">
              <Label>{t("Deal")}<select className="mt-1 h-9 w-full rounded border bg-background px-2" value={iEdit.deal_id ?? ""} onChange={(e) => { const d = deals.find((x) => x.id === e.target.value); setIEdit({ ...iEdit, deal_id: e.target.value || null, client_name: d?.client_name ?? iEdit.client_name, client_email: d?.client_email ?? iEdit.client_email }); }}><option value="">—</option>{deals.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}</select></Label>
              <div className="grid grid-cols-2 gap-3">
                <Label>{t("Client")}<Input className="mt-1" value={iEdit.client_name ?? ""} onChange={(e) => setIEdit({ ...iEdit, client_name: e.target.value })} /></Label>
                <Label>{t("E-mail")}<Input className="mt-1" value={iEdit.client_email ?? ""} onChange={(e) => setIEdit({ ...iEdit, client_email: e.target.value })} /></Label>
                <Label>{t("Amount")}<Input className="mt-1" type="number" value={iEdit.amount ?? 0} onChange={(e) => setIEdit({ ...iEdit, amount: Number(e.target.value) })} /></Label>
                <Label>{t("Currency")}<select className="mt-1 h-9 w-full rounded border bg-background px-2" value={iEdit.currency ?? "EUR"} onChange={(e) => setIEdit({ ...iEdit, currency: e.target.value })}>{["EUR", "USD", "GBP", "AED", "TRY"].map((c) => <option key={c}>{c}</option>)}</select></Label>
                <Label>{t("Due")}<Input className="mt-1" type="date" value={iEdit.due_date ?? ""} onChange={(e) => setIEdit({ ...iEdit, due_date: e.target.value })} /></Label>
                <Label>{t("Status")}<select className="mt-1 h-9 w-full rounded border bg-background px-2" value={iEdit.status ?? "draft"} onChange={(e) => setIEdit({ ...iEdit, status: e.target.value })}>{["draft", "sent"].map((s) => <option key={s} value={s}>{t(s)}</option>)}</select></Label>
              </div>
              <Label>{t("Description")}<Textarea className="mt-1" value={iEdit.description ?? ""} onChange={(e) => setIEdit({ ...iEdit, description: e.target.value })} /></Label>
              <Label>{t("Notes")}<Textarea className="mt-1" value={iEdit.notes ?? ""} onChange={(e) => setIEdit({ ...iEdit, notes: e.target.value })} /></Label>
              <Button onClick={saveInvoice}>{t("Save")}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!pay} onOpenChange={(o) => !o && setPay(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Add payment")}</DialogTitle></DialogHeader>
          {pay && <div className="grid gap-3">
            <Label>{t("Amount")}<Input className="mt-1" type="number" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} /></Label>
            <Label>{t("Method")}<Input className="mt-1" value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })} /></Label>
            {(pay.invoice.invoice_payments ?? []).map((p) => <div key={p.id} className="text-xs text-muted-foreground">{p.paid_at} · {fmt(p.amount, pay.invoice.currency)} · {p.method}</div>)}
            <Button onClick={addPayment}>{t("Save")}</Button>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!sEdit} onOpenChange={(o) => !o && setSEdit(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{t("New signature request")}</DialogTitle></DialogHeader>
          {sEdit && <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Label>{t("Signer")}<Input className="mt-1" value={sEdit.signer_name ?? ""} onChange={(e) => setSEdit({ ...sEdit, signer_name: e.target.value })} /></Label>
              <Label>{t("E-mail")}<Input className="mt-1" value={sEdit.signer_email ?? ""} onChange={(e) => setSEdit({ ...sEdit, signer_email: e.target.value })} /></Label>
            </div>
            <Label>{t("Title")}<Input className="mt-1" value={sEdit.title ?? ""} onChange={(e) => setSEdit({ ...sEdit, title: e.target.value })} /></Label>
            <Label>{t("Agreement text")}<Textarea className="mt-1" rows={12} value={sEdit.body ?? ""} onChange={(e) => setSEdit({ ...sEdit, body: e.target.value })} /></Label>
            <Button onClick={saveSig}>{t("Create signing link")}</Button>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
