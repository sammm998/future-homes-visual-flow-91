import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    name: "", email: "", phone: "", nationality: "",
    status: "new", source: "manual", score: 0,
    budget_min: "", budget_max: "", budget_currency: "EUR",
    message: "", tags: "",
  });
  const [notes, setNotes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  const loadAll = async () => {
    if (isNew) return;
    const [{ data: lead }, { data: ns }, { data: acts }] = await Promise.all([
      supabase.from("leads").select("*").eq("id", id!).maybeSingle(),
      supabase.from("lead_notes").select("*").eq("lead_id", id!).order("created_at", { ascending: false }),
      supabase.from("lead_activities").select("*").eq("lead_id", id!).order("created_at", { ascending: false }).limit(50),
    ]);
    if (lead) {
      setForm({
        ...lead,
        budget_min: lead.budget_min ?? "",
        budget_max: lead.budget_max ?? "",
        tags: (lead.tags ?? []).join(", "),
      });
    }
    setNotes(ns ?? []);
    setActivities(acts ?? []);
    setLoading(false);
  };
  useEffect(() => { loadAll(); }, [id]);

  const save = async () => {
    if (!form.name?.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload: any = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      nationality: form.nationality || null,
      status: form.status,
      source: form.source || null,
      score: Number(form.score) || 0,
      budget_min: form.budget_min === "" ? null : Number(form.budget_min),
      budget_max: form.budget_max === "" ? null : Number(form.budget_max),
      budget_currency: form.budget_currency || "EUR",
      message: form.message || null,
      tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    };
    if (isNew) {
      const { data, error } = await supabase.from("leads").insert(payload).select("id").single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Lead created");
      navigate(`/admin/crm/leads/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase.from("leads").update(payload).eq("id", id!);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
      loadAll();
    }
  };

  const remove = async () => {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id!);
    toast.success("Deleted");
    navigate("/admin/crm/leads");
  };

  const addNote = async () => {
    if (!newNote.trim() || isNew) return;
    const { error } = await supabase.from("lead_notes").insert({ lead_id: id, body: newNote.trim() });
    if (error) return toast.error(error.message);
    await supabase.from("lead_activities").insert({ lead_id: id, type: "note", payload: { body: newNote.trim() } });
    setNewNote("");
    loadAll();
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/crm/leads"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isNew ? "New lead" : form.name}
          </h1>
          {!isNew && <Badge>{form.status}</Badge>}
        </div>
        <div className="flex gap-2">
          {!isNew && <Button variant="outline" onClick={remove}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>}
          <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Nationality</Label><Input value={form.nationality ?? ""} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></div>
              </div>
              <div><Label>Message</Label><Textarea rows={3} value={form.message ?? ""} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            </CardContent>
          </Card>

          {!isNew && (
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex gap-2">
                  <Textarea rows={2} value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note…" />
                  <Button onClick={addNote}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                  {notes.map((n) => (
                    <div key={n.id} className="p-3 bg-background rounded border text-sm">
                      <div className="text-xs text-muted-foreground mb-1">{format(new Date(n.created_at), "PPp")}</div>
                      {n.body}
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {!isNew && (
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base">Activity</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                {activities.map((a) => (
                  <div key={a.id} className="text-sm flex items-center gap-3 py-2 border-b last:border-0">
                    <Badge variant="outline">{a.type}</Badge>
                    <span className="flex-1 truncate text-muted-foreground">
                      {JSON.stringify(a.payload).slice(0, 100)}
                    </span>
                    <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "PP")}</span>
                  </div>
                ))}
                {activities.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Pipeline</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <Label>Status</Label>
                <select className="w-full h-10 border rounded px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><Label>Source</Label><Input value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
              <div><Label>Score</Label><Input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></div>
              <div><Label>Tags (comma)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
            </CardContent>
          </Card>
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Budget</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Min</Label><Input type="number" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} /></div>
                <div><Label>Max</Label><Input type="number" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} /></div>
              </div>
              <div><Label>Currency</Label><Input value={form.budget_currency} onChange={(e) => setForm({ ...form, budget_currency: e.target.value })} /></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
