import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CampaignsList() {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("email_campaigns").select("*").order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setRows(data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">Email campaigns and broadcasts.</p>
        </div>
        <Button asChild><Link to="/admin/email/campaigns/new"><Plus className="h-4 w-4 mr-2" /> New campaign</Link></Button>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-0 divide-y">
          {!rows ? <div className="p-8 text-center text-muted-foreground">Loading…</div> :
            rows.length === 0 ? <div className="p-8 text-center text-muted-foreground">No campaigns yet.</div> :
            rows.map((c) => (
              <div key={c.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{c.subject}</span>
                    <Badge variant={c.status === "sent" ? "default" : c.status === "scheduled" ? "secondary" : "outline"}>{c.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {c.from_name} · {c.recipient_count} recipients · {format(new Date(c.created_at), "PP")}
                  </div>
                </div>
                <Button asChild size="icon" variant="ghost">
                  <Link to={`/admin/email/campaigns/${c.id}`}><Pencil className="h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
