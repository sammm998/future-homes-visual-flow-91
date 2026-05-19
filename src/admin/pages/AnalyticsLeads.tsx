import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";

const COLORS = ["#1a365d", "#c9a84c", "#2dd4bf", "#a78bfa", "#f97316", "#ef4444"];

export default function AnalyticsLeads() {
  const [byStatus, setByStatus] = useState<any[]>([]);
  const [bySource, setBySource] = useState<any[]>([]);
  const [daily, setDaily] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const since = subDays(new Date(), 30).toISOString();
      const { data } = await supabase.from("leads").select("status,source,created_at").gte("created_at", since);
      const rows = data ?? [];
      const s: Record<string, number> = {}, src: Record<string, number> = {}, d: Record<string, number> = {};
      for (const r of rows) {
        s[r.status] = (s[r.status] ?? 0) + 1;
        const so = r.source ?? "unknown";
        src[so] = (src[so] ?? 0) + 1;
        const k = format(new Date(r.created_at), "MMM d");
        d[k] = (d[k] ?? 0) + 1;
      }
      setByStatus(Object.entries(s).map(([name, value]) => ({ name, value })));
      setBySource(Object.entries(src).map(([name, value]) => ({ name, value })));
      setDaily(Object.entries(d).map(([day, count]) => ({ day, count })));
      setTotal(rows.length);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Lead analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} leads in last 30 days</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">By status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Legend /><Tooltip />
            </PieChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface">
          <CardHeader><CardTitle className="text-base">By source</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><BarChart data={bySource}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="value" fill="#c9a84c" />
            </BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Leads per day</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer><BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip />
            <Bar dataKey="count" fill="#1a365d" />
          </BarChart></ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
