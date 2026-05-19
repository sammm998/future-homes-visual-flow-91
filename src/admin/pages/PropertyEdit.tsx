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
import { ArrowLeft, GripVertical, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";

type ApartmentType = { type?: string; size?: string; price?: string };

interface Form {
  title: string;
  location: string;
  country: string;
  property_district: string;
  property_type: string;
  property_subtype: string;
  price: string;
  price_currency: string;
  starting_price_eur: string;
  bedrooms: string;
  bathrooms: string;
  sizes_m2: string;
  description: string;
  property_image: string;
  property_images: string[];
  amenities: string[];
  property_facilities: string[];
  apartment_types: ApartmentType[];
  status: string;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
  roi_percent: string;
  citizenship_eligible: boolean;
  ref_no: string;
  year_built: string;
  floors: string;
  distance_to_airport_km: string;
  distance_to_beach_km: string;
  building_complete_date: string;
  agent_name: string;
  agent_phone_number: string;
  google_maps_embed: string;
  floor_plan_url: string;
  video_url: string;
  tour_url: string;
  og_image: string;
}

const EMPTY: Form = {
  title: "", location: "", country: "", property_district: "",
  property_type: "apartment", property_subtype: "",
  price: "", price_currency: "EUR", starting_price_eur: "",
  bedrooms: "", bathrooms: "", sizes_m2: "", description: "",
  property_image: "", property_images: [], amenities: [], property_facilities: [], apartment_types: [],
  status: "available", is_active: true, meta_title: "", meta_description: "",
  roi_percent: "", citizenship_eligible: false,
  ref_no: "", year_built: "", floors: "",
  distance_to_airport_km: "", distance_to_beach_km: "",
  building_complete_date: "",
  agent_name: "", agent_phone_number: "",
  google_maps_embed: "", floor_plan_url: "", video_url: "", tour_url: "", og_image: "",
};

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("properties").select("*").eq("id", id!).maybeSingle().then(({ data }) => {
      if (data) {
        const d: any = data;
        let aptTypes: ApartmentType[] = [];
        try {
          const raw = typeof d.apartment_types === "string" ? JSON.parse(d.apartment_types) : d.apartment_types;
          if (Array.isArray(raw)) aptTypes = raw;
        } catch { /* noop */ }
        setForm({
          title: d.title ?? "",
          location: d.location ?? "",
          country: d.country ?? "",
          property_district: d.property_district ?? "",
          property_type: d.property_type ?? "apartment",
          property_subtype: d.property_subtype ?? "",
          price: d.price ?? "",
          price_currency: d.price_currency ?? "EUR",
          starting_price_eur: d.starting_price_eur ?? "",
          bedrooms: d.bedrooms ?? "",
          bathrooms: d.bathrooms ?? "",
          sizes_m2: d.sizes_m2 ?? "",
          description: d.description ?? "",
          property_image: d.property_image ?? "",
          property_images: Array.isArray(d.property_images) ? d.property_images : [],
          amenities: Array.isArray(d.amenities) ? d.amenities : [],
          property_facilities: Array.isArray(d.property_facilities) ? d.property_facilities : [],
          apartment_types: aptTypes,
          status: d.status ?? "available",
          is_active: d.is_active ?? true,
          meta_title: d.meta_title ?? "",
          meta_description: d.meta_description ?? "",
          roi_percent: d.roi_percent?.toString() ?? "",
          citizenship_eligible: d.citizenship_eligible ?? false,
          ref_no: d.ref_no ?? "",
          year_built: d.year_built?.toString() ?? "",
          floors: d.floors?.toString() ?? "",
          distance_to_airport_km: d.distance_to_airport_km ?? "",
          distance_to_beach_km: d.distance_to_beach_km ?? "",
          building_complete_date: d.building_complete_date ?? "",
          agent_name: d.agent_name ?? "",
          agent_phone_number: d.agent_phone_number ?? "",
          google_maps_embed: d.google_maps_embed ?? "",
          floor_plan_url: d.floor_plan_url ?? "",
          video_url: d.video_url ?? "",
          tour_url: d.tour_url ?? "",
          og_image: d.og_image ?? "",
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
      country: form.country || null,
      property_district: form.property_district || null,
      property_type: form.property_type,
      property_subtype: form.property_subtype || null,
      price: form.price,
      price_currency: form.price_currency,
      starting_price_eur: form.starting_price_eur || null,
      bedrooms: form.bedrooms || null,
      bathrooms: form.bathrooms || null,
      sizes_m2: form.sizes_m2 || null,
      description: form.description || null,
      property_image: form.property_image || form.property_images[0] || null,
      property_images: form.property_images,
      amenities: form.amenities,
      property_facilities: form.property_facilities,
      apartment_types: form.apartment_types,
      status: form.status,
      is_active: publish ?? form.is_active,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      roi_percent: form.roi_percent ? Number(form.roi_percent) : null,
      citizenship_eligible: form.citizenship_eligible,
      ref_no: form.ref_no || null,
      year_built: form.year_built ? Number(form.year_built) : null,
      floors: form.floors ? Number(form.floors) : null,
      distance_to_airport_km: form.distance_to_airport_km || null,
      distance_to_beach_km: form.distance_to_beach_km || null,
      building_complete_date: form.building_complete_date || null,
      agent_name: form.agent_name || null,
      agent_phone_number: form.agent_phone_number || null,
      google_maps_embed: form.google_maps_embed || null,
      floor_plan_url: form.floor_plan_url || null,
      video_url: form.video_url || null,
      tour_url: form.tour_url || null,
      og_image: form.og_image || null,
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

  const uploadOne = async (file: File): Promise<string | null> => {
    const path = `${id ?? "new"}/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return null; }
    return supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;
  };

  const handleCoverUpload = async (file: File) => {
    const url = await uploadOne(file);
    if (url) { set("property_image", url); toast.success("Cover uploaded"); }
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const u = await uploadOne(f);
      if (u) urls.push(u);
    }
    if (urls.length) {
      set("property_images", [...form.property_images, ...urls]);
      toast.success(`${urls.length} image(s) added`);
    }
    setUploadingGallery(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const next = Array.from(form.property_images);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    set("property_images", next);
  };

  const removeImage = (idx: number) => {
    const next = form.property_images.filter((_, i) => i !== idx);
    set("property_images", next);
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-5 max-w-6xl">
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
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Ref no</Label><Input value={form.ref_no} onChange={(e) => set("ref_no", e.target.value)} /></div>
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
                <div><Label>Location *</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Antalya" /></div>
                <div><Label>District</Label><Input value={form.property_district} onChange={(e) => set("property_district", e.target.value)} /></div>
                <div><Label>Country</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Turkey" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Price</Label><Input value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
                <div>
                  <Label>Currency</Label>
                  <Select value={form.price_currency} onValueChange={(v) => set("price_currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["EUR","USD","GBP","SEK","AED","TRY"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Starting price (EUR)</Label><Input value={form.starting_price_eur} onChange={(e) => set("starting_price_eur", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div><Label>Bedrooms</Label><Input value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></div>
                <div><Label>Bathrooms</Label><Input value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></div>
                <div><Label>Size (m²)</Label><Input value={form.sizes_m2} onChange={(e) => set("sizes_m2", e.target.value)} /></div>
                <div><Label>ROI %</Label><Input value={form.roi_percent} onChange={(e) => set("roi_percent", e.target.value)} type="number" step="0.1" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Year built</Label><Input type="number" value={form.year_built} onChange={(e) => set("year_built", e.target.value)} /></div>
                <div><Label>Floors</Label><Input type="number" value={form.floors} onChange={(e) => set("floors", e.target.value)} /></div>
                <div><Label>Building complete date</Label><Input value={form.building_complete_date} onChange={(e) => set("building_complete_date", e.target.value)} placeholder="Q3 2026" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Distance to beach (km)</Label><Input value={form.distance_to_beach_km} onChange={(e) => set("distance_to_beach_km", e.target.value)} /></div>
                <div><Label>Distance to airport (km)</Label><Input value={form.distance_to_airport_km} onChange={(e) => set("distance_to_airport_km", e.target.value)} /></div>
              </div>
              <div><Label>Description</Label><Textarea rows={8} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Gallery images ({form.property_images.length})</span>
                <label className="inline-flex items-center gap-1.5 text-xs font-normal text-primary cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingGallery ? "Uploading…" : "Add images"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} />
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {form.property_images.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-md">
                  No gallery images yet. Add images to show on the property page.
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.droppableProps} className="flex flex-wrap gap-3">
                        {form.property_images.map((url, idx) => (
                          <Draggable key={url + idx} draggableId={url + idx} index={idx}>
                            {(p) => (
                              <div
                                ref={p.innerRef}
                                {...p.draggableProps}
                                className="relative w-32 h-24 rounded-md overflow-hidden border bg-muted group"
                              >
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <div
                                  {...p.dragHandleProps}
                                  className="absolute top-1 left-1 bg-black/60 text-white rounded p-1 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="h-3 w-3" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-1 right-1 bg-red-600/90 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                                  {idx + 1}
                                </span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {prov.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Apartment types / pricing ({form.apartment_types.length})</span>
                <Button size="sm" variant="ghost" onClick={() => set("apartment_types", [...form.apartment_types, { type: "", size: "", price: "" }])}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {form.apartment_types.length === 0 && (
                <div className="text-sm text-muted-foreground">No apartment types defined.</div>
              )}
              {form.apartment_types.map((a, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4"><Label className="text-xs">Type</Label><Input value={a.type ?? ""} placeholder="2+1" onChange={(e) => {
                    const next = [...form.apartment_types]; next[i] = { ...next[i], type: e.target.value }; set("apartment_types", next);
                  }} /></div>
                  <div className="col-span-3"><Label className="text-xs">Size</Label><Input value={a.size ?? ""} placeholder="95 m²" onChange={(e) => {
                    const next = [...form.apartment_types]; next[i] = { ...next[i], size: e.target.value }; set("apartment_types", next);
                  }} /></div>
                  <div className="col-span-4"><Label className="text-xs">Price</Label><Input value={a.price ?? ""} placeholder="€250,000" onChange={(e) => {
                    const next = [...form.apartment_types]; next[i] = { ...next[i], price: e.target.value }; set("apartment_types", next);
                  }} /></div>
                  <Button variant="ghost" size="icon" className="col-span-1" onClick={() => set("apartment_types", form.apartment_types.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Amenities & facilities</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Amenities (comma separated)</Label>
                <Textarea rows={2} value={form.amenities.join(", ")} onChange={(e) => set("amenities", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Pool, Gym, Sauna, 24/7 Security" />
              </div>
              <div>
                <Label>Property facilities (comma separated)</Label>
                <Textarea rows={2} value={form.property_facilities.join(", ")} onChange={(e) => set("property_facilities", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Elevator, Parking, Garden" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Media & links</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Floor plan URL</Label><Input value={form.floor_plan_url} onChange={(e) => set("floor_plan_url", e.target.value)} /></div>
              <div><Label>Video URL (YouTube/Vimeo)</Label><Input value={form.video_url} onChange={(e) => set("video_url", e.target.value)} /></div>
              <div><Label>360° tour URL</Label><Input value={form.tour_url} onChange={(e) => set("tour_url", e.target.value)} /></div>
              <div><Label>Google Maps embed (iframe src)</Label><Textarea rows={2} value={form.google_maps_embed} onChange={(e) => set("google_maps_embed", e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Agent</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div><Label>Agent name</Label><Input value={form.agent_name} onChange={(e) => set("agent_name", e.target.value)} /></div>
              <div><Label>Agent phone</Label><Input value={form.agent_phone_number} onChange={(e) => set("agent_phone_number", e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>

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
              <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
              <Input placeholder="Or paste image URL" value={form.property_image} onChange={(e) => set("property_image", e.target.value)} />
              {form.property_images.length > 0 && !form.property_image && (
                <Button size="sm" variant="outline" className="w-full" onClick={() => set("property_image", form.property_images[0])}>
                  Use first gallery image
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Meta title</Label><Input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} maxLength={60} /></div>
              <div><Label>Meta description</Label><Textarea rows={3} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} maxLength={160} /></div>
              <div><Label>OG image URL</Label><Input value={form.og_image} onChange={(e) => set("og_image", e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
