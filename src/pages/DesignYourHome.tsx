import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Loader2, Wand2, Image as ImageIcon, ArrowLeft, ArrowRight,
  Download, RefreshCw, Search, Check, Sparkles, Home, Camera,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type PropertyLite = {
  id: string;
  title: string;
  location: string;
  cover: string | null;
  images: string[];
};

type Step = 0 | 1 | 2 | 3;

const STYLE_PRESETS = [
  { label: "Scandinavian", emoji: "🌿", prompt: "Redesign in Scandinavian minimalist style — light oak floors, off-white walls, neutral linen sofa, designer pendant lighting, lots of natural light." },
  { label: "Modern Luxury", emoji: "✨", prompt: "Transform into a modern luxury interior — marble surfaces, brass accents, deep velvet seating, sculptural lighting, sophisticated palette." },
  { label: "Mediterranean", emoji: "🌊", prompt: "Mediterranean coastal style — whitewashed walls, natural stone, rattan and linen, terracotta accents, warm sunlight, blue and beige palette." },
  { label: "Japandi", emoji: "🎋", prompt: "Japandi style — warm woods, paper lanterns, low furniture, neutral palette, calm zen atmosphere with minimalist styling." },
  { label: "Industrial", emoji: "🏭", prompt: "Industrial loft — exposed brick walls, polished concrete floors, black steel beams, leather couch, vintage Edison lighting." },
  { label: "Tropical Bali", emoji: "🌴", prompt: "Tropical Bali resort style — teak wood, rattan furniture, lush indoor plants, stone textures, ocean-inspired tones, soft daylight." },
  { label: "Art Deco", emoji: "💎", prompt: "Art deco style — bold geometric patterns, brass and emerald accents, velvet upholstery, mirrored surfaces, glamorous lighting." },
  { label: "Wabi-Sabi", emoji: "🍵", prompt: "Wabi-sabi aesthetic — raw clay walls, weathered wood, handmade ceramics, muted earth tones, imperfect natural textures." },
];

const STEPS = [
  { id: 0, label: "Source", icon: Home },
  { id: 1, label: "Photo", icon: Camera },
  { id: 2, label: "Style", icon: Sparkles },
  { id: 3, label: "Result", icon: Wand2 },
];

const DesignYourHome = () => {
  const [step, setStep] = useState<Step>(0);
  const [mode, setMode] = useState<"browse" | "upload" | null>(null);

  // browse
  const [properties, setProperties] = useState<PropertyLite[]>([]);
  const [propSearch, setPropSearch] = useState("");
  const [loadingProps, setLoadingProps] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyLite | null>(null);

  // shared source
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceBase64, setSourceBase64] = useState<string | null>(null);

  // prompt + result
  const [prompt, setPrompt] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setLoadingProps(true);
      const { data } = await supabase
        .from("properties")
        .select("id,title,location,property_image,property_images")
        .eq("is_active", true)
        .order("ref_no", { ascending: false })
        .limit(80);
      const mapped: PropertyLite[] = (data || []).map((p: any) => {
        const images: string[] = Array.isArray(p.property_images) ? p.property_images.filter(Boolean) : [];
        const cover = p.property_image || images[0] || null;
        return { id: p.id, title: p.title, location: p.location, cover, images };
      });
      setProperties(mapped);
      setLoadingProps(false);
    })();
  }, []);

  const onFile = (f: File) => {
    if (f.size > 8 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Max 8 MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSourceImage(dataUrl);
      setSourceBase64(dataUrl);
      setResultImage(null);
      setStep(2);
    };
    reader.readAsDataURL(f);
  };

  const pickPropertyImage = (url: string) => {
    setSourceImage(url);
    setSourceBase64(null);
    setResultImage(null);
    setStep(2);
  };

  const generate = async () => {
    if (!sourceImage) return;
    if (!prompt.trim()) {
      toast({ title: "Describe the design you want", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setResultImage(null);
    setStep(3);
    try {
      const body: any = { prompt };
      if (sourceBase64) body.imageBase64 = sourceBase64;
      else body.imageUrl = sourceImage;
      const { data, error } = await supabase.functions.invoke("design-home", { body });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResultImage((data as any).imageUrl as string);
    } catch (e: any) {
      toast({ title: "Could not generate", description: e?.message || "Try again", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setStep(0);
    setMode(null);
    setSelectedProperty(null);
    setSourceImage(null);
    setSourceBase64(null);
    setResultImage(null);
    setPrompt("");
    setActivePreset(null);
  };

  const filteredProps = properties.filter(p =>
    !propSearch.trim() ||
    p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(propSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <SEOHead
        title="Design Your Home | AI Interior Design — Future Homes International"
        description="Reimagine any home in seconds. Pick a property, choose an image, describe the style, and let AI redesign your space."
      />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)] -z-10" />
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" /> Powered by Gemini AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text"
          >
            Design Your Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            A four-step studio. Pick a home, choose a room, set the mood, see the magic.
          </motion.p>
        </div>
      </section>

      {/* Stepper */}
      <div className="container mx-auto max-w-3xl px-4 mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = step > (s.id as Step);
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      backgroundColor: isActive || isDone ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                      isActive || isDone ? "text-primary-foreground shadow-lg shadow-primary/30" : "text-muted-foreground"
                    )}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </motion.div>
                  <span className={cn(
                    "mt-2 text-xs font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 -mt-6 rounded bg-muted overflow-hidden">
                    <motion.div
                      animate={{ width: step > s.id ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-24">
        <AnimatePresence mode="wait">
          {/* STEP 0 — choose source */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="grid md:grid-cols-2 gap-5"
            >
              <button
                onClick={() => { setMode("browse"); setStep(1); }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-left hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors" />
                <Home className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Browse our portfolio</h3>
                <p className="text-muted-foreground mb-6">Pick from real Future Homes International properties across Turkey, Dubai, Cyprus and Bali.</p>
                <div className="inline-flex items-center gap-2 text-primary font-medium">
                  Explore homes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => { setMode("upload"); setStep(1); }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-left hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl group-hover:bg-amber-400/20 transition-colors" />
                <Camera className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Upload your own photo</h3>
                <p className="text-muted-foreground mb-6">Use a photo of your existing room and redesign it with AI.</p>
                <div className="inline-flex items-center gap-2 text-amber-600 font-medium">
                  Upload photo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          )}

          {/* STEP 1 — pick photo */}
          {step === 1 && mode === "browse" && (
            <motion.div
              key="step-1-browse"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {!selectedProperty ? (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold">Choose a property</h2>
                    <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  </div>
                  <div className="relative mb-5 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or location..."
                      value={propSearch}
                      onChange={(e) => setPropSearch(e.target.value)}
                      className="pl-9 rounded-full"
                    />
                  </div>
                  {loadingProps ? (
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProps.map((p) => (
                        <motion.button
                          key={p.id}
                          whileHover={{ y: -4 }}
                          onClick={() => p.cover && setSelectedProperty(p)}
                          disabled={!p.cover}
                          className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border hover:border-primary transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                          {p.cover ? (
                            <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                            <div className="text-sm text-white font-semibold truncate">{p.title}</div>
                            <div className="text-xs text-white/70 truncate">{p.location}</div>
                            {p.images.length > 1 && (
                              <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/80 bg-white/10 backdrop-blur px-1.5 py-0.5 rounded">
                                <ImageIcon className="w-3 h-3" /> {p.images.length} photos
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <button onClick={() => setSelectedProperty(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-1">
                        <ArrowLeft className="w-4 h-4" /> All properties
                      </button>
                      <h2 className="text-xl font-semibold">{selectedProperty.title}</h2>
                      <p className="text-sm text-muted-foreground">{selectedProperty.location} · Pick an image to redesign</p>
                    </div>
                  </div>
                  {selectedProperty.images.length === 0 ? (
                    <div className="text-center py-16 border border-dashed rounded-2xl">
                      <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No gallery images for this property.</p>
                      {selectedProperty.cover && (
                        <Button onClick={() => pickPropertyImage(selectedProperty.cover!)} className="mt-4">
                          Use cover image
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {selectedProperty.images.map((url, i) => (
                        <motion.button
                          key={url + i}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => pickPropertyImage(url)}
                          className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                        >
                          <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                              <Wand2 className="w-3 h-3" /> Redesign
                            </div>
                          </div>
                          <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                            {i + 1}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {step === 1 && mode === "upload" && (
            <motion.div
              key="step-1-upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Upload a photo</h2>
                <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
                className="block aspect-[16/9] max-w-3xl mx-auto rounded-3xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-all bg-gradient-to-br from-muted/30 to-muted/10 hover:from-primary/5 hover:to-primary/10"
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Drop or click to upload</h3>
                  <p className="text-sm text-muted-foreground">JPG or PNG · up to 8 MB · interior or exterior</p>
                </div>
              </label>
            </motion.div>
          )}

          {/* STEP 2 — prompt */}
          {step === 2 && sourceImage && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="grid lg:grid-cols-[1.1fr_1fr] gap-6"
            >
              <div className="space-y-3">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" /> Choose a different photo
                </button>
                <div className="rounded-3xl overflow-hidden border border-border bg-muted aspect-[4/3] shadow-xl shadow-black/5">
                  <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-5 p-6 md:p-8 rounded-3xl border border-border bg-card shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Set the mood</h2>
                  <p className="text-sm text-muted-foreground">Tap a style or describe your own vision.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {STYLE_PRESETS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => { setPrompt(s.prompt); setActivePreset(s.label); }}
                      className={cn(
                        "text-left text-sm px-3 py-2.5 rounded-xl border transition-all",
                        activePreset === s.label
                          ? "border-primary bg-primary/10 text-foreground shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <span className="mr-1.5">{s.emoji}</span>
                      <span className="font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <Textarea
                    value={prompt}
                    onChange={(e) => { setPrompt(e.target.value); setActivePreset(null); }}
                    placeholder="e.g. Turn this living room into a warm, modern Mediterranean space with cream walls, oak floors, linen furniture and brass accents."
                    rows={5}
                    className="resize-none rounded-xl"
                  />
                </div>

                <Button onClick={generate} disabled={generating || !prompt.trim()} className="w-full h-12 text-base rounded-xl" size="lg">
                  <Wand2 className="w-4 h-4 mr-2" /> Design my home
                </Button>
                <p className="text-xs text-muted-foreground text-center">Generation takes 10–30 seconds.</p>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — result */}
          {step === 3 && sourceImage && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" /> Refine prompt
                </button>
                <div className="flex gap-2">
                  {resultImage && (
                    <a href={resultImage} download="design-your-home.png">
                      <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1.5" /> Download</Button>
                    </a>
                  )}
                  <Button onClick={generate} disabled={generating} size="sm">
                    <RefreshCw className={cn("w-4 h-4 mr-1.5", generating && "animate-spin")} /> Regenerate
                  </Button>
                  <Button onClick={reset} variant="ghost" size="sm">Start over</Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Before</div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border">
                    <img src={sourceImage} alt="Original" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-primary font-semibold">After · AI redesign</div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-primary/30 relative shadow-xl shadow-primary/10">
                    <AnimatePresence mode="wait">
                      {generating ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                            <Wand2 className="w-12 h-12 text-primary" />
                          </motion.div>
                          <p className="mt-4 text-sm font-medium">Designing your space…</p>
                          <p className="text-xs text-muted-foreground mt-1">This takes 10–30 seconds</p>
                        </motion.div>
                      ) : resultImage ? (
                        <motion.img key="result" src={resultImage} alt="Redesigned"
                          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                          className="w-full h-full object-cover" />
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DesignYourHome;
