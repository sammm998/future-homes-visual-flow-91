import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingUp,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const sentColor = (s: string) =>
  s === "positive" ? "text-green-600" : s === "negative" ? "text-red-600" : "text-amber-600";
const sentBadge = (s: string) =>
  s === "positive"
    ? "bg-green-100 text-green-700"
    : s === "negative"
    ? "bg-red-100 text-red-700"
    : "bg-amber-100 text-amber-700";

export default function SocialListening() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [competitors, setCompetitors] = useState("");
  const [focus, setFocus] = useState("");
  const [mentions, setMentions] = useState("");

  const run = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("social-listening", {
        body: {
          brand: "Future Homes International",
          competitors: competitors.split(",").map((c) => c.trim()).filter(Boolean),
          mentions: mentions.split("\n").map((m) => m.trim()).filter(Boolean),
          focus,
        },
      });
      if (error) throw error;
      setReport(data.report);
    } catch (e) {
      console.error(e);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const s = report?.sentiment || { positive: 0, neutral: 0, negative: 0 };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Social listening & diagnostics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyse what people say about Future Homes — sentiment, mentioners, competitors and recommendations.
          </p>
        </div>
        <Button onClick={run} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Radar className="h-4 w-4 mr-1.5" />}
          Run analysis
        </Button>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-4 grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-muted-foreground">Competitors (comma separated)</label>
            <Input
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              placeholder="Antalya Homes, Tekce, …"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Focus area</label>
            <Input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g. customer service, Dubai launch"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Paste real mentions (one per line, optional)</label>
            <Textarea
              value={mentions}
              onChange={(e) => setMentions(e.target.value)}
              rows={1}
              className="mt-1"
              placeholder="Reviews, comments, tweets…"
            />
          </div>
        </CardContent>
      </Card>

      {!report && !loading && (
        <Card className="bg-admin-surface">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Radar className="h-8 w-8 mx-auto mb-3 opacity-50" />
            Run an analysis to generate the social listening report.
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground p-12">
          <Loader2 className="h-5 w-5 animate-spin" /> Analysing brand mentions…
        </div>
      )}

      {report && !loading && (
        <div className="space-y-5">
          <Card className="bg-admin-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Executive summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{report.summary}</CardContent>
          </Card>

          {/* sentiment */}
          <div className="grid gap-3 sm:grid-cols-4">
            <SentCard icon={ThumbsUp} label="Positive" value={s.positive} color="text-green-600" bar="bg-green-500" />
            <SentCard icon={Minus} label="Neutral" value={s.neutral} color="text-amber-600" bar="bg-amber-500" />
            <SentCard icon={ThumbsDown} label="Negative" value={s.negative} color="text-red-600" bar="bg-red-500" />
            <Card className="bg-admin-surface">
              <CardContent className="p-4 flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-admin-accent" />
                <div>
                  <div className="text-sm font-semibold capitalize">{report.sentiment_trend || "—"}</div>
                  <div className="text-xs text-muted-foreground">Trend</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base">Recent mentions</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-[360px] overflow-auto">
                {(report.mentions || []).map((m: any, i: number) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: "currentColor" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{m.author}</span>
                      <Badge variant="secondary" className="text-[10px]">{m.source}</Badge>
                      <Badge className={`text-[10px] ${sentBadge(m.sentiment)}`}>{m.sentiment}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{m.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Top mentioners</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(report.top_mentioners || []).map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b pb-1.5">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.reach}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="text-xs font-medium mb-1 text-muted-foreground">Themes</div>
                  {(report.themes || []).map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-0.5">
                      <span className={sentColor(t.sentiment)}>●</span>
                      <span className="font-medium">{t.theme}</span>
                      <span className="text-xs text-muted-foreground truncate">— {t.note}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Competitor comparison</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {(report.competitors || []).map((c: any, i: number) => (
                <div key={i} className="rounded-md border p-3">
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.perception}</div>
                  <div className="text-xs mt-2 text-admin-accent">Opportunity: {c.gap}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="bg-admin-surface">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Business tips</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {(report.business_tips || []).map((t: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-admin-accent">→</span>{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
          </div>
        </div>
      )}
    </div>
  );
}

function SentCard({ icon: Icon, label, value, color, bar }: any) {
  return (
    <Card className="bg-admin-surface">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm font-medium">{label}</span>
          <span className={`ml-auto font-semibold ${color}`}>{value}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted mt-2 overflow-hidden">
          <div className={`h-full ${bar}`} style={{ width: `${value}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
