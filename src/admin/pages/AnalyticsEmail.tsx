import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsEmail() {
  const [stats, setStats] = useState({ campaigns: 0, sent: 0, opens: 0, clicks: 0, subscribers: 0 });
  useEffect(() => {
    (async () => {
      const [{ data: campaigns }, { data: recipients }, { count: subs }] = await Promise.all([
        supabase.from("email_campaigns").select("recipient_count,status"),
        supabase.from("campaign_recipients").select("opened_at,clicked_at"),
        supabase.from("newsletter_subscriptions").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        campaigns: campaigns?.length ?? 0,
        sent: campaigns?.filter((c) => c.status === "sent").reduce((a, c) => a + (c.recipient_count ?? 0), 0) ?? 0,
        opens: recipients?.filter((r) => r.opened_at).length ?? 0,
        clicks: recipients?.filter((r) => r.clicked_at).length ?? 0,
        subscribers: subs ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Campaigns", value: stats.campaigns },
    { label: "Emails sent", value: stats.sent },
    { label: "Opens", value: stats.opens },
    { label: "Clicks", value: stats.clicks },
    { label: "Subscribers", value: stats.subscribers },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Email analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Overall performance.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-admin-surface"><CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
            <div className="text-3xl font-bold mt-1">{c.value.toLocaleString()}</div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
