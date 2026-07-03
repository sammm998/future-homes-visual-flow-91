import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays } from "date-fns";

type Click = { page: string; x_pct: number; y_pct: number; tag: string | null };

export default function AnalyticsHeatmap() {
  const [days, setDays] = useState(30);
  const [pages, setPages] = useState<{ page: string; count: number }[]>([]);
  const [page, setPage] = useState<string>("");
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = subDays(new Date(), days).toISOString();
      const { data } = await supabase
        .from("heatmap_clicks")
        .select("page,x_pct,y_pct,tag")
        .gte("ts", since)
        .limit(20000);
      const rows = (data ?? []) as Click[];
      const counts: Record<string, number> = {};
      for (const r of rows) counts[r.page] = (counts[r.page] ?? 0) + 1;
      const sorted = Object.entries(counts)
        .map(([p, c]) => ({ page: p, count: c }))
        .sort((a, b) => b.count - a.count);
      setPages(sorted);
      const top = sorted[0]?.page || "";
      setPage((cur) => cur || top);
      setClicks(rows);
      setLoading(false);
    })();
  }, [days]);

  const filtered = useMemo(() => clicks.filter((c) => c.page === page), [clicks, page]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Heatmaps</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "Loading…" : `${clicks.length.toLocaleString()} clicks in last ${days} days across ${pages.length} pages`}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={page} onValueChange={setPage}>
            <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select page" /></SelectTrigger>
            <SelectContent className="max-h-80">
              {pages.map((p) => (
                <SelectItem key={p.page} value={p.page}>{p.page} · {p.count}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>

      <Card className="bg-admin-surface">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <span>Click heatmap · {page || "—"} · {filtered.length} clicks</span>
            {page && (
              <a
                href={page}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-normal text-muted-foreground hover:text-foreground underline"
              >
                Open page ↗
              </a>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full rounded-md border bg-muted/30 overflow-hidden" style={{ height: "78vh" }}>
            {!page ? (
              <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                Select a page to see how visitors navigate it.
              </div>
            ) : (
              <>
                <iframe
                  key={page}
                  src={page}
                  title={`Live preview of ${page}`}
                  className="absolute inset-0 w-full h-full bg-white"
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none">
                  {filtered.map((c, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        left: `${c.x_pct}%`,
                        top: `${c.y_pct}%`,
                        width: 36,
                        height: 36,
                        transform: "translate(-50%, -50%)",
                        background:
                          "radial-gradient(circle, rgba(239,68,68,0.7) 0%, rgba(239,68,68,0.25) 50%, rgba(239,68,68,0) 75%)",
                        mixBlendMode: "multiply",
                      }}
                    />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="absolute top-3 left-3 text-xs bg-background/90 border rounded px-2 py-1 text-muted-foreground">
                    No clicks recorded yet for this page.
                  </div>
                )}
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Live preview of the actual page with click hotspots overlaid. Pick another page from the list below to navigate the full visitor journey.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Top tracked pages</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y max-h-96 overflow-auto">
          {pages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No data yet.</div>
          ) : pages.slice(0, 25).map((p, i) => (
            <button
              key={p.page}
              onClick={() => setPage(p.page)}
              className={`w-full p-3 flex items-center gap-3 text-sm text-left hover:bg-muted/40 ${p.page === page ? "bg-muted/50" : ""}`}
            >
              <div className="w-6 text-muted-foreground">{i + 1}</div>
              <div className="flex-1 truncate font-mono text-xs">{p.page}</div>
              <div className="font-semibold">{p.count.toLocaleString()}</div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
