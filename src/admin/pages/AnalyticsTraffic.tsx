import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format, subDays } from "date-fns";

const COLORS = ["#1a365d", "#c9a84c", "#2dd4bf", "#a78bfa", "#f97316", "#ef4444", "#10b981"];

export default function AnalyticsTraffic() {
  const [daily, setDaily] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [totals, setTotals] = useState({ events: 0, visitors: 0, pageviews: 0 });

  useEffect(() => {
    (async () => {
      const since = subDays(new Date(), 30).toISOString();
      const { data } = await supabase
        .from("analytics_events").select("event_type,ts,country,device,channel,visitor_id")
        .gte("ts", since).limit(10000);
      const rows = data ?? [];

      const byDay: Record<string, number> = {};
      const visitorSet = new Set<string>();
      let pageviews = 0;
      const byCountry: Record<string, number> = {};
      const byDevice: Record<string, number> = {};
      const byChannel: Record<string, number> = {};

      for (const r of rows) {
        const d = format(new Date(r.ts), "MMM d");
        byDay[d] = (byDay[d] ?? 0) + 1;
        if (r.visitor_id) visitorSet.add(r.visitor_id);
        if (r.event_type === "pageview") pageviews++;
        if (r.country) byCountry[r.country] = (byCountry[r.country] ?? 0) + 1;
        if (r.device) byDevice[r.device] = (byDevice[r.device] ?? 0) + 1;
        if (r.channel) byChannel[r.channel] = (byChannel[r.channel] ?? 0) + 1;
      }

      setDaily(Object.entries(byDay).map(([day, count]) => ({ day, count })));
      setCountries(Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value })));
      setDevices(Object.entries(byDevice).map(([name, value]) => ({ name, value })));
      setChannels(Object.entries(byChannel).map(([name, value]) => ({ name, value })));
      setTotals({ events: rows.length, visitors: visitorSet.size, pageviews });
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Traffic analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Last 30 days</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Events" value={totals.events} />
        <StatCard label="Unique visitors" value={totals.visitors} />
        <StatCard label="Pageviews" value={totals.pageviews} />
      </div>

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

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Channels</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer><BarChart data={channels}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
            <Bar dataKey="value" fill="#1a365d" />
          </BarChart></ResponsiveContainer>
        </CardContent>
      </Card>
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
