import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  Users,
  Filter,
  Target,
  Lightbulb,
  Zap,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

const impactBadge = (i: string) =>
  i === "high"
    ? "bg-green-100 text-green-700"
    : i === "medium"
    ? "bg-amber-100 text-amber-700"
    : "bg-muted text-muted-foreground";

export default function AIInsights() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [raw, setRaw] = useState<any>(null);

  const run = async () => {
    setLoading(true);
    setReport(null);
    try {
      // Gather real analytics data (server-aggregated to stay fast)
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const [trafficRes, propsRes, leadsRes] = await Promise.all([
        supabase.rpc("get_traffic_summary", { days_back: days }),
        supabase.rpc("get_top_properties", { days_back: days, top_n: 20 }),
        supabase.from("leads").select("status,source").gte("created_at", since),
      ]);

      const traffic = trafficRes.data ?? {};
      const topProperties = propsRes.data ?? [];
      const leadRows = leadsRes.data ?? [];

      const byStatus: Record<string, number> = {};
      const bySource: Record<string, number> = {};
      for (const r of leadRows as any[]) {
        byStatus[r.status ?? "unknown"] = (byStatus[r.status ?? "unknown"] ?? 0) + 1;
        bySource[r.source ?? "unknown"] = (bySource[r.source ?? "unknown"] ?? 0) + 1;
      }

      const leads = {
        total: leadRows.length,
        byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
        bySource: Object.entries(bySource).map(([name, value]) => ({ name, value })),
      };

      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { days, traffic, topProperties, leads },
      });
      if (error) throw error;
      if (data?.error === "rate_limited") {
        toast.error("AI is rate-limited. Please try again in a moment.");
        return;
      }
      if (data?.error === "payment_required") {
        toast.error("AI credits exhausted. Add credits in workspace settings.");
        return;
      }
      if (data?.error) throw new Error(data.error);

      setReport(data.report);
      setRaw(data.raw);
    } catch (e) {
      console.error(e);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI insights & recommendations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI analyses your funnel, traffic and conversions from real data and writes prioritised recommendations.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={run} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
            Run analysis
          </Button>
        </div>
      </div>

      {raw && (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Kpi icon={Users} label="Visitors" value={raw.visitors?.toLocaleString()} />
          <Kpi icon={TrendingUp} label="Pageviews" value={raw.pageviews?.toLocaleString()} />
          <Kpi icon={Building2} label="Property views" value={raw.property_views?.toLocaleString()} />
          <Kpi icon={Target} label="Leads" value={raw.leads?.toLocaleString()} />
          <Kpi icon={Filter} label="Conversion" value={`${raw.conversion_rate_pct}%`} />
        </div>
      )}

      {!report && !loading && (
        <Card className="bg-admin-surface">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
            Run an analysis to generate AI recommendations from your traffic, funnel and conversion data.
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground p-12">
          <Loader2 className="h-5 w-5 animate-spin" /> Analysing funnel, traffic & conversions…
        </div>
      )}

      {report && !loading && (
        <div className="space-y-5">
          <Card className="bg-admin-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Executive summary</span>
                {typeof report.health_score === "number" && (
                  <span className="text-sm">
                    Health <span className="font-semibold text-admin-accent">{report.health_score}/100</span>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{report.summary}</CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="bg-admin-surface lg:col-span-2">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" /> Marketing funnel</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {(report.funnel || []).map((f: any, i: number) => (
                  <div key={i} className="border-l-2 border-admin-accent pl-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{f.stage}</span>
                      <span className="text-sm font-semibold">{Number(f.value ?? 0).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Conversion</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-2xl font-semibold text-admin-accent">{report.conversion?.rate_pct}%</div>
                <p className="text-muted-foreground">{report.conversion?.assessment}</p>
                {report.conversion?.biggest_leak && (
                  <p className="text-xs"><span className="font-medium">Biggest leak: </span>{report.conversion.biggest_leak}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Traffic insights</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {(report.traffic_insights || []).map((t: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-admin-accent">→</span>{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Property insights</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {(report.property_insights || []).map((t: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-admin-accent">→</span>{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Opportunities</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {(report.opportunities || []).map((o: any, i: number) => (
                <div key={i} className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{o.title}</span>
                    <Badge className={`text-[10px] ${impactBadge(o.impact)}`}>{o.impact} impact</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{o.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Recommendations</CardTitle></CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  {(report.recommendations || []).map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" /> Quick wins</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {(report.quick_wins || []).map((r: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-admin-accent">✓</span>{r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: any) {
  return (
    <Card className="bg-admin-surface">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Icon className="h-4 w-4" /> {label}
        </div>
        <div className="text-xl font-semibold mt-1">{value ?? "—"}</div>
      </CardContent>
    </Card>
  );
}
