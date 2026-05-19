import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Row {
  id: string; name: string; email: string | null; phone: string | null;
  language: string | null; created_at: string; conversation_id: string | null;
}

export default function ContactsList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("id,name,email,phone,language,created_at,conversation_id")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) toast.error(error.message);
      setRows((data as Row[]) ?? []);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter((r) => [r.name, r.email, r.phone].some((v) => v?.toLowerCase().includes(n)));
  }, [rows, q]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground text-sm mt-1">All contacts captured from forms and chat.</p>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardContent className="p-0 divide-y">
          {!filtered ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No contacts.</div>
          ) : filtered.map((r) => (
            <div key={r.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {r.email} {r.phone && `· ${r.phone}`}
                </div>
              </div>
              {r.language && <Badge variant="outline">{r.language.toUpperCase()}</Badge>}
              <span className="text-xs text-muted-foreground w-28 text-right">
                {format(new Date(r.created_at), "PP")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
