import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AnalyticsRealtime() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("analytics_events")
        .select("id,event_type,page,country,device,channel,ts")
        .order("ts", { ascending: false }).limit(50);
      setEvents(data ?? []);
    };
    load();
    const ch = supabase.channel("rt-events")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "analytics_events" },
        (p) => setEvents((e) => [p.new as any, ...e].slice(0, 50)))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Realtime</h1>
        <p className="text-muted-foreground text-sm mt-1">Live event stream.</p>
      </div>
      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Last 50 events</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y max-h-[600px] overflow-auto">
          {events.length === 0 ? <div className="p-8 text-center text-muted-foreground">No events yet.</div> :
            events.map((e) => (
              <div key={e.id} className="p-3 flex items-center gap-3 text-sm">
                <Badge variant="outline">{e.event_type}</Badge>
                <span className="flex-1 truncate text-muted-foreground">{e.page ?? "—"}</span>
                <span className="text-xs">{e.country ?? ""} · {e.device ?? ""}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(e.ts), "HH:mm:ss")}</span>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
