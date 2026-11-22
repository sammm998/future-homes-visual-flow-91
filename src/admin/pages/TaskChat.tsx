import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Square, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { draftTaskFromText } from "@/admin/workspace/workspaceAi.functions";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";

type Task = { id: string; title: string; description: string | null; due_date: string | null; assigned_to: string | null; completed_at: string | null };
type Comment = { id: string; author_id: string | null; body: string; created_at: string };
type Draft = { title: string; description: string; checklist: string[]; due_date: string | null; assigned_to: string | null };

export default function TaskChat() {
  const { users, label } = useAdminUsers();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [msg, setMsg] = useState("");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const draftFn = useServerFn(draftTaskFromText);
  const load = useCallback(async () => { const { data } = await supabase.from("tasks").select("id,title,description,due_date,assigned_to,completed_at").order("created_at", { ascending: false }).limit(200); setTasks((data ?? []) as Task[]); }, []);
  const loadComments = useCallback(async (id: string) => { const { data } = await supabase.from("task_comments").select("id,author_id,body,created_at").eq("task_id", id).order("created_at"); setComments((data ?? []) as Comment[]); }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (open) void loadComments(open.id); }, [open, loadComments]);
  const makeDraft = async (text: string) => { setBusy(true); try { setDraft(await draftFn({ data: { text } })); } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); } };
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream); chunks.current = [];
      r.ondataavailable = (e) => chunks.current.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const fd = new FormData(); fd.append("file", new File(chunks.current, "voice.webm", { type: r.mimeType || "audio/webm" }));
        setBusy(true);
        const res = await fetch("/api/ai-transcribe", { method: "POST", body: fd }).then((x) => x.json()).catch(() => ({ error: "Could not transcribe" }));
        setBusy(false);
        if (res.text) { setPrompt(res.text); void makeDraft(res.text); } else toast.error(res.error ?? "Could not transcribe");
      };
      r.start(); setRec(r);
    } catch { toast.error("Microphone not available"); }
  };
  const createTask = async () => {
    if (!draft) return;
    const { data: u } = await supabase.auth.getUser();
    const description = [draft.description, ...draft.checklist.map((c) => `- [ ] ${c}`)].filter(Boolean).join("\n");
    const r = await supabase.from("tasks").insert({ title: draft.title, description, due_date: draft.due_date, assigned_to: draft.assigned_to, created_by: u.user?.id }).select("id,title,description,due_date,assigned_to,completed_at").single();
    if (r.error) return toast.error(r.error.message);
    setDraft(null); setPrompt(""); toast.success("Task created"); await load(); setOpen(r.data as Task);
  };
  const send = async () => {
    if (!open || !msg.trim()) return;
    const { data: u } = await supabase.auth.getUser();
    const r = await supabase.from("task_comments").insert({ task_id: open.id, author_id: u.user?.id, body: msg });
    if (r.error) return toast.error(r.error.message);
    setMsg(""); void loadComments(open.id);
  };
  const toggleDone = async (t: Task) => { await supabase.from("tasks").update({ completed_at: t.completed_at ? null : new Date().toISOString() }).eq("id", t.id); const nt = { ...t, completed_at: t.completed_at ? null : new Date().toISOString() }; setOpen(nt); void load(); };
  const shown = tasks.filter((t) => !q || t.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">Task chats</h1><p className="text-sm text-muted-foreground">Write or record a voice message — AI turns it into a task with description, checklist, deadline and owner. Every task has its own discussion.</p></div>
      <Card><CardContent className="space-y-2 p-4">
        <div className="flex gap-2"><Textarea rows={2} aria-label="Describe task" placeholder="e.g. Batuhan should send Ahmed the Lara price list and book a viewing before Friday" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <div className="flex flex-col gap-2">{rec ? <Button variant="destructive" aria-label="Stop recording" onClick={() => { rec.stop(); setRec(null); }}><Square className="h-4 w-4" /></Button> : <Button variant="outline" aria-label="Record voice" onClick={startRec}><Mic className="h-4 w-4" /></Button>}
            <Button aria-label="Create with AI" disabled={busy || prompt.trim().length < 3} onClick={() => makeDraft(prompt)}><Sparkles className="h-4 w-4" /></Button></div></div>
        {busy && <p className="text-sm text-muted-foreground">AI is working…</p>}
        {draft && <div className="space-y-2 rounded-md border p-3">
          <Input aria-label="Draft title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Textarea rows={2} aria-label="Draft description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <ul className="list-disc pl-5 text-sm">{draft.checklist.map((c, i) => <li key={i}>{c}</li>)}</ul>
          <div className="flex flex-wrap gap-2"><Input type="date" className="w-44" aria-label="Draft due date" value={draft.due_date ?? ""} onChange={(e) => setDraft({ ...draft, due_date: e.target.value || null })} />
            <select aria-label="Draft assignee" className="h-10 rounded-md border bg-background px-2 text-sm" value={draft.assigned_to ?? ""} onChange={(e) => setDraft({ ...draft, assigned_to: e.target.value || null })}><option value="">Unassigned</option>{users.map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}</select>
            <Button onClick={createTask}>Create task</Button><Button variant="ghost" onClick={() => setDraft(null)}>Discard</Button></div>
        </div>}
      </CardContent></Card>
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="space-y-2"><Input aria-label="Find task" placeholder="Find task chat" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="max-h-[60vh] space-y-1 overflow-y-auto">{shown.map((t) => <button key={t.id} onClick={() => setOpen(t)} className={`block w-full rounded-md border p-2 text-left text-sm ${open?.id === t.id ? "bg-muted" : "hover:bg-muted/60"}`}><div className={`font-medium ${t.completed_at ? "line-through text-muted-foreground" : ""}`}>{t.title}</div><div className="text-xs text-muted-foreground">{label(t.assigned_to)}{t.due_date ? ` · due ${t.due_date.slice(0, 10)}` : ""}</div></button>)}</div></div>
        {open ? <Card><CardContent className="flex h-full flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2"><div><h2 className="text-lg font-semibold">{open.title}</h2><div className="text-xs text-muted-foreground">{label(open.assigned_to)}{open.due_date ? ` · due ${open.due_date.slice(0, 10)}` : ""}</div></div><Button size="sm" variant="outline" onClick={() => toggleDone(open)}>{open.completed_at ? "Reopen" : "Mark done"}</Button></div>
          {open.description && <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{open.description}</div>}
          <div className="flex-1 space-y-2">{comments.map((c) => <div key={c.id} className="rounded-md border p-2 text-sm"><div className="text-xs text-muted-foreground">{label(c.author_id)} · {new Date(c.created_at).toLocaleString()}</div>{c.body}</div>)}{!comments.length && <p className="text-sm text-muted-foreground">No discussion yet.</p>}</div>
          <div className="flex gap-2"><Input aria-label="Comment" placeholder="Write a comment…" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} /><Button aria-label="Send comment" onClick={send}><Send className="h-4 w-4" /></Button></div>
        </CardContent></Card> : <p className="text-sm text-muted-foreground">Select a task to open its chat.</p>}
      </div>
    </div>
  );
}
