import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Page = { id: string; title: string; category: string; body: string; updated_at: string };
const blank = { id: "", title: "", category: "General", body: "" };

export default function Wiki() {
  const [pages, setPages] = useState<Page[]>([]);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Omit<Page, "updated_at">>(blank);
  const load = useCallback(async () => {
    const { data } = await supabase.from("wiki_pages").select("id,title,category,body,updated_at").order("category").order("title");
    setPages((data ?? []) as Page[]);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const save = async () => {
    if (!edit.title.trim()) return toast.error("Title is required");
    const row = { title: edit.title, category: edit.category || "General", body: edit.body, updated_at: new Date().toISOString() };
    const r = edit.id ? await supabase.from("wiki_pages").update(row).eq("id", edit.id).select("id").single() : await supabase.from("wiki_pages").insert(row).select("id").single();
    if (r.error) return toast.error(r.error.message);
    setEdit({ ...edit, id: r.data.id }); toast.success("Saved"); void load();
  };
  const del = async () => { if (!edit.id) return; const r = await supabase.from("wiki_pages").delete().eq("id", edit.id); if (r.error) return toast.error(r.error.message); setEdit(blank); void load(); };
  const shown = pages.filter((p) => !q || `${p.title} ${p.body}`.toLowerCase().includes(q.toLowerCase()));
  const cats = [...new Set(shown.map((p) => p.category))];
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Knowledge base</h1>
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search wiki" />
        <Button variant="outline" className="w-full gap-2" onClick={() => setEdit(blank)}><Plus className="h-4 w-4" /> New page</Button>
        {cats.map((c) => <div key={c}><div className="mt-2 text-xs font-semibold uppercase text-muted-foreground">{c}</div>
          {shown.filter((p) => p.category === c).map((p) => <button key={p.id} onClick={() => setEdit(p)} className={`block w-full truncate rounded px-2 py-1 text-left text-sm ${edit.id === p.id ? "bg-muted" : "hover:bg-muted/60"}`}>{p.title}</button>)}</div>)}
      </div>
      <Card><CardContent className="space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_200px]"><Input placeholder="Title" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} aria-label="Title" /><Input placeholder="Category" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} aria-label="Category" /></div>
        <Textarea rows={20} placeholder="Routines, sales scripts, office procedures…" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} aria-label="Content" />
        <div className="flex gap-2"><Button onClick={save} className="gap-2"><Save className="h-4 w-4" /> Save</Button>{edit.id && <Button variant="outline" onClick={del} className="gap-2"><Trash2 className="h-4 w-4" /> Delete</Button>}</div>
      </CardContent></Card>
    </div>
  );
}
