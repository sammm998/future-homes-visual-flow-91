import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { absenceDays, trackedMinutes } from "@/admin/workspace/projectModel";

type Entry = { id: string; user_id: string; started_at: string; ended_at: string | null; note: string | null; project_task_id: string | null };
type Absence = { id: string; user_id: string; kind: string; starts_on: string; ends_on: string; note: string | null; status: string };

export default function TimeAbsence() {
  const { name } = useAdminUsers();
  const [me, setMe] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [form, setForm] = useState({ kind: "vacation", starts_on: "", ends_on: "", note: "" });
  const load = useCallback(async () => {
    const since = new Date(Date.now() - 14 * 864e5).toISOString();
    const [e, a] = await Promise.all([
      supabase.from("time_entries").select("id,user_id,started_at,ended_at,note,project_task_id").gte("started_at", since).order("started_at", { ascending: false }),
      supabase.from("absences").select("id,user_id,kind,starts_on,ends_on,note,status").order("starts_on", { ascending: false }).limit(100),
    ]);
    setEntries((e.data ?? []) as Entry[]); setAbsences((a.data ?? []) as Absence[]);
  }, []);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); void load(); }, [load]);
  const running = entries.find((e) => e.user_id === me && !e.ended_at && !e.project_task_id);
  const clock = async () => {
    const r = running ? await supabase.from("time_entries").update({ ended_at: new Date().toISOString() }).eq("id", running.id) : await supabase.from("time_entries").insert({ note: "Work day" });
    if (r.error) toast.error(r.error.message); else void load();
  };
  const request = async () => {
    if (!form.starts_on || !form.ends_on || form.ends_on < form.starts_on) return toast.error("Choose a valid period");
    const r = await supabase.from("absences").insert({ ...form, note: form.note || null });
    if (r.error) return toast.error(r.error.message);
    setForm({ kind: "vacation", starts_on: "", ends_on: "", note: "" }); toast.success("Request sent"); void load();
  };
  const decide = async (id: string, status: string) => { const r = await supabase.from("absences").update({ status, decided_by: me }).eq("id", id); if (r.error) toast.error(r.error.message); else void load(); };
  const mine = entries.filter((e) => e.user_id === me);
  const byUser = [...new Set(entries.map((e) => e.user_id))];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Time & absence</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Work time</CardTitle></CardHeader><CardContent className="space-y-3">
          <Button onClick={clock} size="lg" variant={running ? "destructive" : "default"}>{running ? "Clock out" : "Clock in"}</Button>
          <p className="text-sm text-muted-foreground">Last 14 days: {Math.round(trackedMinutes(mine) / 6) / 10} h</p>
          {byUser.map((u) => <div key={u} className="flex justify-between text-sm"><span>{name(u)}</span><span>{Math.round(trackedMinutes(entries.filter((e) => e.user_id === u)) / 6) / 10} h</span></div>)}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Request leave</CardTitle></CardHeader><CardContent className="space-y-2">
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} aria-label="Type">
            <option value="vacation">Vacation</option><option value="sick">Sick leave</option><option value="personal">Personal</option><option value="travel">Business trip</option>
          </select>
          <div className="grid grid-cols-2 gap-2"><Input type="date" value={form.starts_on} onChange={(e) => setForm({ ...form, starts_on: e.target.value })} aria-label="From" /><Input type="date" value={form.ends_on} onChange={(e) => setForm({ ...form, ends_on: e.target.value })} aria-label="To" /></div>
          <Input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} aria-label="Note" />
          <Button onClick={request}>Send request</Button>
        </CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Absence calendar</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Person</TableHead><TableHead>Type</TableHead><TableHead>Period</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{absences.map((a) => (
            <TableRow key={a.id}><TableCell>{name(a.user_id)}</TableCell><TableCell>{a.kind}</TableCell><TableCell>{a.starts_on} → {a.ends_on}</TableCell><TableCell>{absenceDays(a.starts_on, a.ends_on)}</TableCell>
              <TableCell><Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "outline"}>{a.status}</Badge></TableCell>
              <TableCell className="space-x-1">{a.status === "pending" && a.user_id !== me && <><Button size="sm" onClick={() => decide(a.id, "approved")}>Approve</Button><Button size="sm" variant="outline" onClick={() => decide(a.id, "rejected")}>Reject</Button></>}</TableCell></TableRow>
          ))}</TableBody></Table>
      </CardContent></Card>
    </div>
  );
}
