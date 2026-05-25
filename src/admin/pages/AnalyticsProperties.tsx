import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays } from "date-fns";
import { PATH_TO_LANG } from "@/utils/slugHelpers";

const SLUG_COLUMNS = [
  "slug", "slug_sv", "slug_tr", "slug_ar", "slug_ru", "slug_no", "slug_da",
  "slug_fa", "slug_ur", "slug_es", "slug_de", "slug_fr", "slug_id",
];

// Extract a property slug from a tracked URL path. Supports all translated
// path segments (/property, /fastighet, /mulk, /propiedad, /immobilie, ...).
function extractSlug(rawPath: string | null): string | null {
  if (!rawPath) return null;
  try {
    const path = rawPath.split("?")[0].split("#")[0];
    const parts = path.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const segment = parts[0].toLowerCase();
    // Accept any localized property path segment.
    if (!(segment in PATH_TO_LANG)) return null;
    return decodeURIComponent(parts[1]);
  } catch {
    return null;
  }
}

export default function AnalyticsProperties() {
  const [top, setTop] = useState<any[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = subDays(new Date(), days).toISOString();

      // 1. Pull all property pageview events (paginated).
      const PAGE = 1000;
      const events: { page: string }[] = [];
      for (let from = 0; from < 200000; from += PAGE) {
        const { data, error } = await supabase
          .from("analytics_events")
          .select("page")
          .eq("event_type", "pageview")
          .gte("ts", since)
          .order("ts", { ascending: false })
          .range(from, from + PAGE - 1);
        if (error || !data || data.length === 0) break;
        events.push(...(data as any));
        if (data.length < PAGE) break;
      }

      // 2. Count views per slug.
      const slugCounts = new Map<string, number>();
      for (const e of events) {
        const slug = extractSlug(e.page);
        if (slug) slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
      }

      const allSlugs = Array.from(slugCounts.keys());
      if (allSlugs.length === 0) {
        setTop([]);
        setLoading(false);
        return;
      }

      // 3. Match slugs against properties (any language column).
      const orFilter = SLUG_COLUMNS.flatMap((c) =>
        allSlugs.map((s) => `${c}.eq.${s.replace(/,/g, "")}`),
      ).join(",");

      const { data: props } = await supabase
        .from("properties")
        .select(`id,title,location,price,${SLUG_COLUMNS.join(",")}`)
        .or(orFilter)
        .limit(2000);

      // 4. Sum views per property across all its language slugs.
      const ranked = (props ?? []).map((p: any) => {
        let views = 0;
        for (const c of SLUG_COLUMNS) {
          const s = p[c];
          if (s && slugCounts.has(s)) views += slugCounts.get(s)!;
        }
        return { id: p.id, title: p.title, location: p.location, price: p.price, views };
      });

      ranked.sort((a, b) => b.views - a.views);
      setTop(ranked.slice(0, 20));
      setLoading(false);
    })();
  }, [days]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Property analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "Loading…" : `Top viewed listings · last ${days} days`}
          </p>
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
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Top 20 properties</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y">
          {top.map((p, i) => (
            <div key={p.id} className="p-4 flex items-center gap-3">
              <div className="w-6 text-muted-foreground text-sm">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.location} · {p.price}</div>
              </div>
              <div className="text-sm font-semibold">{p.views.toLocaleString()} views</div>
            </div>
          ))}
          {top.length === 0 && !loading && (
            <div className="p-8 text-center text-muted-foreground">No property views tracked in this period.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
