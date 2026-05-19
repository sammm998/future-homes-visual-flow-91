import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function TemplatesList() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("email_templates").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name?.trim() || !editing?.subject?.trim()) return toast.error("Name and subject required");
    const payload = { name: editing.name, subject: editing.subject, html: editing.html ?? "" };
    const { error } = editing.id
      ? await supabase.from("email_templates").update(payload).eq("id", editing.id)
      : await supabase.from("email_templates").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("email_templates").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Email templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Reusable HTML blocks for campaigns.</p>
        </div>
        <Button onClick={() => setEditing({ name: "", subject: "", html: "" })}><Plus className="h-4 w-4 mr-2" /> New template</Button>
      </div>

      {editing && (
        <Card className="bg-admin-surface">
          <CardContent className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Subject</Label><Input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} /></div>
            </div>
            <div><Label>HTML</Label><Textarea rows={12} className="font-mono text-xs" value={editing.html} onChange={(e) => setEditing({ ...editing, html: e.target.value })} /></div>
            <div className="flex gap-2"><Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-admin-surface">
        <CardContent className="p-0 divide-y">
          {!rows ? <div className="p-8 text-center text-muted-foreground">Loading…</div> :
            rows.length === 0 ? <div className="p-8 text-center text-muted-foreground">No templates yet.</div> :
            rows.map((t) => (
              <div key={t.id} className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.subject}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditing(t)}>Edit</Button>
                <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
