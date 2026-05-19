import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SubscribersList() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [email, setEmail] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("newsletter_subscriptions").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!email.includes("@")) return toast.error("Valid email required");
    const { error } = await supabase.from("newsletter_subscriptions").insert({ email, source: "admin" });
    if (error) return toast.error(error.message);
    setEmail("");
    toast.success("Added");
    load();
  };

  const exportCsv = () => {
    if (!rows) return;
    const csv = ["email,source,is_active,subscribed_at",
      ...rows.map((r) => `${r.email},${r.source ?? ""},${r.is_active},${r.subscribed_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground text-sm mt-1">{rows?.length ?? 0} total</p>
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-4 flex gap-2">
          <Input placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={add}><Plus className="h-4 w-4 mr-2" /> Add</Button>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardContent className="p-0 divide-y">
          {!rows ? <div className="p-8 text-center text-muted-foreground">Loading…</div> :
            rows.length === 0 ? <div className="p-8 text-center text-muted-foreground">No subscribers.</div> :
            rows.map((r) => (
              <div key={r.id} className="p-4 flex items-center gap-3">
                <div className="flex-1 truncate">{r.email}</div>
                <Badge variant={r.is_active ? "default" : "secondary"}>{r.is_active ? "Active" : "Inactive"}</Badge>
                {r.source && <Badge variant="outline">{r.source}</Badge>}
                <span className="text-xs text-muted-foreground">{format(new Date(r.subscribed_at), "PP")}</span>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
