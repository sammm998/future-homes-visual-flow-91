import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Wand2, Image as ImageIcon, ArrowLeft, Download, RefreshCw, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type PropertyLite = { id: string; title: string; location: string; cover: string | null };

const STYLE_PRESETS = [
  { label: "Scandinavian Minimal", prompt: "Redesign in Scandinavian minimalist style — light oak floors, off-white walls, neutral linen sofa, designer pendant lighting, lots of natural light." },
  { label: "Modern Luxury", prompt: "Transform into a modern luxury interior — marble surfaces, brass accents, deep velvet seating, sculptural lighting, sophisticated palette." },
  { label: "Mediterranean Coastal", prompt: "Mediterranean coastal style — whitewashed walls, natural stone, rattan and linen, terracotta accents, warm sunlight, blue and beige palette." },
  { label: "Japandi", prompt: "Japandi style — warm woods, paper lanterns, low furniture, neutral palette, calm zen atmosphere with minimalist styling." },
  { label: "Industrial Loft", prompt: "Industrial loft — exposed brick walls, polished concrete floors, black steel beams, leather couch, vintage Edison lighting." },
  { label: "Tropical Bali", prompt: "Tropical Bali resort style — teak wood, rattan furniture, lush indoor plants, stone textures, ocean-inspired tones, soft daylight." },
];

const DesignYourHome = () => {
  const [tab, setTab] = useState<"browse" | "upload">("browse");
  const [properties, setProperties] = useState<PropertyLite[]>([]);
  const [propSearch, setPropSearch] = useState("");
  const [loadingProps, setLoadingProps] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceBase64, setSourceBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
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
        .limit(60);
      const mapped: PropertyLite[] = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        location: p.location,
        cover: p.property_image || (Array.isArray(p.property_images) ? p.property_images[0] : null),
      }));
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
    };
    reader.readAsDataURL(f);
  };

  const pickProperty = (cover: string | null) => {
    if (!cover) return;
    setSourceImage(cover);
    setSourceBase64(null);
    setResultImage(null);
  };

  const generate = async () => {
    if (!sourceImage) {
      toast({ title: "Pick or upload a photo first", variant: "destructive" });
      return;
    }
    if (!prompt.trim()) {
      toast({ title: "Describe the design you want", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setResultImage(null);
    try {
      const body: any = { prompt };
      if (sourceBase64) body.imageBase64 = sourceBase64;
      else body.imageUrl = sourceImage;
      const { data, error } = await supabase.functions.invoke("design-home", { body });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const url = (data as any).imageUrl as string;
      setResultImage(url);
    } catch (e: any) {
      toast({ title: "Could not generate", description: e?.message || "Try again", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setSourceImage(null);
    setSourceBase64(null);
    setResultImage(null);
    setPrompt("");
  };

  const filtered = properties.filter(p =>
    !propSearch.trim() ||
    p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(propSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Design Your Home | AI Interior Design — Future Homes International"
        description="Reimagine any home in seconds. Pick a property or upload your own photo, describe the style, and let AI redesign your space."
      />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Wand2 className="w-4 h-4" /> Powered by Gemini AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          >
            Design Your Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Browse our portfolio or upload your own photo, describe your dream style, and watch your space transform in seconds.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 pb-24">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-muted rounded-full">
            <button
              onClick={() => setTab("browse")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                tab === "browse" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Browse our homes
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                tab === "upload" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Upload your own
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Left: source + result */}
          <div className="space-y-6">
            {/* Source picker */}
            {!sourceImage ? (
              <AnimatePresence mode="wait">
                {tab === "browse" ? (
                  <motion.div
                    key="browse"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title or location..."
                        value={propSearch}
                        onChange={(e) => setPropSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {loadingProps ? (
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
                        {filtered.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => pickProperty(p.cover)}
                            disabled={!p.cover}
                            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-primary transition-all disabled:opacity-50"
                          >
                            {p.cover ? (
                              <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                              <div className="text-xs text-white font-medium truncate">{p.title}</div>
                              <div className="text-[10px] text-white/70 truncate">{p.location}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <label
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
                      className="block aspect-[16/10] rounded-2xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors bg-muted/30 hover:bg-muted/50"
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
                      />
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Upload className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-1">Drop or click to upload</h3>
                        <p className="text-sm text-muted-foreground">JPG, PNG · up to 8 MB</p>
                      </div>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              /* Before / After viewer */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button onClick={reset} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> Choose a different photo
                  </button>
                  {resultImage && (
                    <a
                      href={resultImage}
                      download="design-your-home.png"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Before</div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
                      <img src={sourceImage} alt="Original" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">After</div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border relative">
                      <AnimatePresence mode="wait">
                        {generating ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Wand2 className="w-10 h-10 text-primary" />
                            </motion.div>
                            <p className="mt-4 text-sm font-medium">Designing your space...</p>
                            <p className="text-xs text-muted-foreground mt-1">This takes 10-30 seconds</p>
                          </motion.div>
                        ) : resultImage ? (
                          <motion.img
                            key="result"
                            src={resultImage}
                            alt="Redesigned"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
                          >
                            <Wand2 className="w-10 h-10 mb-2 opacity-40" />
                            <p className="text-sm">Your redesign will appear here</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: prompt panel */}
          <div className="space-y-4">
            <div className="sticky top-24 space-y-4 p-6 rounded-2xl border border-border bg-card">
              <div>
                <h3 className="font-semibold mb-1">Describe your dream design</h3>
                <p className="text-sm text-muted-foreground">Pick a style preset or write your own prompt.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setPrompt(s.prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Turn this living room into a warm, modern Mediterranean space with cream walls, oak floors, linen furniture and brass accents."
                rows={6}
                className="resize-none"
              />

              <Button
                onClick={generate}
                disabled={generating || !sourceImage}
                className="w-full h-12 text-base"
                size="lg"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Designing...</>
                ) : resultImage ? (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Try another style</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" /> Design my home</>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Results are AI-generated previews for inspiration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignYourHome;
