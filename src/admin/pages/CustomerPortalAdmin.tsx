import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STAGES = ["viewing", "reservation", "contract", "payment", "handover", "aftersales"];
const KINDS = [["document", "documents", "filename"], ["quote", "quotes", "quote_no"], ["invoice", "invoices", "invoice_no"], ["signature", "signature_requests", "title"]] as const;
const sel = "h-9 rounded-md border border-input bg-background px-2 text-sm";

export default function CustomerPortalAdmin() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const load = async () => {
    const [{ data: c }, { data: t }] = await Promise.all([
      supabase.from("customer_accounts").select("*").order("last_seen_at", { ascending: false }),
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setCustomers(c ?? []); setTickets(t ?? []);
  };
  useEffect(() => { load(); }, []);
  const emailOf = (uid: string) => customers.find((c) => c.user_id === uid)?.email ?? uid.slice(0, 8);

  return (
    <div className="space-y-6 p-6">
      <div><h1 className="text-2xl font-semibold">Customer portal</h1><p className="text-sm text-muted-foreground">Customers, requests, messages and shared documents. Customers sign in at /portal.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Customers ({customers.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {customers.map((c) => (
              <button key={c.user_id} onClick={() => setActive(c)} className={cn("flex w-full items-center justify-between gap-2 rounded-md border border-border p-3 text-left text-sm", active?.user_id === c.user_id && "border-primary")}>
                <div className="min-w-0"><p className="truncate font-medium">{c.full_name || c.email}</p><p className="text-xs text-muted-foreground">{c.email} · {c.lead_id ? "linked to CRM" : "no CRM lead"} · last seen {c.last_seen_at ? new Date(c.last_seen_at).toLocaleDateString() : "—"}</p></div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">{c.stage}</span>
              </button>
            ))}
            {!customers.length && <p className="text-sm text-muted-foreground">No portal customers yet.</p>}
          </CardContent>
        </Card>
        {active ? <CustomerPanel key={active.user_id} c={active} onChange={load} /> : (
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Requests</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {tickets.map((t) => <TicketRow key={t.id} t={t} who={emailOf(t.user_id)} onChange={load} />)}
              {!tickets.length && <p className="text-sm text-muted-foreground">No requests yet.</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TicketRow({ t, who, onChange }: { t: any; who: string; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState("");
  const loadMsgs = () => supabase.from("ticket_messages").select("*").eq("ticket_id", t.id).order("created_at").then(({ data }) => setMsgs(data ?? []));
  useEffect(() => { if (open) loadMsgs(); }, [open]);
  return (
    <div className="rounded-md border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button className="min-w-0 text-left" onClick={() => setOpen(!open)}><p className="font-medium">{t.subject}</p><p className="text-xs text-muted-foreground">{who} · {t.category}{t.property_ref ? ` · REF ${t.property_ref}` : ""}{t.preferred_at ? ` · wants ${new Date(t.preferred_at).toLocaleString()}` : ""}</p></button>
        <select className={sel} value={t.status} onChange={async (e) => { await supabase.from("support_tickets").update({ status: e.target.value, updated_at: new Date().toISOString() }).eq("id", t.id); onChange(); }}>
          {["open", "in_progress", "resolved"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {open && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {msgs.map((m) => <p key={m.id} className={cn("rounded-md p-2", m.from_staff ? "bg-primary/10" : "bg-muted")}><b>{m.from_staff ? "Team" : "Customer"}:</b> {m.body}</p>)}
          <div className="flex gap-2"><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply to customer" />
            <Button size="sm" onClick={async () => { const { data: u } = await supabase.auth.getUser(); if (!text.trim() || !u.user) return; await supabase.from("ticket_messages").insert({ ticket_id: t.id, author_id: u.user.id, body: text.trim() }); setText(""); loadMsgs(); }}>Send</Button></div>
        </div>
      )}
    </div>
  );
}

function CustomerPanel({ c, onChange }: { c: any; onChange: () => void }) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [shared, setShared] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number][0]>("document");
  const [options, setOptions] = useState<any[]>([]);
  const [item, setItem] = useState("");
  const load = async () => {
    const [m, t, s] = await Promise.all([
      supabase.from("portal_messages").select("*").eq("customer_id", c.user_id).order("created_at"),
      supabase.from("support_tickets").select("*").eq("user_id", c.user_id).order("created_at", { ascending: false }),
      supabase.from("shared_items").select("*").eq("user_id", c.user_id).order("created_at", { ascending: false }),
    ]);
    setMsgs(m.data ?? []); setTickets(t.data ?? []); setShared(s.data ?? []);
  };
  useEffect(() => { load(); }, [c.user_id]);
  useEffect(() => {
    const k = KINDS.find((x) => x[0] === kind)!;
    (supabase.from(k[1] as any) as any).select(`id, ${k[2]}`).order("created_at", { ascending: false }).limit(100).then(({ data }: any) => { setOptions(data ?? []); setItem(""); });
  }, [kind]);
  const label = (o: any) => o[KINDS.find((x) => x[0] === kind)![2]] ?? o.id;
  return (
    <div className="space-y-4">
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">{c.full_name || c.email}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{c.email} · {c.phone || "no phone"} · budget {c.budget || "—"} · language {c.preferred_language}</p>
          {c.wishes && <p>{c.wishes}</p>}
          <div className="flex items-center gap-2"><span>Purchase stage</span>
            <select className={sel} value={c.stage} onChange={async (e) => { const { error } = await supabase.from("customer_accounts").update({ stage: e.target.value }).eq("user_id", c.user_id); if (error) toast.error(error.message); else { toast.success("Stage updated"); onChange(); } }}>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select></div>
        </CardContent>
      </Card>
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Messages</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="max-h-72 space-y-2 overflow-y-auto">{msgs.map((m) => <p key={m.id} className={cn("rounded-md p-2", m.from_staff ? "bg-primary/10" : "bg-muted")}><b>{m.from_staff ? "Team" : "Customer"}:</b> {m.body}</p>)}</div>
          <div className="flex gap-2"><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message the customer" />
            <Button size="sm" onClick={async () => { const { data: u } = await supabase.auth.getUser(); if (!text.trim() || !u.user) return; const { error } = await supabase.from("portal_messages").insert({ customer_id: c.user_id, author_id: u.user.id, body: text.trim() }); if (error) toast.error(error.message); setText(""); load(); }}>Send</Button></div>
        </CardContent>
      </Card>
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Shared with customer</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <select className={sel} value={kind} onChange={(e) => setKind(e.target.value as any)}>{KINDS.map((k) => <option key={k[0]} value={k[0]}>{k[0]}</option>)}</select>
            <select className={cn(sel, "min-w-48 flex-1")} value={item} onChange={(e) => setItem(e.target.value)}><option value="">Choose…</option>{options.map((o) => <option key={o.id} value={o.id}>{label(o)}</option>)}</select>
            <Button size="sm" disabled={!item} onClick={async () => { const { data: u } = await supabase.auth.getUser(); const o = options.find((x) => x.id === item); const { error } = await supabase.from("shared_items").insert({ user_id: c.user_id, kind, item_id: item, title: o ? String(label(o)) : null, created_by: u.user?.id }); if (error) toast.error(error.message); else { toast.success("Shared"); load(); } }}>Share</Button>
          </div>
          {shared.map((s) => <div key={s.id} className="flex items-center justify-between rounded-md border border-border p-2"><span>{s.kind} · {s.title}</span><Button size="sm" variant="ghost" onClick={async () => { await supabase.from("shared_items").delete().eq("id", s.id); load(); }}>Unshare</Button></div>)}
        </CardContent>
      </Card>
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Requests</CardTitle></CardHeader>
        <CardContent className="space-y-2">{tickets.map((t) => <TicketRow key={t.id} t={t} who={c.email} onChange={load} />)}{!tickets.length && <p className="text-sm text-muted-foreground">None.</p>}</CardContent>
      </Card>
    </div>
  );
}
