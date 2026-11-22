import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { APPROVAL_DEAL_EUR, APPROVAL_DISCOUNT_PCT } from "@/admin/workspace/projectModel";

type A = { id: string; kind: string; title: string; details: string | null; amount_eur: number | null; requested_by: string | null; approver_id: string | null; status: string; created_at: string };

export default function Approvals() {
  const { users, name } = useAdminUsers();
  const [me, setMe] = useState<string | null>(null);
  const [rows, setRows] = useState<A[]>([]);
  const [form, setForm] = useState({ kind: "discount", title: "", details: "", amount_eur: "", approver_id: "" });
  const load = useCallback(async () => {
    const { data } = await supabase.from("approvals").select("id,kind,title,details,amount_eur,requested_by,approver_id,status,created_at").order("created_at", { ascending: false }).limit(100);
    setRows((data ?? []) as A[]);
  }, []);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); void load(); }, [load]);
  const submit = async () => {
    if (!form.title.trim() || !form.approver_id) return toast.error("Add a title and choose who approves");
    const r = await supabase.from("approvals").insert({ kind: form.kind, title: form.title, details: form.details || null, amount_eur: form.amount_eur ? Number(form.amount_eur) : null, approver_id: form.approver_id });
    if (r.error) return toast.error(r.error.message);
    setForm({ kind: "discount", title: "", details: "", amount_eur: "", approver_id: "" }); toast.success("Sent for approval"); void load();
  };
  const decide = async (id: string, status: string) => { const r = await supabase.from("approvals").update({ status, decided_at: new Date().toISOString() }).eq("id", id); if (r.error) toast.error(r.error.message); else void load(); };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Approvals</h1>
      <p className="text-sm text-muted-foreground">Discounts above {APPROVAL_DISCOUNT_PCT}% and deals above €{APPROVAL_DEAL_EUR.toLocaleString("en-GB")} should be approved by a manager.</p>
      <Card><CardHeader><CardTitle className="text-base">New request</CardTitle></CardHeader><CardContent className="grid gap-2 md:grid-cols-5">
        <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} aria-label="Type"><option value="discount">Discount</option><option value="contract">Contract</option><option value="expense">Expense</option><option value="other">Other</option></select>
        <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Title" />
        <Input placeholder="Amount €" type="number" value={form.amount_eur} onChange={(e) => setForm({ ...form, amount_eur: e.target.value })} aria-label="Amount" />
        <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.approver_id} onChange={(e) => setForm({ ...form, approver_id: e.target.value })} aria-label="Approver"><option value="">Approver…</option>{users.filter((u) => u.id !== me).map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}</select>
        <Button onClick={submit}>Send</Button>
        <Input className="md:col-span-5" placeholder="Details" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} aria-label="Details" />
      </CardContent></Card>
      <div className="space-y-2">{rows.map((r) => (
        <Card key={r.id}><CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm">
          <Badge variant="outline">{r.kind}</Badge><span className="font-medium">{r.title}</span>{r.amount_eur != null && <span>€{Number(r.amount_eur).toLocaleString("en-GB")}</span>}
          <span className="text-muted-foreground">{name(r.requested_by ?? "")} → {name(r.approver_id ?? "")}</span>
          <Badge className="ml-auto" variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge>
          {r.status === "pending" && r.approver_id === me && <><Button size="sm" onClick={() => decide(r.id, "approved")}>Approve</Button><Button size="sm" variant="outline" onClick={() => decide(r.id, "rejected")}>Reject</Button></>}
          {r.details && <p className="w-full text-xs text-muted-foreground">{r.details}</p>}
        </CardContent></Card>
      ))}</div>
    </div>
  );
}
