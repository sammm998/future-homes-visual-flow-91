import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Task {
  id: string; title: string; description: string | null;
  due_date: string | null; completed_at: string | null;
  created_at: string;
}

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });

  const load = async () => {
    const { data, error } = await supabase
      .from("tasks").select("id,title,description,due_date,completed_at,created_at")
      .order("completed_at", { ascending: true, nullsFirst: true })
      .order("due_date", { ascending: true, nullsFirst: false });
    if (error) toast.error(error.message);
    setTasks((data as Task[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (t: Task) => {
    const completed_at = t.completed_at ? null : new Date().toISOString();
    await supabase.from("tasks").update({ completed_at }).eq("id", t.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("tasks").delete().eq("id", id);
    load();
  };
  const create = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("tasks").insert({
      title: form.title.trim(),
      description: form.description || null,
      due_date: form.due_date || null,
      created_by: userData.user?.id,
      assigned_to: userData.user?.id,
    });
    if (error) return toast.error(error.message);
    setForm({ title: "", description: "", due_date: "" });
    setOpen(false);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">Personal & team to-dos.</p>
        </div>
        <Button onClick={() => setOpen(!open)}><Plus className="h-4 w-4 mr-2" /> New task</Button>
      </div>

      {open && (
        <Card className="bg-admin-surface">
          <CardContent className="p-4 space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Due date</Label><Input type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            <div className="flex gap-2"><Button onClick={create}>Create</Button><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button></div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-admin-surface">
        <CardContent className="p-0 divide-y">
          {!tasks ? <div className="p-8 text-center text-muted-foreground">Loading…</div> :
            tasks.length === 0 ? <div className="p-8 text-center text-muted-foreground">No tasks.</div> :
            tasks.map((t) => (
              <div key={t.id} className="p-4 flex items-center gap-3">
                <Checkbox checked={!!t.completed_at} onCheckedChange={() => toggle(t)} />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${t.completed_at ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                  {t.description && <div className="text-xs text-muted-foreground truncate">{t.description}</div>}
                </div>
                {t.due_date && <span className="text-xs text-muted-foreground">{format(new Date(t.due_date), "PP")}</span>}
                <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
