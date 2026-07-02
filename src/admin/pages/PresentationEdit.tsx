import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Save,
  FileDown,
  Loader2,
  ImageIcon,
  Upload,
  GripVertical,
  X,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SlideView from "../presentation/SlideView";
import {
  Slide,
  SlideLayout,
  PresentationTheme,
  DEFAULT_THEME,
  blankSlide,
  newId,
  SLIDE_W,
  SLIDE_H,
} from "../presentation/types";

const LAYOUTS: { value: SlideLayout; label: string }[] = [
  { value: "cover", label: "Cover" },
  { value: "image-full", label: "Full image" },
  { value: "image-text", label: "Image + text" },
  { value: "gallery", label: "Gallery" },
  { value: "specs", label: "Key facts" },
  { value: "text", label: "Text" },
  { value: "closing", label: "Closing" },
];

export default function PresentationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [theme, setTheme] = useState<PresentationTheme>(DEFAULT_THEME);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"image" | "gallery">("image");
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        toast.error("Presentation not found");
        navigate("/admin/presentations");
        return;
      }
      setTitle(data.title);
      setSlides(((data.slides as any) || []) as Slide[]);
      setTheme(((data.theme as any) && Object.keys(data.theme).length ? data.theme : DEFAULT_THEME) as PresentationTheme);
      setPropertyId(data.property_id);
      setLoading(false);
    })();
  }, [id, navigate]);

  const markDirty = () => setDirty(true);

  const save = useCallback(async () => {
    setSaving(true);
    const { error } = await supabase
      .from("presentations")
      .update({ title, slides: slides as any, theme: theme as any })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error("Save failed");
      return;
    }
    setDirty(false);
  }, [id, title, slides, theme]);

  // autosave
  useEffect(() => {
    if (!dirty || loading) return;
    const t = setTimeout(() => save(), 1500);
    return () => clearTimeout(t);
  }, [dirty, loading, save]);

  const update = (patch: Partial<Slide>) => {
    setSlides((s) => s.map((sl, i) => (i === current ? { ...sl, ...patch } : sl)));
    markDirty();
  };

  const addSlide = (layout: SlideLayout) => {
    const s = blankSlide(layout);
    setSlides((arr) => {
      const next = [...arr];
      next.splice(current + 1, 0, s);
      return next;
    });
    setCurrent((c) => c + 1);
    markDirty();
  };

  const duplicate = (i: number) => {
    setSlides((arr) => {
      const next = [...arr];
      next.splice(i + 1, 0, { ...arr[i], id: newId() });
      return next;
    });
    markDirty();
  };

  const removeSlide = (i: number) => {
    if (slides.length <= 1) return;
    setSlides((arr) => arr.filter((_, idx) => idx !== i));
    setCurrent((c) => Math.max(0, Math.min(c, slides.length - 2)));
    markDirty();
  };

  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    setSlides((arr) => {
      const next = [...arr];
      const [moved] = next.splice(r.source.index, 1);
      next.splice(r.destination!.index, 0, moved);
      return next;
    });
    setCurrent(r.destination.index);
    markDirty();
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [SLIDE_W, SLIDE_H] });
      for (let i = 0; i < slides.length; i++) {
        const el = exportRefs.current[i];
        if (!el) continue;
        const canvas = await html2canvas(el, {
          width: SLIDE_W,
          height: SLIDE_H,
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });
        const img = canvas.toDataURL("image/jpeg", 0.92);
        if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], "landscape");
        pdf.addImage(img, "JPEG", 0, 0, SLIDE_W, SLIDE_H);
      }
      pdf.save(`${(title || "presentation").replace(/[^\w-]+/g, "_")}.pdf`);
      toast.success("PDF exported");
    } catch (e) {
      console.error(e);
      toast.error("Export failed. Some images may block cross-origin loading.");
    } finally {
      setExporting(false);
    }
  };

  const slide = slides[current];

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground p-8">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/presentations")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
        </Button>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markDirty();
          }}
          className="max-w-sm font-medium"
        />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {saving ? "Saving…" : dirty ? "Unsaved" : "Saved"}
          </span>
          <Button variant="outline" size="sm" onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-1.5" /> Save
          </Button>
          <Button size="sm" onClick={exportPDF} disabled={exporting}>
            {exporting ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-1.5" />
            )}
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr_300px] gap-4 max-lg:grid-cols-1">
        {/* slide list */}
        <div className="space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-1.5" /> Add slide
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {LAYOUTS.map((l) => (
                <DropdownMenuItem key={l.value} onClick={() => addSlide(l.value)}>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="slides">
              {(dp) => (
                <div
                  ref={dp.innerRef}
                  {...dp.droppableProps}
                  className="space-y-2 max-h-[70vh] overflow-auto pr-1"
                >
                  {slides.map((s, i) => (
                    <Draggable key={s.id} draggableId={s.id} index={i}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          onClick={() => setCurrent(i)}
                          className={`relative rounded-md border-2 bg-white cursor-pointer group ${
                            i === current ? "border-admin-accent" : "border-transparent"
                          }`}
                        >
                          <div
                            {...p.dragHandleProps}
                            className="absolute left-1 top-1 z-10 text-muted-foreground opacity-0 group-hover:opacity-100"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="absolute right-1 top-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicate(i);
                              }}
                              className="p-1 bg-white/90 rounded"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSlide(i);
                              }}
                              className="p-1 bg-white/90 rounded"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </button>
                          </div>
                          <div className="overflow-hidden rounded-[4px] pointer-events-none">
                            <SlideView slide={s} theme={theme} scale={196 / SLIDE_W} />
                          </div>
                          <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                            {i + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {dp.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* canvas */}
        <div className="bg-muted/40 rounded-lg p-4 grid place-items-center overflow-auto">
          {slide && (
            <div className="shadow-xl">
              <SlideView slide={slide} theme={theme} scale={Math.min(1, 720 / SLIDE_W)} />
            </div>
          )}
        </div>

        {/* inspector */}
        <div className="space-y-4">
          {slide && (
            <>
              <div>
                <Label className="text-xs">Layout</Label>
                <select
                  className="mt-1 w-full h-9 rounded-md border bg-background px-2 text-sm"
                  value={slide.layout}
                  onChange={(e) => update({ layout: e.target.value as SlideLayout })}
                >
                  {LAYOUTS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {slide.layout !== "gallery" && (
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    className="mt-1"
                    value={slide.title || ""}
                    onChange={(e) => update({ title: e.target.value })}
                  />
                </div>
              )}

              {["cover", "image-full", "specs", "closing"].includes(slide.layout) && (
                <div>
                  <Label className="text-xs">Subtitle</Label>
                  <Input
                    className="mt-1"
                    value={slide.subtitle || ""}
                    onChange={(e) => update({ subtitle: e.target.value })}
                  />
                </div>
              )}

              {["cover", "image-text", "text", "closing"].includes(slide.layout) && (
                <div>
                  <Label className="text-xs">
                    {slide.layout === "cover" ? "Price / highlight" : "Body text"}
                  </Label>
                  <Textarea
                    className="mt-1"
                    rows={slide.layout === "cover" || slide.layout === "closing" ? 2 : 8}
                    value={slide.body || ""}
                    onChange={(e) => update({ body: e.target.value })}
                  />
                </div>
              )}

              {["cover", "image-full", "image-text"].includes(slide.layout) && (
                <div>
                  <Label className="text-xs">Image</Label>
                  {slide.image && (
                    <img src={slide.image} className="mt-1 w-full h-24 object-cover rounded" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => {
                      setPickerTarget("image");
                      setPickerOpen(true);
                    }}
                  >
                    <ImageIcon className="h-4 w-4 mr-1.5" /> Choose image
                  </Button>
                </div>
              )}

              {slide.layout === "gallery" && (
                <div>
                  <Label className="text-xs">Images ({slide.images?.length || 0})</Label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {(slide.images || []).map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} className="w-full h-14 object-cover rounded" />
                        <button
                          onClick={() =>
                            update({ images: (slide.images || []).filter((_, idx) => idx !== i) })
                          }
                          className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => {
                      setPickerTarget("gallery");
                      setPickerOpen(true);
                    }}
                  >
                    <ImageIcon className="h-4 w-4 mr-1.5" /> Add images
                  </Button>
                </div>
              )}

              {slide.layout === "specs" && (
                <div>
                  <Label className="text-xs">Facts</Label>
                  <div className="space-y-1 mt-1">
                    {(slide.specs || []).map((sp, i) => (
                      <div key={i} className="flex gap-1">
                        <Input
                          className="h-8 text-xs"
                          value={sp.label}
                          onChange={(e) =>
                            update({
                              specs: (slide.specs || []).map((x, idx) =>
                                idx === i ? { ...x, label: e.target.value } : x
                              ),
                            })
                          }
                        />
                        <Input
                          className="h-8 text-xs"
                          value={sp.value}
                          onChange={(e) =>
                            update({
                              specs: (slide.specs || []).map((x, idx) =>
                                idx === i ? { ...x, value: e.target.value } : x
                              ),
                            })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() =>
                            update({ specs: (slide.specs || []).filter((_, idx) => idx !== i) })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      update({ specs: [...(slide.specs || []), { label: "Label", value: "Value" }] })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Add fact
                  </Button>
                </div>
              )}

              <div className="pt-2 border-t">
                <Label className="text-xs">Accent colour</Label>
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(e) => {
                    setTheme((t) => ({ ...t, accent: e.target.value }));
                    markDirty();
                  }}
                  className="mt-1 h-8 w-full rounded border"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* hidden full-size render for PDF export */}
      <div style={{ position: "fixed", left: -100000, top: 0 }} aria-hidden>
        {slides.map((s, i) => (
          <SlideView
            key={s.id}
            slide={s}
            theme={theme}
            ref={(el) => (exportRefs.current[i] = el)}
          />
        ))}
      </div>

      <ImagePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        propertyId={propertyId}
        multiple={pickerTarget === "gallery"}
        onSelect={(urls) => {
          if (pickerTarget === "gallery") {
            update({ images: [...(slide?.images || []), ...urls] });
          } else {
            update({ image: urls[0] });
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

/* ---------- Image picker ---------- */
function ImagePicker({
  open,
  onOpenChange,
  propertyId,
  multiple,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  propertyId: string | null;
  multiple: boolean;
  onSelect: (urls: string[]) => void;
}) {
  const [gallery, setGallery] = useState<string[]>([]);
  const [all, setAll] = useState<{ title: string; images: string[] }[]>([]);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSel([]);
      return;
    }
    (async () => {
      if (propertyId) {
        const { data } = await supabase
          .from("properties")
          .select("property_image,property_images")
          .eq("id", propertyId)
          .single();
        const imgs = [
          ...(data?.property_image ? [data.property_image] : []),
          ...((data?.property_images as string[]) || []),
        ].filter(Boolean);
        setGallery([...new Set(imgs)]);
      }
      if (all.length === 0) {
        const { data } = await supabase
          .from("properties")
          .select("title,property_image,property_images")
          .eq("is_active", true)
          .limit(300);
        setAll(
          (data || []).map((p: any) => ({
            title: p.title,
            images: [
              ...(p.property_image ? [p.property_image] : []),
              ...((p.property_images as string[]) || []),
            ].filter(Boolean),
          }))
        );
      }
    })();
  }, [open, propertyId]);

  const toggle = (url: string) => {
    if (multiple) setSel((s) => (s.includes(url) ? s.filter((x) => x !== url) : [...s, url]));
    else onSelect([url]);
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `presentations/${Date.now()}_${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("property-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setUploading(false);
    if (urls.length) {
      if (multiple) setSel((s) => [...s, ...urls]);
      else onSelect(urls);
    }
  };

  const allFiltered = all.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select image{multiple ? "s" : ""}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={propertyId ? "gallery" : "all"}>
          <TabsList>
            {propertyId && <TabsTrigger value="gallery">This property</TabsTrigger>}
            <TabsTrigger value="all">All properties</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          {propertyId && (
            <TabsContent value="gallery">
              <ImgGrid urls={gallery} sel={sel} onToggle={toggle} />
            </TabsContent>
          )}

          <TabsContent value="all">
            <Input
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-[420px] overflow-auto space-y-3">
              {allFiltered.slice(0, 60).map((p, i) => (
                <div key={i}>
                  <div className="text-xs font-medium mb-1">{p.title}</div>
                  <ImgGrid urls={p.images.slice(0, 8)} sel={sel} onToggle={toggle} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer hover:bg-muted">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image{multiple ? "s" : ""}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                className="hidden"
                onChange={(e) => upload(e.target.files)}
              />
            </label>
          </TabsContent>
        </Tabs>

        {multiple && (
          <div className="flex justify-end gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground self-center mr-auto">
              {sel.length} selected
            </span>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={!sel.length} onClick={() => onSelect(sel)}>
              Add selected
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ImgGrid({
  urls,
  sel,
  onToggle,
}: {
  urls: string[];
  sel: string[];
  onToggle: (u: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {urls.map((u, i) => (
        <button
          key={i}
          onClick={() => onToggle(u)}
          className={`relative rounded overflow-hidden border-2 ${
            sel.includes(u) ? "border-admin-accent" : "border-transparent"
          }`}
        >
          <img src={u} className="w-full h-20 object-cover" />
        </button>
      ))}
      {urls.length === 0 && (
        <div className="col-span-4 text-center text-xs text-muted-foreground py-6">
          No images.
        </div>
      )}
    </div>
  );
}
