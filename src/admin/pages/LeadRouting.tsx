import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";

type Rule = { id: string; name: string; match_country: string | null; match_source: string | null; match_language: string | null; assignees: string[]; priority: number; active: boolean };
const blank = { name: "", match_country: "", match_source: "", match_language: "", assignees: [] as string[], priority: 100 };

export default function LeadRouting() {
  const { users, label } = useAdminUsers();
  const [rules, setRules] = useState<Rule[]>([]);
  const [form, setForm] = useState(blank);
  const [stats, setStats] = useState<{ label: string; avg: number; n: number }[]>([]);
  const load = useCallback(async () => {
    const [r, l] = await Promise.all([
      supabase.from("lead_routing_rules").select("*").order("priority"),
      supabase.from("leads").select("assigned_to,created_at,first_response_at").not("first_response_at", "is", null).gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()),
    ]);
    setRules((r.data ?? []) as Rule[]);
    const by = new Map<string, number[]>();
    for (const x of (l.data ?? []) as any[]) { const k = x.assigned_to ?? ""; by.set(k, [...(by.get(k) ?? []), (new Date(x.first_response_at).getTime() - new Date(x.created_at).getTime()) / 6e4]); }
    setStats([...by.entries()].map(([k, v]) => ({ label: k, avg: Math.round(v.reduce((a, b) => a + b, 0) / v.length), n: v.length })));
  }, []);
  useEffect(() => { void load(); }, [load]);
  const add = async () => {
    if (!form.name.trim() || !form.assignees.length) return toast.error("Name and at least one salesperson are required");
    const r = await supabase.from("lead_routing_rules").insert({ ...form, match_country: form.match_country || null, match_source: form.match_source || null, match_language: form.match_language || null });
    if (r.error) return toast.error(r.error.message);
    setForm(blank); toast.success("Rule added"); void load();
  };
  const toggle = async (r: Rule) => { await supabase.from("lead_routing_rules").update({ active: !r.active }).eq("id", r.id); void load(); };
  const del = async (r: Rule) => { await supabase.from("lead_routing_rules").delete().eq("id", r.id); void load(); };
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Lead distribution</h1><p className="text-sm text-muted-foreground">New leads without a salesperson are handed out automatically, in turn, by the first matching rule.</p></div>
      <Card><CardContent className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input aria-label="Rule name" placeholder="Rule name (e.g. Dubai buyers)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input aria-label="Country" placeholder="Country (empty = any)" value={form.match_country} onChange={(e) => setForm({ ...form, match_country: e.target.value })} />
        <Input aria-label="Source" placeholder="Source, e.g. website (empty = any)" value={form.match_source} onChange={(e) => setForm({ ...form, match_source: e.target.value })} />
        <Input aria-label="Nationality" placeholder="Nationality (empty = any)" value={form.match_language} onChange={(e) => setForm({ ...form, match_language: e.target.value })} />
        <Input aria-label="Priority" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) || 100 })} />
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">{users.map((u) => <label key={u.id} className="flex items-center gap-1 rounded border px-2 py-1 text-sm"><input type="checkbox" aria-label={`Assign ${u.email}`} checked={form.assignees.includes(u.id)} onChange={(e) => setForm({ ...form, assignees: e.target.checked ? [...form.assignees, u.id] : form.assignees.filter((x) => x !== u.id) })} />{u.email}</label>)}</div>
        <Button className="w-fit gap-2" onClick={add}><Plus className="h-4 w-4" />Add rule</Button>
      </CardContent></Card>
      <div className="divide-y rounded-md border">{rules.map((r) => <div key={r.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
        <Switch checked={r.active} onCheckedChange={() => toggle(r)} aria-label={`Active ${r.name}`} />
        <div className="flex-1"><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">Country: {r.match_country || "any"} · Source: {r.match_source || "any"} · Nationality: {r.match_language || "any"} · Priority {r.priority}</div><div className="text-xs">In turn: {r.assignees.map(label).join(" → ")}</div></div>
        <Button size="icon" variant="ghost" aria-label={`Delete ${r.name}`} onClick={() => del(r)}><Trash2 className="h-4 w-4" /></Button></div>)}
        {!rules.length && <p className="p-6 text-center text-sm text-muted-foreground">No rules yet — new leads stay unassigned.</p>}</div>
      <Card><CardContent className="p-4"><div className="mb-2 font-medium">First response time (last 30 days)</div>
        {stats.length ? stats.map((s) => <div key={s.label} className="flex justify-between text-sm"><span>{label(s.label)}</span><span>{s.avg} min avg · {s.n} leads</span></div>) : <p className="text-sm text-muted-foreground">Measured when a lead's status first changes from "new".</p>}
      </CardContent></Card>
    </div>
  );
}
