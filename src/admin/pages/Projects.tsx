import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Plus, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { ganttBar, isBlocked, projectProgress, trackedMinutes } from "@/admin/workspace/projectModel";

type Project = { id: string; name: string; description: string | null; status: string; created_at: string };
type Task = { id: string; project_id: string; title: string; assignee_id: string | null; status: string; starts_on: string | null; ends_on: string | null; depends_on: string | null; checklist: { text: string; done: boolean }[]; position: number };
type Entry = { id: string; project_task_id: string | null; started_at: string; ended_at: string | null; user_id: string };

export default function Projects() {
  const { users, name } = useAdminUsers();
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newProject, setNewProject] = useState("");
  const [newTask, setNewTask] = useState("");
  const [me, setMe] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    const { data } = await supabase.from("projects").select("id,name,description,status,created_at").order("created_at", { ascending: false });
    setProjects((data ?? []) as Project[]);
    if (!active && data?.[0]) setActive(data[0].id);
  }, [active]);
  const loadTasks = useCallback(async (pid: string) => {
    const { data } = await supabase.from("project_tasks").select("*").eq("project_id", pid).order("position");
    const t = (data ?? []) as unknown as Task[]; setTasks(t);
    const ids = t.map((x) => x.id);
    const { data: e } = ids.length ? await supabase.from("time_entries").select("id,project_task_id,started_at,ended_at,user_id").in("project_task_id", ids) : { data: [] };
    setEntries((e ?? []) as Entry[]);
  }, []);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); void loadProjects(); }, [loadProjects]);
  useEffect(() => { if (active) void loadTasks(active); }, [active, loadTasks]);

  const check = (r: { error: { message: string } | null }) => { if (r.error) { toast.error(r.error.message); return false; } return true; };
  const addProject = async () => {
    if (!newProject.trim()) return;
    const r = await supabase.from("projects").insert({ name: newProject.trim(), owner_id: me }).select("id").single();
    if (check(r)) { setNewProject(""); setActive(r.data!.id); void loadProjects(); }
  };
  const addTask = async () => {
    if (!active || !newTask.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    if (check(await supabase.from("project_tasks").insert({ project_id: active, title: newTask.trim(), position: tasks.length, starts_on: today, ends_on: today }))) { setNewTask(""); void loadTasks(active); }
  };
  const update = async (id: string, patch: Partial<Task>) => { if (check(await supabase.from("project_tasks").update(patch as never).eq("id", id)) && active) void loadTasks(active); };
  const remove = async (id: string) => { if (check(await supabase.from("project_tasks").delete().eq("id", id)) && active) void loadTasks(active); };
  const running = entries.find((e) => !e.ended_at && e.user_id === me);
  const toggleTimer = async (taskId: string) => {
    if (running) await supabase.from("time_entries").update({ ended_at: new Date().toISOString() }).eq("id", running.id);
    if (!running || running.project_task_id !== taskId) await supabase.from("time_entries").insert({ project_task_id: taskId });
    if (active) void loadTasks(active);
  };

  const win = useMemo(() => {
    const ds = tasks.flatMap((t) => [t.starts_on, t.ends_on]).filter(Boolean).map((d) => Date.parse(d!));
    return ds.length ? { s: Math.min(...ds), e: Math.max(...ds) + 864e5 } : { s: Date.now(), e: Date.now() + 7 * 864e5 };
  }, [tasks]);
  const project = projects.find((p) => p.id === active);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex gap-2"><Input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="New project" aria-label="New project" /><Button size="icon" onClick={addProject} aria-label="Add project"><Plus className="h-4 w-4" /></Button></div>
        {projects.map((p) => <button key={p.id} onClick={() => setActive(p.id)} className={`block w-full rounded-md px-3 py-2 text-left text-sm ${active === p.id ? "bg-muted font-medium" : "hover:bg-muted/60"}`}>{p.name}</button>)}
      </div>
      {project ? (
        <div className="space-y-4">
          <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>{project.name}</CardTitle><Badge>{projectProgress(tasks)}% done · {Math.round(trackedMinutes(entries) / 6) / 10} h</Badge></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2"><Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task" aria-label="New task" onKeyDown={(e) => e.key === "Enter" && addTask()} /><Button onClick={addTask}>Add task</Button></div>
              {tasks.map((t) => {
                const blocked = isBlocked(t, tasks);
                return (
                  <div key={t.id} className="space-y-2 rounded-md border p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Checkbox checked={t.status === "done"} disabled={blocked} onCheckedChange={(v) => update(t.id, { status: v ? "done" : "todo" })} aria-label="Done" />
                      <span className={`flex-1 text-sm ${t.status === "done" ? "line-through opacity-60" : ""}`}>{t.title}</span>
                      {blocked && <Badge variant="outline">Blocked</Badge>}
                      <select className="rounded border bg-background px-2 py-1 text-xs" value={t.assignee_id ?? ""} onChange={(e) => update(t.id, { assignee_id: e.target.value || null })} aria-label="Assignee">
                        <option value="">Unassigned</option>{users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
                      </select>
                      <select className="rounded border bg-background px-2 py-1 text-xs" value={t.depends_on ?? ""} onChange={(e) => update(t.id, { depends_on: e.target.value || null })} aria-label="Depends on">
                        <option value="">No dependency</option>{tasks.filter((x) => x.id !== t.id).map((x) => <option key={x.id} value={x.id}>After: {x.title}</option>)}
                      </select>
                      <input type="date" className="rounded border bg-background px-2 py-1 text-xs" value={t.starts_on ?? ""} onChange={(e) => update(t.id, { starts_on: e.target.value || null })} aria-label="Start" />
                      <input type="date" className="rounded border bg-background px-2 py-1 text-xs" value={t.ends_on ?? ""} onChange={(e) => update(t.id, { ends_on: e.target.value || null })} aria-label="End" />
                      <Button size="sm" variant={running?.project_task_id === t.id ? "default" : "outline"} onClick={() => toggleTimer(t.id)} className="gap-1">
                        {running?.project_task_id === t.id ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}{Math.round(trackedMinutes(entries.filter((e) => e.project_task_id === t.id)))} min
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(t.id)} aria-label="Delete task"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <div className="space-y-1 pl-6">
                      {t.checklist.map((c, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs"><Checkbox checked={c.done} onCheckedChange={(v) => update(t.id, { checklist: t.checklist.map((x, j) => (j === i ? { ...x, done: !!v } : x)) })} />{c.text}</label>
                      ))}
                      <input className="w-full rounded border bg-background px-2 py-1 text-xs" placeholder="Add checklist item + Enter" onKeyDown={(e) => { const v = e.currentTarget.value.trim(); if (e.key === "Enter" && v) { void update(t.id, { checklist: [...t.checklist, { text: v, done: false }] }); e.currentTarget.value = ""; } }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {tasks.map((t) => { const b = ganttBar(t.starts_on, t.ends_on, win.s, win.e); return (
                <div key={t.id} className="grid grid-cols-[160px_1fr] items-center gap-2 text-xs"><span className="truncate">{t.title}</span>
                  <div className="relative h-5 rounded bg-muted">{b && <div className={`absolute h-5 rounded ${t.status === "done" ? "bg-primary/50" : "bg-primary"}`} style={{ left: `${b.left}%`, width: `${b.width}%` }} />}</div></div>
              ); })}
            </CardContent>
          </Card>
        </div>
      ) : <p className="text-sm text-muted-foreground">Create a project to get started.</p>}
    </div>
  );
}
