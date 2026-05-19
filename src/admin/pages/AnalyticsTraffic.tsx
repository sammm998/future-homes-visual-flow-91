import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format, subDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ["#1a365d", "#c9a84c", "#2dd4bf", "#a78bfa", "#f97316", "#ef4444", "#10b981", "#3b82f6"];

export default function AnalyticsTraffic() {
  const [days, setDays] = useState(30);
  const [daily, setDaily] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [browsers, setBrowsers] = useState<any[]>([]);
  const [oses, setOses] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [totals, setTotals] = useState({ events: 0, visitors: 0, pageviews: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = subDays(new Date(), days).toISOString();
      const { data } = await supabase
        .from("analytics_events").select("event_type,ts,country,device,browser,os,channel,page,referrer,visitor_id,session_id")
        .gte("ts", since).order("ts", { ascending: false }).limit(20000);
      const rows = data ?? [];

      const byDay: Record<string, number> = {};
      const visitorSet = new Set<string>();
      const sessionSet = new Set<string>();
      let pageviews = 0;
      const bucket = (obj: Record<string, number>, k?: string | null) => { if (k) obj[k] = (obj[k] ?? 0) + 1; };
      const byCountry: Record<string, number> = {};
      const byDevice: Record<string, number> = {};
      const byChannel: Record<string, number> = {};
      const byBrowser: Record<string, number> = {};
      const byOs: Record<string, number> = {};
      const byPage: Record<string, number> = {};
      const byRef: Record<string, number> = {};

      for (const r of rows) {
        const d = format(new Date(r.ts), "MMM d");
        byDay[d] = (byDay[d] ?? 0) + 1;
        if (r.visitor_id) visitorSet.add(r.visitor_id);
        if (r.session_id) sessionSet.add(r.session_id);
        if (r.event_type === "pageview") pageviews++;
        bucket(byCountry, r.country);
        bucket(byDevice, r.device);
        bucket(byChannel, r.channel);
        bucket(byBrowser, r.browser);
        bucket(byOs, r.os);
        bucket(byPage, r.page);
        if (r.referrer) {
          try { bucket(byRef, new URL(r.referrer).hostname.replace(/^www\./, "")); } catch { bucket(byRef, r.referrer); }
        }
      }

      const toArr = (o: Record<string, number>, n = 10) =>
        Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, value]) => ({ name, value }));

      setDaily(Object.entries(byDay).reverse().map(([day, count]) => ({ day, count })));
      setCountries(toArr(byCountry));
      setDevices(toArr(byDevice));
      setChannels(toArr(byChannel));
      setBrowsers(toArr(byBrowser));
      setOses(toArr(byOs));
      setTopPages(toArr(byPage, 15));
      setReferrers(toArr(byRef, 10));
      setTotals({ events: rows.length, visitors: visitorSet.size, pageviews, sessions: sessionSet.size });
      setLoading(false);
    })();
  }, [days]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Traffic analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">{loading ? "Loading…" : `Last ${days} days`}</p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Pageviews" value={totals.pageviews} />
        <StatCard label="Unique visitors" value={totals.visitors} />
        <StatCard label="Sessions" value={totals.sessions} />
        <StatCard label="Total events" value={totals.events} />
      </div>

      {totals.events === 0 && !loading && (
        <Card className="bg-admin-surface border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No events tracked yet. The tracker is now active — visit any public page to start collecting data.
          </CardContent>
        </Card>
      )}

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Events over time</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer><LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1a365d" strokeWidth={2} />
          </LineChart></ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Top countries</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><BarChart data={countries} layout="vertical">
              <XAxis type="number" /><YAxis dataKey="name" type="category" width={80} /><Tooltip />
              <Bar dataKey="value" fill="#c9a84c" />
            </BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Devices</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><PieChart>
              <Pie data={devices} dataKey="value" nameKey="name" outerRadius={90} label>
                {devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Legend /><Tooltip />
            </PieChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Browsers</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><BarChart data={browsers}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="value" fill="#2dd4bf" />
            </BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Operating systems</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><BarChart data={oses}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="value" fill="#a78bfa" />
            </BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Channels</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer><BarChart data={channels}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
            <Bar dataKey="value" fill="#1a365d" />
          </BarChart></ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Top pages</CardTitle></CardHeader>
          <CardContent className="p-0 divide-y max-h-96 overflow-auto">
            {topPages.length === 0 ? <div className="p-6 text-center text-muted-foreground text-sm">No data.</div> :
              topPages.map((p, i) => (
                <div key={p.name} className="p-3 flex items-center gap-3 text-sm">
                  <div className="w-6 text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 truncate font-mono text-xs">{p.name}</div>
                  <div className="font-semibold">{p.value.toLocaleString()}</div>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Top referrers</CardTitle></CardHeader>
          <CardContent className="p-0 divide-y max-h-96 overflow-auto">
            {referrers.length === 0 ? <div className="p-6 text-center text-muted-foreground text-sm">No referrers yet.</div> :
              referrers.map((p, i) => (
                <div key={p.name} className="p-3 flex items-center gap-3 text-sm">
                  <div className="w-6 text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 truncate">{p.name}</div>
                  <div className="font-semibold">{p.value.toLocaleString()}</div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="bg-admin-surface"><CardContent className="p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-1">{value.toLocaleString()}</div>
    </CardContent></Card>
  );
}
