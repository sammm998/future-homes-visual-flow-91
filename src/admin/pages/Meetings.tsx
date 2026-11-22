import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Video, Copy, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { newRoomUrl } from "@/admin/workspace/meeting";
import { summarizeMeeting } from "@/admin/workspace/workspaceAi.functions";

type Meeting = { id: string; title: string; room_url: string; starts_at: string; notes: string | null; summary: string | null; lead_id: string | null };

export async function createMeeting(title: string, startsAt: string, leadId: string | null = null): Promise<Meeting | null> {
  const room_url = newRoomUrl(title);
  const { data: u } = await supabase.auth.getUser();
  const ev = await supabase.from("calendar_events").insert({ title: `Video: ${title}`, kind: "meeting", starts_at: startsAt, location: room_url, lead_id: leadId, owner_id: u.user?.id, created_by: u.user?.id }).select("id").single();
  const r = await supabase.from("meetings").insert({ title, room_url, starts_at: startsAt, lead_id: leadId, calendar_event_id: ev.data?.id ?? null, created_by: u.user?.id }).select("*").single();
  if (r.error) { toast.error(r.error.message); return null; }
  return r.data as Meeting;
}

export function StartMeetingButton({ title, leadId = null, size = "sm" }: { title: string; leadId?: string | null; size?: "sm" | "default" }) {
  return <Button size={size} variant="outline" className="gap-2" onClick={async () => { const m = await createMeeting(title, new Date().toISOString(), leadId); if (m) { window.open(m.room_url, "_blank", "noopener"); void navigator.clipboard?.writeText(m.room_url).catch(() => {}); toast.success("Meeting started — link copied"); } }}><Video className="h-4 w-4" />Start video meeting</Button>;
}

export default function Meetings() {
  const [list, setList] = useState<Meeting[]>([]);
  const [form, setForm] = useState({ title: "", starts_at: "" });
  const [open, setOpen] = useState<Meeting | null>(null);
  const [busy, setBusy] = useState(false);
  const summarize = useServerFn(summarizeMeeting);
  const load = useCallback(async () => { const { data } = await supabase.from("meetings").select("*").order("starts_at", { ascending: false }).limit(100); setList((data ?? []) as Meeting[]); }, []);
  useEffect(() => { void load(); }, [load]);
  const create = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    const m = await createMeeting(form.title, form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString());
    if (m) { setForm({ title: "", starts_at: "" }); setOpen(m); void load(); }
  };
  const saveNotes = async () => { if (!open) return; const r = await supabase.from("meetings").update({ notes: open.notes }).eq("id", open.id); if (r.error) return toast.error(r.error.message); toast.success("Notes saved"); void load(); };
  const runSummary = async () => {
    if (!open) return; setBusy(true);
    try { await supabase.from("meetings").update({ notes: open.notes }).eq("id", open.id); const r = await summarize({ data: { meetingId: open.id } }); setOpen({ ...open, summary: r.summary }); toast.success(`Summary ready · ${r.created} tasks created`); void load(); }
    catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Video meetings</h1><p className="text-sm text-muted-foreground">Start or schedule a video call, send the link to the client, keep notes and let AI turn them into tasks.</p></div>
      <Card><CardContent className="flex flex-wrap items-end gap-2 p-4">
        <Input className="max-w-sm" aria-label="Meeting title" placeholder="Meeting title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input className="max-w-xs" type="datetime-local" aria-label="Meeting time" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
        <Button className="gap-2" onClick={create}><Video className="h-4 w-4" />Create meeting</Button>
      </CardContent></Card>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-2">{list.map((m) => <button key={m.id} onClick={() => setOpen(m)} className={`block w-full rounded-md border p-3 text-left text-sm ${open?.id === m.id ? "bg-muted" : "hover:bg-muted/60"}`}><div className="font-medium">{m.title}</div><div className="text-xs text-muted-foreground">{new Date(m.starts_at).toLocaleString()}</div></button>)}{!list.length && <p className="text-sm text-muted-foreground">No meetings yet.</p>}</div>
        {open && <Card><CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">{open.title}</h2><div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => { void navigator.clipboard.writeText(open.room_url); toast.success("Link copied"); }}><Copy className="h-4 w-4" />Copy link</Button>
            <Button size="sm" className="gap-2" onClick={() => window.open(open.room_url, "_blank", "noopener")}><Video className="h-4 w-4" />Join</Button></div></div>
          <div className="aspect-video w-full overflow-hidden rounded-md border"><iframe title="Video meeting" src={open.room_url} allow="camera; microphone; fullscreen; display-capture" className="h-full w-full" /></div>
          <Textarea rows={8} aria-label="Meeting notes" placeholder="Notes / minutes…" value={open.notes ?? ""} onChange={(e) => setOpen({ ...open, notes: e.target.value })} />
          <div className="flex gap-2"><Button variant="outline" className="gap-2" onClick={saveNotes}><Save className="h-4 w-4" />Save notes</Button><Button className="gap-2" disabled={busy} onClick={runSummary}><Sparkles className="h-4 w-4" />{busy ? "Summarising…" : "AI summary + tasks"}</Button></div>
          {open.summary && <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{open.summary}</div>}
        </CardContent></Card>}
      </div>
    </div>
  );
}
