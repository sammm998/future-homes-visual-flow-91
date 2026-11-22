import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AGENTS } from "@/admin/agents/agents";
import { connectIntegration, listIntegrations } from "@/admin/agents/agent.functions";

type Row = { slug: string; name: string; logo: string | null; description: string; connected: boolean; status: string | null };

export default function Integrations() {
  const list = useServerFn(listIntegrations);
  const connect = useServerFn(connectIntegration);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (q: string, cursor: string | null) => {
    setLoading(true); setError(null);
    try {
      const r = await list({ data: { search: q, cursor } });
      setRows((prev) => (cursor ? [...prev, ...r.items] : r.items)); setNext(r.next); setTotal(r.total);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [list]);
  useEffect(() => { const t = setTimeout(() => void load(search, null), 300); return () => clearTimeout(t); }, [search, load]);

  const onConnect = async (slug: string) => {
    try {
      const { url } = await connect({ data: { toolkit: slug, callbackUrl: `${window.location.origin}/admin/integrations` } });
      window.open(url, "_blank", "noopener");
      toast.message("Finish the sign-in in the new tab, then press Refresh.");
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-sm text-muted-foreground">Connect your own apps. Agents only use the apps you have connected on your account.</p>
      </div>
      <div className="grid gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6">
        {AGENTS.map((a) => <div key={a.id} className="rounded-md border p-2"><div className="font-medium">{a.name}</div><div className="text-muted-foreground">{a.toolkits ? a.toolkits.join(", ") : "All connected apps"}</div></div>)}
      </div>
      <div className="flex gap-2">
        <Input placeholder={`Search ${total || ""} apps…`} value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search apps" />
        <Button variant="outline" onClick={() => load(search, null)} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((r) => (
          <Card key={r.slug}><CardContent className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center gap-2">
              {r.logo && <img src={r.logo} alt="" className="h-7 w-7 rounded" loading="lazy" />}
              <div className="font-medium">{r.name}</div>
              {r.connected && <Badge className="ml-auto">Connected</Badge>}
            </div>
            <p className="line-clamp-2 flex-1 text-xs text-muted-foreground">{r.description}</p>
            <Button size="sm" variant={r.connected ? "outline" : "default"} onClick={() => onConnect(r.slug)}>{r.connected ? "Reconnect" : "Connect"}</Button>
          </CardContent></Card>
        ))}
      </div>
      {loading && <Loader2 className="mx-auto h-5 w-5 animate-spin" />}
      {next && !loading && <div className="text-center"><Button variant="outline" onClick={() => load(search, next)}>Load more</Button></div>}
    </div>
  );
}
