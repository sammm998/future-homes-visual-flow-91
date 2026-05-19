import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ExternalLink, Pencil } from "lucide-react";

interface Row {
  id: string;
  title: string;
  location: string | null;
  property_type: string | null;
  price: string | null;
  status: string | null;
  is_active: boolean;
  property_image: string | null;
  views_count?: number | null;
  created_at: string;
}

export default function PropertiesList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("properties")
        .select("id,title,location,property_type,price,status,is_active,property_image,views_count,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      setRows((data as Row[]) ?? []);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter === "active" && !r.is_active) return false;
      if (statusFilter === "inactive" && r.is_active) return false;
      if (statusFilter === "sold" && r.status !== "sold") return false;
      if (!needle) return true;
      return (
        r.title?.toLowerCase().includes(needle) ||
        r.location?.toLowerCase().includes(needle) ||
        r.property_type?.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {rows ? `${rows.length} total` : "Loading…"}
          </p>
        </div>
        <Button asChild className="bg-admin-sidebar text-admin-sidebar-foreground hover:bg-admin-sidebar/90">
          <Link to="/admin/properties/new"><Plus className="h-4 w-4 mr-1.5" /> Add property</Link>
        </Button>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-3 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, location or type"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "active", "inactive", "sold"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? "bg-admin-sidebar text-admin-sidebar-foreground hover:bg-admin-sidebar/90" : ""}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Property</th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Location</th>
                <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">Type</th>
                <th className="text-left font-medium px-4 py-3">Price</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!filtered &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-6 bg-muted animate-pulse rounded" />
                    </td>
                  </tr>
                ))}
              {filtered?.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No properties match.</td></tr>
              )}
              {filtered?.map((r) => (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-14 rounded bg-muted overflow-hidden shrink-0">
                        {r.property_image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.property_image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate max-w-[280px]">{r.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{r.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{r.location}</td>
                  <td className="px-4 py-3 hidden lg:table-cell capitalize">{r.property_type ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{r.price ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.is_active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                    ) : r.status === "sold" ? (
                      <Badge className="bg-zinc-200 text-zinc-700 hover:bg-zinc-200">Sold</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild size="sm" variant="ghost">
                        <Link to={`/admin/properties/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a href={`/property/${r.id}`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
