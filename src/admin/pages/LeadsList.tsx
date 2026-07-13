import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
type Status = typeof STATUSES[number];

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  status: Status;
  source: string | null;
  score: number;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string | null;
  created_at: string;
}

const statusColors: Record<Status, string> = {
  new: "bg-blue-500/10 text-blue-700 border-blue-200",
  contacted: "bg-amber-500/10 text-amber-700 border-amber-200",
  qualified: "bg-purple-500/10 text-purple-700 border-purple-200",
  proposal: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  won: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  lost: "bg-rose-500/10 text-rose-700 border-rose-200",
};

export default function LeadsList() {
  const { t } = useAdminT();
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [q, setQ] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("id,name,email,phone,nationality,status,source,score,budget_min,budget_max,budget_currency,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows((data as Lead[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.nationality, r.source].some((v) =>
        v?.toLowerCase().includes(n)
      )
    );
  }, [rows, q]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r?.map((l) => (l.id === id ? { ...l, status } : l)) ?? null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Leads")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("Pipeline, scoring and assignments.")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView(view === "kanban" ? "list" : "kanban")}>
            {view === "kanban" ? t("List view") : t("Kanban view")}
          </Button>
          <Button asChild>
            <Link to="/admin/crm/leads/new"><Plus className="h-4 w-4 mr-2" /> {t("New lead")}</Link>
          </Button>
        </div>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("Search leads…")} value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {!filtered ? (
        <div className="p-8 text-center text-muted-foreground">{t("Loading")}…</div>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {STATUSES.map((s) => {
            const items = filtered.filter((l) => l.status === s);
            return (
              <div key={s} className="bg-admin-surface rounded-lg p-3 min-h-[300px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t(s)}</span>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((l) => (
                    <Link
                      key={l.id}
                      to={`/admin/crm/leads/${l.id}`}
                      className="block bg-background rounded-md p-3 shadow-sm hover:shadow border"
                    >
                      <div className="font-medium text-sm truncate">{l.name}</div>
                      {l.email && <div className="text-xs text-muted-foreground truncate">{l.email}</div>}
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{l.source ?? "—"}</span>
                        <span>{formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="bg-admin-surface">
          <CardContent className="p-0 divide-y">
            {filtered.map((l) => (
              <div key={l.id} className="p-4 flex items-center gap-4">
                <Link to={`/admin/crm/leads/${l.id}`} className="flex-1 min-w-0">
                  <div className="font-medium truncate">{l.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {l.email} {l.phone && `· ${l.phone}`} {l.nationality && `· ${l.nationality}`}
                  </div>
                </Link>
                <select
                  className={`text-xs border rounded px-2 py-1 ${statusColors[l.status]}`}
                  value={l.status}
                  onChange={(e) => updateStatus(l.id, e.target.value as Status)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="text-xs text-muted-foreground w-24 text-right">
                  {formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No leads yet.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
