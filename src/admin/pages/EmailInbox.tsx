import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface Conv {
  id: string;
  session_id: string;
  conversation_data: any;
  message_count: number;
  created_at: string;
  contact_collected: boolean;
}

export default function EmailInbox() {
  const [rows, setRows] = useState<Conv[] | null>(null);
  const [selected, setSelected] = useState<Conv | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("id,session_id,conversation_data,message_count,created_at,contact_collected")
        .order("created_at", { ascending: false }).limit(200);
      if (error) toast.error(error.message);
      setRows((data as Conv[]) ?? []);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">Conversations & inquiries from the site.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 min-h-[500px]">
        <Card className="bg-admin-surface lg:col-span-1">
          <CardContent className="p-0 divide-y max-h-[700px] overflow-auto">
            {!rows ? <div className="p-6 text-muted-foreground">Loading…</div> :
              rows.length === 0 ? <div className="p-6 text-muted-foreground">No conversations.</div> :
              rows.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full text-left p-4 hover:bg-background/50 ${selected?.id === r.id ? "bg-background" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{r.session_id.slice(0, 12)}…</span>
                    {r.contact_collected && <Badge variant="secondary">Contact</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.message_count} msgs · {format(new Date(r.created_at), "PP")}
                  </div>
                </button>
              ))}
          </CardContent>
        </Card>

        <Card className="bg-admin-surface lg:col-span-2">
          <CardContent className="p-6">
            {!selected ? (
              <div className="text-muted-foreground text-center py-20">Select a conversation</div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-auto">
                {Array.isArray(selected.conversation_data) && selected.conversation_data.length > 0 ? (
                  selected.conversation_data.map((m: any, i: number) => (
                    <div key={i} className={`p-3 rounded ${m.role === "user" ? "bg-primary/5" : "bg-muted"}`}>
                      <div className="text-xs font-semibold mb-1 uppercase">{m.role}</div>
                      <div className="text-sm whitespace-pre-wrap">{m.content || m.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">Empty conversation</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
