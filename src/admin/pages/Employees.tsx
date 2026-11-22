import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";

type Dept = { id: string; name: string; office: string | null };
type Prof = { user_id: string; full_name: string | null; title: string | null; department_id: string | null; office: string | null; phone: string | null; manager_id: string | null; scope: string; languages: string[] };
const OFFICES = ["Antalya", "Dubai", "Strasbourg", "Bali"];

export default function Employees() {
  const { users, label } = useAdminUsers();
  const [depts, setDepts] = useState<Dept[]>([]);
  const [profs, setProfs] = useState<Record<string, Prof>>({});
  const [away, setAway] = useState<Set<string>>(new Set());
  const [working, setWorking] = useState<Set<string>>(new Set());
  const [newDept, setNewDept] = useState({ name: "", office: "Antalya" });
  const [edit, setEdit] = useState<Prof | null>(null);
  const load = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const [d, p, a, t] = await Promise.all([
      supabase.from("departments").select("id,name,office").order("name"),
      supabase.from("employee_profiles").select("*"),
      supabase.from("absences").select("user_id").eq("status", "approved").lte("starts_on", today).gte("ends_on", today),
      supabase.from("time_entries").select("user_id").is("ended_at", null),
    ]);
    setDepts((d.data ?? []) as Dept[]);
    setProfs(Object.fromEntries(((p.data ?? []) as Prof[]).map((x) => [x.user_id, x])));
    setAway(new Set((a.data ?? []).map((x: any) => x.user_id)));
    setWorking(new Set((t.data ?? []).map((x: any) => x.user_id)));
  }, []);
  useEffect(() => { void load(); }, [load]);
  const blank = (id: string): Prof => ({ user_id: id, full_name: "", title: "", department_id: null, office: null, phone: "", manager_id: null, scope: "all", languages: [] });
  const save = async () => {
    if (!edit) return;
    const r = await supabase.from("employee_profiles").upsert({ ...edit, updated_at: new Date().toISOString() });
    if (r.error) return toast.error(r.error.message);
    toast.success("Saved"); setEdit(null); void load();
  };
  const addDept = async () => {
    if (!newDept.name.trim()) return;
    const r = await supabase.from("departments").insert(newDept);
    if (r.error) return toast.error(r.error.message);
    setNewDept({ name: "", office: "Antalya" }); void load();
  };
  const status = (id: string) => (away.has(id) ? <Badge variant="secondary">Away</Badge> : working.has(id) ? <Badge>At work</Badge> : <Badge variant="outline">Offline</Badge>);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Employees</h1><p className="text-sm text-muted-foreground">Team directory, departments and what each person may see.</p></div>
      <Card><CardContent className="flex flex-wrap items-end gap-2 p-4">
        <div className="text-sm font-medium w-full">Departments: {depts.map((d) => <Badge key={d.id} variant="outline" className="mr-1">{d.name}{d.office ? ` · ${d.office}` : ""}</Badge>)}</div>
        <Input className="max-w-xs" placeholder="New department" aria-label="New department" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} />
        <select aria-label="Department office" className="h-10 rounded-md border bg-background px-2 text-sm" value={newDept.office} onChange={(e) => setNewDept({ ...newDept, office: e.target.value })}>{OFFICES.map((o) => <option key={o}>{o}</option>)}</select>
        <Button variant="outline" className="gap-2" onClick={addDept}><Plus className="h-4 w-4" />Add department</Button>
      </CardContent></Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((u) => { const p = profs[u.id]; return (
          <Card key={u.id}><CardContent className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2"><div><div className="font-semibold">{p?.full_name || label(u.id)}</div><div className="text-xs text-muted-foreground">{p?.title || "—"} · {depts.find((d) => d.id === p?.department_id)?.name ?? "No department"} · {p?.office ?? "—"}</div></div>{status(u.id)}</div>
            <div className="text-xs text-muted-foreground">{u.email}</div>
            {p?.phone && <a className="inline-flex items-center gap-1 text-sm underline" href={`tel:${p.phone}`}><Phone className="h-3 w-3" />{p.phone}</a>}
            <div className="text-xs">Manager: {p?.manager_id ? label(p.manager_id) : "—"} · Sees: {p?.scope === "own" ? "only own leads & deals" : "everything"}</div>
            <Button size="sm" variant="outline" onClick={() => setEdit(p ?? blank(u.id))} aria-label={`Edit ${u.email}`}>Edit</Button>
          </CardContent></Card>); })}
      </div>
      {edit && <Card><CardContent className="grid gap-2 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2 font-medium">Edit {label(edit.user_id)}</div>
        <Input aria-label="Full name" placeholder="Full name" value={edit.full_name ?? ""} onChange={(e) => setEdit({ ...edit, full_name: e.target.value })} />
        <Input aria-label="Job title" placeholder="Job title" value={edit.title ?? ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
        <Input aria-label="Phone" placeholder="Phone" value={edit.phone ?? ""} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
        <select aria-label="Office" className="h-10 rounded-md border bg-background px-2 text-sm" value={edit.office ?? ""} onChange={(e) => setEdit({ ...edit, office: e.target.value || null })}><option value="">Office…</option>{OFFICES.map((o) => <option key={o}>{o}</option>)}</select>
        <select aria-label="Department" className="h-10 rounded-md border bg-background px-2 text-sm" value={edit.department_id ?? ""} onChange={(e) => setEdit({ ...edit, department_id: e.target.value || null })}><option value="">Department…</option>{depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <select aria-label="Manager" className="h-10 rounded-md border bg-background px-2 text-sm" value={edit.manager_id ?? ""} onChange={(e) => setEdit({ ...edit, manager_id: e.target.value || null })}><option value="">Manager…</option>{users.filter((u) => u.id !== edit.user_id).map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}</select>
        <select aria-label="Access" className="h-10 rounded-md border bg-background px-2 text-sm" value={edit.scope} onChange={(e) => setEdit({ ...edit, scope: e.target.value })}><option value="all">Sees all leads & deals</option><option value="own">Sees only own leads & deals</option></select>
        <Input aria-label="Languages" placeholder="Languages (comma separated)" value={edit.languages.join(", ")} onChange={(e) => setEdit({ ...edit, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <div className="flex gap-2 sm:col-span-2"><Button className="gap-2" onClick={save}><Save className="h-4 w-4" />Save</Button><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div>
      </CardContent></Card>}
    </div>
  );
}
