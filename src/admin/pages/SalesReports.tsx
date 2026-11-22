import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { DEAL_STAGES } from "@/admin/workspace/model";
import { forecast, median, stageConversion, toCsv } from "@/admin/crm/model";

type Deal = { id: string; stage: string; value_eur: number; owner_id: string | null; country: string | null; created_at: string; stage_changed_at: string };
type Hist = { deal_id: string; to_stage: string };
type Lead = { id: string; created_at: string; assigned_to: string | null };
type Act = { lead_id: string; created_at: string };
type Ev = { owner_id: string | null; kind: string; starts_at: string };

const eur = (n: number) => `€${Math.round(n).toLocaleString("en-GB")}`;

export default function SalesReports() {
  const { t } = useAdminT();
  const { users, name } = useAdminUsers();
  const [from, setFrom] = useState(() => new Date(Date.now() - 180 * 864e5).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [owner, setOwner] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [hist, setHist] = useState<Hist[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [acts, setActs] = useState<Act[]>([]);
  const [events, setEvents] = useState<Ev[]>([]);

  useEffect(() => {
    const end = `${to}T23:59:59Z`;
    Promise.all([
      supabase.from("deals").select("id, stage, value_eur, owner_id, country, created_at, stage_changed_at").gte("created_at", from).lte("created_at", end),
      supabase.from("deal_stage_history").select("deal_id, to_stage").gte("created_at", from),
      supabase.from("leads").select("id, created_at, assigned_to").gte("created_at", from).lte("created_at", end).limit(5000),
      supabase.from("lead_activities").select("lead_id, created_at").gte("created_at", from).order("created_at").limit(10000),
      supabase.from("calendar_events").select("owner_id, kind, starts_at").gte("starts_at", from).lte("starts_at", end),
    ]).then(([d, h, l, a, e]) => {
      setDeals((d.data as Deal[]) ?? []); setHist((h.data as Hist[]) ?? []); setLeads((l.data as Lead[]) ?? []);
      setActs((a.data as Act[]) ?? []); setEvents((e.data as Ev[]) ?? []);
    });
  }, [from, to]);

  const fd = useMemo(() => (owner ? deals.filter((d) => d.owner_id === owner) : deals), [deals, owner]);
  const fc = forecast(fd);
  const winRate = (() => { const closed = fd.filter((d) => d.stage === "won" || d.stage === "lost"); return closed.length ? Math.round((fd.filter((d) => d.stage === "won").length / closed.length) * 100) : 0; })();

  const order = DEAL_STAGES.filter((s) => s.key !== "lost").map((s) => s.key);
  const conversion = useMemo(() => {
    const ids = new Set(fd.map((d) => d.id));
    const reached = new Map<string, Set<string>>();
    const mark = (id: string, stage: string) => { const i = order.indexOf(stage as any); for (let k = 0; k <= i; k++) { const s = order[k]!; if (!reached.has(s)) reached.set(s, new Set()); reached.get(s)!.add(id); } };
    for (const d of fd) mark(d.id, d.stage === "lost" ? "new" : d.stage);
    for (const h of hist) if (ids.has(h.deal_id) && h.to_stage !== "lost") mark(h.deal_id, h.to_stage);
    return stageConversion(order, reached, fd.length);
  }, [fd, hist]);

  const perOwner = useMemo(() => {
    const firstAct = new Map<string, number>();
    for (const a of acts) if (!firstAct.has(a.lead_id)) firstAct.set(a.lead_id, new Date(a.created_at).getTime());
    const ids = Array.from(new Set([...users.map((u) => u.id), ...deals.map((d) => d.owner_id).filter(Boolean) as string[]]));
    return ids.map((id) => {
      const ds = deals.filter((d) => d.owner_id === id);
      const f = forecast(ds);
      const ls = leads.filter((l) => l.assigned_to === id);
      const resp = ls.map((l) => { const fa = firstAct.get(l.id); return fa ? (fa - new Date(l.created_at).getTime()) / 3600000 : null; }).filter((x): x is number => x != null && x >= 0);
      const med = median(resp);
      return { id, name: name(id), deals: ds.length, won: f.won, open: f.open, weighted: f.weighted, viewings: events.filter((e) => e.owner_id === id && e.kind === "viewing").length, leads: ls.length, responseH: med == null ? null : Math.round(med * 10) / 10 };
    }).filter((r) => r.deals || r.leads || r.viewings);
  }, [deals, leads, acts, events, users]);

  const byMonth = useMemo(() => {
    const m = new Map<string, { month: string; won: number; pipeline: number }>();
    for (const d of fd) { const k = (d.stage === "won" ? d.stage_changed_at : d.created_at).slice(0, 7); const r = m.get(k) ?? { month: k, won: 0, pipeline: 0 }; if (d.stage === "won") r.won += Number(d.value_eur); else if (d.stage !== "lost") r.pipeline += Number(d.value_eur); m.set(k, r); }
    return [...m.values()].sort((a, b) => a.month.localeCompare(b.month));
  }, [fd]);
  const byCountry = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of fd) if (d.stage === "won") m.set(d.country || "—", (m.get(d.country || "—") ?? 0) + Number(d.value_eur));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [fd]);

  const exportCsv = () => {
    const csv = toCsv([["Salesperson", "Deals", "Won EUR", "Open EUR", "Forecast EUR", "Leads", "Viewings", "Median response h"], ...perOwner.map((r) => [r.name, r.deals, r.won, r.open, r.weighted, r.leads, r.viewings, r.responseH])]);
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `sales-report-${from}-${to}.csv`; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="text-2xl font-semibold mr-auto">{t("Sales reports")}</h1>
        <label className="text-xs">{t("From")}<Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-xs">{t("To")}<Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <select className="h-9 rounded border bg-background px-2 text-sm" value={owner} onChange={(e) => setOwner(e.target.value)}><option value="">{t("All salespeople")}</option>{users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}</select>
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-1" />CSV</Button>
      </div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[[t("Won"), eur(fc.won)], [t("Open pipeline"), eur(fc.open)], [t("Weighted forecast"), eur(fc.weighted)], [t("Win rate"), `${winRate}%`]].map(([k, v]) => (
          <Card key={k}><CardContent className="p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="text-2xl font-semibold">{v}</div></CardContent></Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">{t("Sales per month")}</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer><BarChart data={byMonth}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="won" name={t("Won")} fill="hsl(var(--primary))" /><Bar dataKey="pipeline" name={t("Open pipeline")} fill="hsl(var(--muted-foreground))" /></BarChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">{t("Stage conversion")}</CardTitle></CardHeader><CardContent className="space-y-2">
          {conversion.map((c) => (<div key={c.stage}><div className="flex justify-between text-sm"><span>{t(DEAL_STAGES.find((s) => s.key === c.stage)?.label ?? c.stage)}</span><span>{c.count} · {c.rate}%</span></div><div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${c.rate}%` }} /></div></div>))}
        </CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">{t("Per salesperson")}</CardTitle></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>{t("Salesperson")}</TableHead><TableHead className="text-right">{t("Deals")}</TableHead><TableHead className="text-right">{t("Won")}</TableHead><TableHead className="text-right">{t("Open pipeline")}</TableHead><TableHead className="text-right">{t("Weighted forecast")}</TableHead><TableHead className="text-right">Leads</TableHead><TableHead className="text-right">{t("Viewings")}</TableHead><TableHead className="text-right">{t("Median response")}</TableHead></TableRow></TableHeader>
          <TableBody>{perOwner.map((r) => (<TableRow key={r.id}><TableCell>{r.name}</TableCell><TableCell className="text-right">{r.deals}</TableCell><TableCell className="text-right">{eur(r.won)}</TableCell><TableCell className="text-right">{eur(r.open)}</TableCell><TableCell className="text-right">{eur(r.weighted)}</TableCell><TableCell className="text-right">{r.leads}</TableCell><TableCell className="text-right">{r.viewings}</TableCell><TableCell className="text-right">{r.responseH == null ? "—" : `${r.responseH} h`}</TableCell></TableRow>))}
            {!perOwner.length && <TableRow><TableCell colSpan={8} className="text-muted-foreground">{t("No data in this period")}</TableCell></TableRow>}</TableBody></Table>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">{t("Won per country")}</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-4">
        {byCountry.length ? byCountry.map(([c, v]) => <div key={c}><div className="text-xs text-muted-foreground">{c}</div><div className="font-semibold">{eur(v)}</div></div>) : <span className="text-sm text-muted-foreground">{t("No data in this period")}</span>}
      </CardContent></Card>
    </div>
  );
}
