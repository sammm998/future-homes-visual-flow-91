import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/legacy/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ExternalLink, Search, Sparkles, Link2 } from "lucide-react";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import { seoBacklinks, backlinkHost, SEO_BACKLINK_REPORT_DATE, type BacklinkCategory } from "@/data/seoBacklinks";

const SEARCH_ENGINES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\./, "Bing"],
  [/(^|\.)duckduckgo\./, "DuckDuckGo"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(^|\.)yandex\./, "Yandex"],
  [/(^|\.)baidu\./, "Baidu"],
  [/(^|\.)ecosia\./, "Ecosia"],
  [/(^|\.)brave\./, "Brave Search"],
];

const LLM_SOURCES: [RegExp, string][] = [
  [/chatgpt\.com|chat\.openai\.com|openai\.com/, "ChatGPT"],
  [/perplexity\.ai/, "Perplexity"],
  [/gemini\.google\.com|bard\.google\.com/, "Gemini"],
  [/claude\.ai|anthropic\.com/, "Claude"],
  [/copilot\.microsoft\.com|bing\.com\/chat/, "Copilot"],
  [/you\.com/, "You.com"],
  [/deepseek\.com/, "DeepSeek"],
  [/grok\.com|x\.ai/, "Grok"],
  [/mistral\.ai|lechat/, "Le Chat"],
  [/poe\.com/, "Poe"],
  [/phind\.com/, "Phind"],
];

function hostOf(referrer: string | null) {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export default function SeoOverview() {
  const { t } = useAdminT();
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [organic, setOrganic] = useState<{ name: string; value: number }[]>([]);
  const [llm, setLlm] = useState<{ name: string; value: number }[]>([]);
  const [referral, setReferral] = useState<{ name: string; value: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [topPages, setTopPages] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_traffic_summary", { days_back: days });
      if (error || !data) {
        setOrganic([]); setLlm([]); setReferral([]); setTotal(0); setTopPages([]);
        setLoading(false);
        return;
      }
      const summary = data as any;
      const o: Record<string, number> = {};
      const l: Record<string, number> = {};
      const r: Record<string, number> = {};

      for (const row of (summary.channel_raw || []) as any[]) {
        const host = hostOf(row.referrer);
        const value = Number(row.value) || 0;
        if (!host) {
          if ((row.channel || "").toLowerCase() === "organic") o["Organic search"] = (o["Organic search"] ?? 0) + value;
          continue;
        }
        const llmMatch = LLM_SOURCES.find(([re]) => re.test(host));
        if (llmMatch) { l[llmMatch[1]] = (l[llmMatch[1]] ?? 0) + value; continue; }
        const seMatch = SEARCH_ENGINES.find(([re]) => re.test(host));
        if (seMatch) { o[seMatch[1]] = (o[seMatch[1]] ?? 0) + value; continue; }
        try {
          const self = location.hostname.replace(/^www\./, "");
          if (host.includes(self) || host.includes("lovable")) continue;
        } catch { /* noop */ }
        r[host] = (r[host] ?? 0) + value;
      }

      const toArr = (obj: Record<string, number>, n = 12) =>
        Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, value]) => ({ name, value }));

      setOrganic(toArr(o));
      setLlm(toArr(l));
      setReferral(toArr(r));
      setTotal(Number(summary.totals?.pageviews || 0));
      setTopPages(((summary.pages || []) as any[]).slice(0, 12).map((p) => ({ name: p.name, value: Number(p.value) })));
      setLoading(false);
    })();
  }, [days]);

  const organicTotal = organic.reduce((s, x) => s + x.value, 0);
  const llmTotal = llm.reduce((s, x) => s + x.value, 0);
  const referralTotal = referral.reduce((s, x) => s + x.value, 0);

  const grouped = useMemo(() => {
    const map = new Map<BacklinkCategory, typeof seoBacklinks>();
    for (const b of seoBacklinks) {
      const list = map.get(b.category) ?? [];
      list.push(b);
      map.set(b.category, list);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("SEO")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? `${t("Loading")}…` : `${t("Last")} ${days} ${t("days")}`}
          </p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t("Last 7 days")}</SelectItem>
            <SelectItem value="30">{t("Last 30 days")}</SelectItem>
            <SelectItem value="90">{t("Last 90 days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard icon={<Search className="h-4 w-4" />} label={t("Organic visits")} value={organicTotal} />
        <StatCard icon={<Sparkles className="h-4 w-4" />} label={t("AI / LLM visits")} value={llmTotal} />
        <StatCard icon={<Link2 className="h-4 w-4" />} label={t("Referral visits")} value={referralTotal} />
        <StatCard icon={<Link2 className="h-4 w-4" />} label={t("Backlinks")} value={seoBacklinks.length} />
      </div>

      <Tabs defaultValue="traffic">
        <TabsList>
          <TabsTrigger value="traffic">{t("Traffic")}</TabsTrigger>
          <TabsTrigger value="llm">{t("AI / LLM")}</TabsTrigger>
          <TabsTrigger value="backlinks">{t("Backlinks")}</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4 pt-4">
          <ChartCard title={t("Organic search traffic")} data={organic} empty={t("No organic traffic recorded in this period")} />
          <ChartCard title={t("Referral traffic")} data={referral} empty={t("No referral traffic recorded in this period")} />
          <Card>
            <CardHeader><CardTitle className="text-base">{t("Top pages")}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {topPages.length === 0 && <p className="text-sm text-muted-foreground">{t("No data")}</p>}
              {topPages.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm border-b border-border/50 pb-1">
                  <span className="truncate mr-4">{p.name}</span>
                  <span className="font-medium tabular-nums">{p.value}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">{t("Total pageviews")}: {total}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4 pt-4">
          <ChartCard
            title={t("Traffic from AI models (ChatGPT, Perplexity, Gemini, Claude…)")}
            data={llm}
            empty={t("No AI/LLM referrals recorded in this period")}
          />
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            {t("Off-page report")} · {SEO_BACKLINK_REPORT_DATE} · {seoBacklinks.length} {t("links")}
          </p>
          {grouped.map(([category, links]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {t(category)} <Badge variant="secondary">{links.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {links.map((b) => (
                  <div key={b.url} className="flex flex-wrap items-center justify-between gap-2 text-sm border-b border-border/50 pb-2">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium hover:underline truncate max-w-[55%]"
                    >
                      {backlinkHost(b.url)} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    <span className="text-muted-foreground truncate max-w-[30%]">
                      {b.target.replace("https://futurehomesinternational.com", "") || "/"}
                    </span>
                    <Badge variant={b.status === "Approved" ? "default" : "secondary"}>{t(b.status)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, data, empty }: { title: string; data: { name: string; value: number }[]; empty: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#c9a84c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
