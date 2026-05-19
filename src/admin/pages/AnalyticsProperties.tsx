import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsProperties() {
  const [top, setTop] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("properties")
        .select("id,title,location,views_count,price")
        .order("views_count", { ascending: false }).limit(20);
      setTop(data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Property analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Top viewed listings.</p>
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
              <div className="text-sm font-semibold">{(p.views_count ?? 0).toLocaleString()} views</div>
            </div>
          ))}
          {top.length === 0 && <div className="p-8 text-center text-muted-foreground">No data.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
