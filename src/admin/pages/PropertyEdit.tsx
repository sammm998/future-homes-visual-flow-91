import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

interface Form {
  title: string;
  location: string;
  property_type: string;
  price: string;
  price_currency: string;
  bedrooms: string;
  bathrooms: string;
  sizes_m2: string;
  description: string;
  property_image: string;
  status: string;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
  roi_percent: string;
  citizenship_eligible: boolean;
}

const EMPTY: Form = {
  title: "", location: "", property_type: "apartment", price: "", price_currency: "EUR",
  bedrooms: "", bathrooms: "", sizes_m2: "", description: "", property_image: "",
  status: "available", is_active: true, meta_title: "", meta_description: "",
  roi_percent: "", citizenship_eligible: false,
};

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("properties").select("*").eq("id", id!).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          title: data.title ?? "",
          location: data.location ?? "",
          property_type: data.property_type ?? "apartment",
          price: data.price ?? "",
          price_currency: (data as any).price_currency ?? "EUR",
          bedrooms: data.bedrooms ?? "",
          bathrooms: data.bathrooms ?? "",
          sizes_m2: data.sizes_m2 ?? "",
          description: data.description ?? "",
          property_image: data.property_image ?? "",
          status: data.status ?? "available",
          is_active: data.is_active ?? true,
          meta_title: (data as any).meta_title ?? "",
          meta_description: (data as any).meta_description ?? "",
          roi_percent: (data as any).roi_percent?.toString() ?? "",
          citizenship_eligible: (data as any).citizenship_eligible ?? false,
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (publish?: boolean) => {
    if (!form.title.trim() || !form.location.trim()) {
      toast.error("Title and location are required");
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      location: form.location.trim(),
      property_type: form.property_type,
      price: form.price,
      price_currency: form.price_currency,
      bedrooms: form.bedrooms || null,
      bathrooms: form.bathrooms || null,
      sizes_m2: form.sizes_m2 || null,
      description: form.description || null,
      property_image: form.property_image || null,
      status: form.status,
      is_active: publish ?? form.is_active,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      roi_percent: form.roi_percent ? Number(form.roi_percent) : null,
      citizenship_eligible: form.citizenship_eligible,
    };
    const res = isNew
      ? await supabase.from("properties").insert(payload).select("id").single()
      : await supabase.from("properties").update(payload).eq("id", id!).select("id").single();
    setSaving(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success(isNew ? "Property created" : "Property saved");
    if (isNew && res.data?.id) navigate(`/admin/properties/${res.data.id}/edit`, { replace: true });
  };

  const handleImageUpload = async (file: File) => {
    const path = `${id ?? "new"}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    set("property_image", data.publicUrl);
    toast.success("Cover image uploaded");
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/admin/properties"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link></Button>
          <h1 className="text-2xl font-semibold tracking-tight">{isNew ? "New property" : "Edit property"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={saving} onClick={() => handleSave(false)}>Save draft</Button>
          <Button disabled={saving} onClick={() => handleSave(true)} className="bg-admin-sidebar text-admin-sidebar-foreground hover:bg-admin-sidebar/90">
            <Save className="h-4 w-4 mr-1.5" /> {form.is_active ? "Save & publish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-admin-surface">
          <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Location *</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Antalya, Turkey" /></div>
              <div>
                <Label>Type</Label>
                <Select value={form.property_type} onValueChange={(v) => set("property_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["apartment","villa","penthouse","off-plan","commercial","land"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Price</Label><Input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="250000" /></div>
              <div>
                <Label>Currency</Label>
                <Select value={form.price_currency} onValueChange={(v) => set("price_currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["EUR","USD","GBP","SEK","AED","TRY"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Size (m²)</Label><Input value={form.sizes_m2} onChange={(e) => set("sizes_m2", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Bedrooms</Label><Input value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></div>
              <div><Label>Bathrooms</Label><Input value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></div>
              <div><Label>ROI %</Label><Input value={form.roi_percent} onChange={(e) => set("roi_percent", e.target.value)} type="number" step="0.1" /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={8} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Publish</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Active (visible on site)</Label>
                <Switch isSelected={!!form.is_active} onChange={(v) => set("is_active", v)} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["available","reserved","sold"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Citizenship eligible</Label>
                <Switch isSelected={!!form.citizenship_eligible} onChange={(v) => set("citizenship_eligible", v)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Cover image</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {form.property_image && <img src={form.property_image} alt="" className="rounded-md w-full object-cover aspect-video" />}
              <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              <Input placeholder="Or paste image URL" value={form.property_image} onChange={(e) => set("property_image", e.target.value)} />
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Meta title</Label><Input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} maxLength={60} /></div>
              <div><Label>Meta description</Label><Textarea rows={3} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} maxLength={160} /></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
