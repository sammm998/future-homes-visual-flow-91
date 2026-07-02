import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subDays, format } from "date-fns";
import {
  Activity,
  MousePointerClick,
  Search,
  Users,
  ArrowRight,
  Monitor,
  Smartphone,
  Globe,
  Loader2,
} from "lucide-react";

interface Ev {
  id: number;
  event_type: string;
  page: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  channel: string | null;
  referrer: string | null;
  session_id: string | null;
  visitor_id: string | null;
  ts: string;
  payload: any;
}

interface Session {
  id: string;
  events: Ev[];
  start: string;
  device: string | null;
  country: string | null;
  channel: string | null;
  referrer: string | null;
}

export default function ActivityLogs() {
  const [days, setDays] = useState(7);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = subDays(new Date(), days).toISOString();
      // loop past the 1000-row limit
      const all: Ev[] = [];
      let from = 0;
      const step = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("analytics_events")
          .select(
            "id,event_type,page,country,city,device,browser,os,channel,referrer,session_id,visitor_id,ts,payload"
          )
          .gte("ts", since)
          .order("ts", { ascending: false })
          .range(from, from + step - 1);
        if (error || !data || data.length === 0) break;
        all.push(...(data as Ev[]));
        if (data.length < step || all.length >= 8000) break;
        from += step;
      }
      setEvents(all);
      setLoading(false);
    })();
  }, [days]);

  const sessions = useMemo<Session[]>(() => {
    const map = new Map<string, Ev[]>();
    for (const e of events) {
      const key = e.session_id || e.visitor_id || `anon_${e.id}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    const list: Session[] = [];
    map.forEach((evs, id) => {
      const ordered = [...evs].sort((a, b) => +new Date(a.ts) - +new Date(b.ts));
      const f = ordered[0];
      list.push({
        id,
        events: ordered,
        start: f.ts,
        device: f.device,
        country: f.country,
        channel: f.channel,
        referrer: f.referrer,
      });
    });
    return list.sort((a, b) => +new Date(b.start) - +new Date(a.start));
  }, [events]);

  const filtered = sessions.filter((s) => {
    if (!q) return true;
    const hay = (
      s.id +
      " " +
      (s.country || "") +
      " " +
      (s.channel || "") +
      " " +
      s.events.map((e) => `${e.event_type} ${e.page}`).join(" ")
    ).toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const stats = useMemo(() => {
    const pv = events.filter((e) => e.event_type === "pageview").length;
    const clicks = events.filter((e) => e.event_type.includes("click")).length;
    return { total: events.length, sessions: sessions.length, pv, clicks };
  }, [events, sessions]);

  const detail = sessions.find((s) => s.id === selected) || null;

  const Dev = ({ d }: { d: string | null }) =>
    d === "mobile" ? (
      <Smartphone className="h-3.5 w-3.5" />
    ) : (
      <Monitor className="h-3.5 w-3.5" />
    );

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activity logs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading
              ? "Loading…"
              : `Track exactly how visitors navigate the site — ${stats.sessions} sessions, ${stats.total.toLocaleString()} events.`}
          </p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat icon={Users} label="Sessions" value={stats.sessions} />
        <Stat icon={Activity} label="Events" value={stats.total} />
        <Stat icon={Globe} label="Pageviews" value={stats.pv} />
        <Stat icon={MousePointerClick} label="Clicks" value={stats.clicks} />
      </div>

      <div className="grid grid-cols-[1fr_1.3fr] gap-4 max-lg:grid-cols-1">
        <Card className="bg-admin-surface">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search sessions, pages, countries…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y max-h-[600px] overflow-auto">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No sessions.</div>
            ) : (
              filtered.slice(0, 200).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`w-full text-left p-3 hover:bg-muted flex items-center gap-3 ${
                    selected === s.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="text-muted-foreground">
                    <Dev d={s.device} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {s.country || "Unknown"} · {s.channel || "direct"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {s.events.length} events · {format(new Date(s.start), "d MMM HH:mm")}
                    </div>
                  </div>
                  <Badge variant="outline">{s.events.length}</Badge>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-admin-surface">
          <CardHeader>
            <CardTitle className="text-base">
              {detail ? "Session journey" : "Select a session"}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-auto">
            {!detail ? (
              <div className="text-sm text-muted-foreground py-10 text-center">
                Pick a session to see the exact navigation path.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Info label="Device" value={`${detail.device || "—"}`} />
                  <Info label="Location" value={detail.country || "—"} />
                  <Info label="Channel" value={detail.channel || "direct"} />
                  <Info label="Referrer" value={detail.referrer || "—"} />
                </div>
                <div className="relative pl-4 border-l-2 border-muted space-y-3">
                  {detail.events.map((e) => (
                    <div key={e.id} className="relative">
                      <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-admin-accent" />
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">
                          {e.event_type}
                        </Badge>
                        <span className="text-sm truncate max-w-[280px]">{e.page || "—"}</span>
                        <span className="text-[11px] text-muted-foreground ml-auto">
                          {format(new Date(e.ts), "HH:mm:ss")}
                        </span>
                      </div>
                      {e.payload && Object.keys(e.payload).length > 0 && (
                        <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {JSON.stringify(e.payload)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card className="bg-admin-surface">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-admin-accent/15 text-admin-accent grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xl font-semibold">{value.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded p-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium truncate">{value}</div>
    </div>
  );
}
