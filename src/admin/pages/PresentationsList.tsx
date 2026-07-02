import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Presentation, Trash2, Search, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  generateSlidesFromProperty,
  blankSlide,
  DEFAULT_THEME,
  PropertyForSlides,
} from "../presentation/types";

interface Row {
  id: string;
  title: string;
  property_id: string | null;
  updated_at: string;
  slides: any[];
}

export default function PresentationsList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickOpen, setPickOpen] = useState(false);
  const [props, setProps] = useState<PropertyForSlides[]>([]);
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("presentations")
      .select("id,title,property_id,updated_at,slides")
      .order("updated_at", { ascending: false });
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openPicker = async () => {
    setPickOpen(true);
    if (props.length === 0) {
      const { data } = await supabase
        .from("properties")
        .select(
          "id,title,location,price,price_currency,description,property_image,property_images,bedrooms,bathrooms,sizes_m2,property_type,property_district,distance_to_beach_km,distance_to_airport_km,ref_no,roi_percent"
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(500);
      setProps((data as any) || []);
    }
  };

  const create = async (property?: PropertyForSlides) => {
    setCreating(true);
    const slides = property
      ? generateSlidesFromProperty(property)
      : [blankSlide("cover"), blankSlide("text"), blankSlide("closing")];
    const title = property ? property.title : "New presentation";
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("presentations")
      .insert({
        title,
        property_id: property?.id ?? null,
        slides: slides as any,
        theme: DEFAULT_THEME as any,
        created_by: userData.user?.id ?? null,
      })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("Could not create presentation");
      return;
    }
    setPickOpen(false);
    navigate(`/admin/presentations/${data.id}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this presentation?")) return;
    await supabase.from("presentations").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  const filtered = props.filter((p) =>
    (p.title + " " + p.location).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Presentations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build branded property presentations and export them as PDF.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => create()} disabled={creating}>
            <Plus className="h-4 w-4 mr-1.5" /> Blank
          </Button>
          <Dialog open={pickOpen} onOpenChange={setPickOpen}>
            <DialogTrigger asChild>
              <Button onClick={openPicker}>
                <Presentation className="h-4 w-4 mr-1.5" /> From property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Choose a property</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search properties…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-[420px] overflow-auto divide-y">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => create(p)}
                    disabled={creating}
                    className="w-full flex items-center gap-3 p-2 hover:bg-muted text-left rounded-md"
                  >
                    <img
                      src={p.property_image || p.property_images?.[0] || ""}
                      className="h-12 w-16 object-cover rounded bg-muted"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {p.location} · {p.price} {p.price_currency}
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No properties found.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground p-8">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <Card className="bg-admin-surface">
          <CardContent className="p-10 text-center text-muted-foreground">
            No presentations yet. Create one from a property to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <Card
              key={r.id}
              className="bg-admin-surface hover:shadow-md transition cursor-pointer group"
              onClick={() => navigate(`/admin/presentations/${r.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-md bg-admin-accent/15 text-admin-accent grid place-items-center">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(r.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-3 font-medium truncate">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(r.slides?.length ?? 0)} slides · {format(new Date(r.updated_at), "d MMM yyyy")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
