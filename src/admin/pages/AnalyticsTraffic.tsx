import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

const COLORS = ["#1a365d", "#c9a84c", "#2dd4bf", "#a78bfa", "#f97316", "#ef4444", "#10b981", "#3b82f6"];

export default function AnalyticsTraffic() {
  const { t } = useAdminT();
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
      const { data, error } = await supabase.rpc("get_traffic_summary", { days_back: days });

      if (error || !data) {
        console.error("get_traffic_summary failed", error);
        setDaily([]); setCountries([]); setDevices([]); setChannels([]);
        setBrowsers([]); setOses([]); setTopPages([]); setReferrers([]);
        setTotals({ events: 0, visitors: 0, pageviews: 0, sessions: 0 });
        setLoading(false);
        return;
      }

      const summary = data as any;

      const classify = (referrer: string | null, channel: string | null): string => {
        const host = (() => {
          if (!referrer) return "";
          try { return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; }
        })();
        if (host) {
          if (/(^|\.)google\./.test(host)) return "Organic Google";
          if (/(^|\.)bing\./.test(host)) return "Organic Bing";
          if (/(^|\.)duckduckgo\./.test(host)) return "Organic DuckDuckGo";
          if (/(^|\.)yahoo\./.test(host)) return "Organic Yahoo";
          if (/(^|\.)yandex\./.test(host)) return "Organic Yandex";
          if (/(^|\.)baidu\./.test(host)) return "Organic Baidu";
          if (/(^|\.)ecosia\./.test(host)) return "Organic Ecosia";
          if (/instagram\.com/.test(host)) return "Instagram";
          if (/tiktok\.com/.test(host)) return "TikTok";
          if (/facebook\.com|fb\.com|m\.facebook/.test(host)) return "Facebook";
          if (/(^|\.)t\.co$|twitter\.com|x\.com/.test(host)) return "X / Twitter";
          if (/linkedin\.com|lnkd\.in/.test(host)) return "LinkedIn";
          if (/youtube\.com|youtu\.be/.test(host)) return "YouTube";
          if (/pinterest\.com|pin\.it/.test(host)) return "Pinterest";
          if (/reddit\.com/.test(host)) return "Reddit";
          if (/whatsapp\.com|wa\.me/.test(host)) return "WhatsApp";
          if (/t\.me|telegram\./.test(host)) return "Telegram";
          if (/snapchat\.com/.test(host)) return "Snapchat";
          if (/threads\.net/.test(host)) return "Threads";
          if (/discord\.com|discord\.gg/.test(host)) return "Discord";
          if (/mail\.google|outlook\.live|mail\.yahoo|gmail/.test(host)) return "Email";
          try {
            const self = location.hostname.replace(/^www\./, "");
            if (host.includes(self) || host.includes("lovable")) return "Internal";
          } catch {}
          return `Referral · ${host}`;
        }
        if (channel) {
          const c = channel.toLowerCase();
          if (c === "direct") return "Direct";
          if (c === "internal") return "Internal";
          if (c === "organic") return "Organic search";
          if (c === "social") return "Social";
          if (c === "referral") return "Referral";
          return c.charAt(0).toUpperCase() + c.slice(1);
        }
        return "Direct";
      };

      // Merge server-side channel_raw rows through the referrer classifier.
      const byChannel: Record<string, number> = {};
      const byRef: Record<string, number> = {};
      for (const cr of (summary.channel_raw || []) as any[]) {
        const key = classify(cr.referrer, cr.channel);
        byChannel[key] = (byChannel[key] ?? 0) + Number(cr.value);
      }
      for (const rf of (summary.referrers || []) as any[]) {
        let host = rf.name as string;
        try { host = new URL(rf.name).hostname.replace(/^www\./, ""); } catch {}
        byRef[host] = (byRef[host] ?? 0) + Number(rf.value);
      }

      const toArr = (o: Record<string, number>, n = 10) =>
        Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, value]) => ({ name, value }));

      setDaily(((summary.daily || []) as any[]).map((row) => ({
        day: format(new Date(row.day), "MMM d"),
        count: Number(row.count),
      })));
      setCountries(((summary.countries || []) as any[]).map((r) => ({ name: r.name, value: Number(r.value) })));
      setDevices(((summary.devices || []) as any[]).map((r) => ({ name: r.name, value: Number(r.value) })));
      setChannels(toArr(byChannel, 15));
      setBrowsers(((summary.browsers || []) as any[]).map((r) => ({ name: r.name, value: Number(r.value) })));
      setOses(((summary.oses || []) as any[]).map((r) => ({ name: r.name, value: Number(r.value) })));
      setTopPages(((summary.pages || []) as any[]).map((r) => ({ name: r.name, value: Number(r.value) })));
      setReferrers(toArr(byRef, 10));
      const t = summary.totals || {};
      setTotals({ events: Number(t.events || 0), visitors: Number(t.visitors || 0), pageviews: Number(t.pageviews || 0), sessions: Number(t.sessions || 0) });
      setLoading(false);

    })();
  }, [days]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Traffic analytics")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{loading ? `${t("Loading")}…` : `${t("Last")} ${days} ${t("days")}`}</p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t("Last 24 hours")}</SelectItem>
            <SelectItem value="7">{t("Last 7 days")}</SelectItem>
            <SelectItem value="30">{t("Last 30 days")}</SelectItem>
            <SelectItem value="90">{t("Last 90 days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label={t("Pageviews")} value={totals.pageviews} />
        <StatCard label={t("Unique visitors")} value={totals.visitors} />
        <StatCard label={t("Sessions")} value={totals.sessions} />
        <StatCard label={t("Total events")} value={totals.events} />
      </div>

      {totals.events === 0 && !loading && (
        <Card className="bg-admin-surface border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            {t("No events tracked yet. The tracker is now active — visit any public page to start collecting data.")}
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
        <CardContent style={{ height: Math.max(260, channels.length * 32 + 40) }}>
          <ResponsiveContainer><BarChart data={channels} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={170} tick={{ fontSize: 12 }} /><Tooltip />
            <Bar dataKey="value" fill="#1a365d" radius={[0, 4, 4, 0]} />
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
