import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { findDuplicates } from "@/admin/workspace/projectModel";

type Company = { id: string; name: string; country: string | null; website: string | null; email: string | null; phone: string | null; notes: string | null };
const blank: Company = { id: "", name: "", country: "", website: "", email: "", phone: "", notes: "" };

export default function Companies() {
  const [rows, setRows] = useState<Company[]>([]);
  const [counts, setCounts] = useState<Record<string, { leads: number; deals: number }>>({});
  const [edit, setEdit] = useState<Company | null>(null);
  const [q, setQ] = useState("");
  const load = useCallback(async () => {
    const [c, l, d] = await Promise.all([
      supabase.from("companies").select("id,name,country,website,email,phone,notes").order("name"),
      supabase.from("leads").select("company_id").not("company_id", "is", null),
      supabase.from("deals").select("company_id").not("company_id", "is", null),
    ]);
    setRows((c.data ?? []) as Company[]);
    const m: Record<string, { leads: number; deals: number }> = {};
    for (const r of l.data ?? []) { const k = r.company_id!; (m[k] ??= { leads: 0, deals: 0 }).leads++; }
    for (const r of d.data ?? []) { const k = r.company_id!; (m[k] ??= { leads: 0, deals: 0 }).deals++; }
    setCounts(m);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const dups = useMemo(() => findDuplicates(rows), [rows]);
  const save = async () => {
    if (!edit?.name.trim()) return toast.error("Name is required");
    const { id, ...row } = edit;
    const clean = Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v || null])) as Omit<Company, "id">;
    const r = id ? await supabase.from("companies").update({ ...clean, name: edit.name }).eq("id", id) : await supabase.from("companies").insert({ ...clean, name: edit.name });
    if (r.error) return toast.error(r.error.message);
    setEdit(null); void load();
  };
  const merge = async (group: Company[]) => {
    const [keep, ...rest] = group; if (!keep) return;
    for (const r of rest) {
      const a = await supabase.from("leads").update({ company_id: keep.id }).eq("company_id", r.id);
      const b = await supabase.from("deals").update({ company_id: keep.id }).eq("company_id", r.id);
      if (a.error || b.error) return toast.error((a.error ?? b.error)!.message);
      await supabase.from("companies").delete().eq("id", r.id);
    }
    toast.success(`Merged into ${keep.name}`); void load();
  };
  const shown = rows.filter((r) => !q || `${r.name} ${r.email ?? ""} ${r.country ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Companies</h1><Button onClick={() => setEdit({ ...blank })}>New company</Button></div>
      {!!dups.length && <Card><CardHeader><CardTitle className="text-base">Possible duplicates</CardTitle></CardHeader><CardContent className="space-y-2">
        {dups.map((g) => <div key={g[0]!.id} className="flex items-center justify-between text-sm"><span>{g.map((c) => c.name).join(" · ")}</span><Button size="sm" variant="outline" onClick={() => merge(g)}>Merge</Button></div>)}
      </CardContent></Card>}
      <Input placeholder="Search companies…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search companies" />
      <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Country</TableHead><TableHead>E-mail</TableHead><TableHead>Phone</TableHead><TableHead>Leads</TableHead><TableHead>Deals</TableHead></TableRow></TableHeader>
        <TableBody>{shown.map((c) => <TableRow key={c.id} className="cursor-pointer" onClick={() => setEdit(c)}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.country}</TableCell><TableCell>{c.email}</TableCell><TableCell>{c.phone}</TableCell><TableCell>{counts[c.id]?.leads ?? 0}</TableCell><TableCell>{counts[c.id]?.deals ?? 0}</TableCell></TableRow>)}</TableBody></Table>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent><DialogHeader><DialogTitle>{edit?.id ? "Edit company" : "New company"}</DialogTitle></DialogHeader>
          {edit && <div className="space-y-2">
            {(["name", "country", "website", "email", "phone"] as const).map((f) => <Input key={f} placeholder={f} aria-label={f} value={edit[f] ?? ""} onChange={(e) => setEdit({ ...edit, [f]: e.target.value })} />)}
            <Textarea placeholder="Notes" value={edit.notes ?? ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
            <Button onClick={save}>Save</Button>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
