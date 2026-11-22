import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { aggregate, toCsv, type Dimension, type Metric } from "@/admin/workspace/bi";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";

type Config = { metric: Metric; dim: Dimension; days: number };
const METRICS: Record<Metric, string> = { leads: "Leads", deals: "Deals", won: "Won deals", revenue: "Revenue (€, won)" };
const DIMS: Record<Dimension, string> = { source: "Source", owner: "Salesperson", country: "Country", month: "Month", stage: "Stage", status: "Lead status" };

export default function BIBuilder() {
  const { label } = useAdminUsers();
  const [cfg, setCfg] = useState<Config>({ metric: "leads", dim: "source", days: 90 });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [saved, setSaved] = useState<{ id: string; name: string; config: Config }[]>([]);
  const [name, setName] = useState("");
  const loadSaved = useCallback(async () => { const { data } = await supabase.from("saved_reports").select("id,name,config").order("name"); setSaved((data ?? []) as any); }, []);
  useEffect(() => { void loadSaved(); }, [loadSaved]);
  useEffect(() => {
    const since = new Date(Date.now() - cfg.days * 864e5).toISOString();
    const q = cfg.metric === "leads" ? supabase.from("leads").select("source,assigned_to,preferred_countries,status,created_at").gte("created_at", since).limit(10000) : supabase.from("deals").select("stage,value_eur,owner_id,country,created_at").gte("created_at", since).limit(10000);
    void q.then(({ data }) => setRows((data ?? []) as any));
  }, [cfg.metric, cfg.days]);
  const result = useMemo(() => aggregate(rows, cfg.metric, cfg.dim).map((r) => ({ ...r, key: cfg.dim === "owner" ? label(r.key === "Unassigned" ? null : r.key) : r.key })), [rows, cfg, label]);
  const csv = () => { const blob = new Blob([toCsv(result, [DIMS[cfg.dim], METRICS[cfg.metric]])], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `report-${cfg.metric}-${cfg.dim}.csv`; a.click(); };
  const save = async () => { if (!name.trim()) return toast.error("Name the report"); const r = await supabase.from("saved_reports").insert({ name, config: cfg }); if (r.error) return toast.error(r.error.message); setName(""); toast.success("Report saved"); void loadSaved(); };
  const sel = "h-10 rounded-md border bg-background px-2 text-sm";
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">BI builder</h1><p className="text-sm text-muted-foreground">Pick what to measure and how to split it.</p></div>
      <Card><CardContent className="flex flex-wrap items-center gap-2 p-4">
        <select aria-label="Metric" className={sel} value={cfg.metric} onChange={(e) => setCfg({ ...cfg, metric: e.target.value as Metric })}>{Object.entries(METRICS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <span className="text-sm">by</span>
        <select aria-label="Dimension" className={sel} value={cfg.dim} onChange={(e) => setCfg({ ...cfg, dim: e.target.value as Dimension })}>{Object.entries(DIMS).filter(([k]) => cfg.metric === "leads" ? k !== "stage" : k !== "status").map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select aria-label="Period" className={sel} value={cfg.days} onChange={(e) => setCfg({ ...cfg, days: Number(e.target.value) })}>{[30, 90, 180, 365, 1095].map((d) => <option key={d} value={d}>Last {d} days</option>)}</select>
        <Button variant="outline" className="gap-2" onClick={csv}><Download className="h-4 w-4" />CSV</Button>
        <Input className="ml-auto max-w-[200px]" aria-label="Report name" placeholder="Report name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button className="gap-2" onClick={save}><Save className="h-4 w-4" />Save</Button>
      </CardContent></Card>
      {saved.length > 0 && <div className="flex flex-wrap gap-2">{saved.map((s) => <span key={s.id} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"><button onClick={() => setCfg(s.config)}>{s.name}</button><button aria-label={`Delete report ${s.name}`} onClick={async () => { await supabase.from("saved_reports").delete().eq("id", s.id); void loadSaved(); }}><Trash2 className="h-3 w-3" /></button></span>)}</div>}
      <Card><CardContent className="h-80 p-4"><ResponsiveContainer><BarChart data={result.slice(0, 20)}><XAxis dataKey="key" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent></Card>
      <div className="rounded-md border">{result.map((r) => <div key={r.key} className="flex justify-between border-b p-2 text-sm last:border-0"><span>{r.key}</span><span className="font-medium">{cfg.metric === "revenue" ? `€${r.value.toLocaleString()}` : r.value}</span></div>)}{!result.length && <p className="p-4 text-sm text-muted-foreground">No data in this period.</p>}</div>
    </div>
  );
}
