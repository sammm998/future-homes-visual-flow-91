import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsProperties() {
  const { t } = useAdminT();
  const [top, setTop] = useState<any[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_top_properties", { days_back: days, top_n: 20 });
      if (error || !data) {
        console.error("get_top_properties failed", error);
        setTop([]);
        setLoading(false);
        return;
      }
      setTop((data as any[]).map((p) => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: p.price,
        views: Number(p.views),
      })));
      setLoading(false);
    })();
  }, [days]);


  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Property analytics")}</h1>
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
        <CardHeader><CardTitle className="text-base">{t("Top 20 properties")}</CardTitle></CardHeader>
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
