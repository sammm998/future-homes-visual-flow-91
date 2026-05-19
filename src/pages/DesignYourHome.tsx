import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useProperties } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, ArrowLeft, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";


type Step = "location" | "property" | "design";


const PROMPT_SUGGESTIONS = [
  "Modern Scandinavian style, light wood, white walls, cozy",
  "Luxury Mediterranean villa style with marble and gold accents",
  "Minimalist Japanese style with low furniture and warm wood tones",
  "Industrial loft style with exposed brick and black metal",
  "Bohemian style with colorful textiles, plants and rattan",
  "Modern coastal style with blue accents, linen and natural light",
];

export default function DesignYourHome() {
  const { properties, loading } = useProperties();
  const [step, setStep] = useState<Step>("location");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  const [interiorImages, setInteriorImages] = useState<string[]>([]);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const locations = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    properties.forEach((p: any) => {
      const city = (p.location || "").split(",")[0].trim();
      if (!city) return;
      if (!map.has(city)) map.set(city, { name: city, count: 1 });
      else map.get(city)!.count++;
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [properties]);

  const locationProperties = useMemo(() => {
    if (!selectedLocation) return [];
    return properties.filter((p: any) => (p.location || "").toLowerCase().startsWith(selectedLocation.toLowerCase()));
  }, [properties, selectedLocation]);

  // Use pre-classified interior_images from DB. Fallback to all property_images
  // (so the feature still works for properties that haven't been scanned yet).
  const getInteriors = (p: any): string[] => {
    if (Array.isArray(p?.interior_images) && p.interior_images.length > 0) return p.interior_images;
    if (Array.isArray(p?.property_images)) return p.property_images;
    return [];
  };

  // Only show properties that have at least one interior image (pre-classified).
  // Properties without interior_images yet are also shown so users aren't blocked.
  const filteredProperties = useMemo(() => {
    return locationProperties.filter((p: any) => getInteriors(p).length > 0);
  }, [locationProperties]);

  const handleSelectProperty = (p: any) => {
    setSelectedProperty(p);
    setBaseImage(null);
    setCurrentImage(null);
    setHistory([]);
    setPrompt("");

    const interiors = getInteriors(p);
    if (interiors.length === 0) {
      toast.error("No interior photos for this property");
      setInteriorImages([]);
      setStep("design");
      return;
    }
    setInteriorImages(interiors);
    setBaseImage(interiors[0]);
    setCurrentImage(interiors[0]);
    setHistory([interiors[0]]);
    setStep("design");
  };


  const handleSelectInterior = (img: string) => {
    setBaseImage(img);
    setCurrentImage(img);
    setHistory([img]);
    setPrompt("");
  };

  const propertyContext = selectedProperty
    ? `${selectedProperty.property_type || "apartment"} in ${selectedProperty.location_translated || selectedProperty.location}, ${selectedProperty.bedrooms || ""} bedrooms, ${selectedProperty.sizes_m2 || ""} m²`
    : "";

  const handleGenerate = async () => {
    if (!prompt.trim() || !currentImage) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("design-interior", {
        body: {
          imageUrl: currentImage,
          prompt: prompt.trim(),
          propertyContext,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.imageUrl) {
        setCurrentImage(data.imageUrl);
        setHistory((h) => [...h, data.imageUrl]);
        setPrompt("");
        toast.success("Design generated!");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate design");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    if (baseImage) {
      setCurrentImage(baseImage);
      setHistory([baseImage]);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentImage(newHistory[newHistory.length - 1]);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Design Your Home — AI Interior Designer | Future Homes</title>
        <meta name="description" content="Use AI to design and visualize your dream interior. Choose a property and redesign it with simple text prompts." />
      </Helmet>
      <Navigation />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Powered by Gemini</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Design Your Home</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a property, then redesign its interior with simple text prompts. Add furniture, change colors, restyle the room — all powered by AI.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm">
          {(["location", "property", "design"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i + 1}
              </div>
              <span className="capitalize hidden md:inline">{s}</span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Location */}
        {step === "location" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">1. Choose a location</h2>
            {loading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {locations.map((loc) => (
                  <Card
                    key={loc.name}
                    className="cursor-pointer overflow-hidden hover:shadow-lg transition-all p-6 flex flex-col items-center justify-center text-center min-h-[140px] bg-gradient-to-br from-primary/5 to-primary/20 hover:from-primary/10 hover:to-primary/30"
                    onClick={() => { setSelectedLocation(loc.name); setStep("property"); }}
                  >
                    <h3 className="text-xl font-semibold mb-1">{loc.name}</h3>
                    <p className="text-sm text-muted-foreground">{loc.count} properties</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Property */}
        {step === "property" && (
          <div>
            <Button variant="ghost" onClick={() => setStep("location")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to locations
            </Button>
            <h2 className="text-2xl font-semibold mb-2 text-center">2. Choose an apartment in {selectedLocation}</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Only properties with interior photos are shown.
            </p>
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No properties with interior photos available in {selectedLocation}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((p: any) => {
                  const interiors = getInteriors(p);
                  const thumb = interiors[0];
                  return (
                    <Card
                      key={p.id}
                      className="cursor-pointer hover:shadow-lg transition-all overflow-hidden hover:border-primary"
                      onClick={() => handleSelectProperty(p)}
                    >
                      {thumb && (
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img src={thumb} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-semibold line-clamp-2 mb-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{p.location_translated || p.location}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                          {p.bedrooms && <span className="px-2 py-1 bg-muted rounded">{p.bedrooms} bed</span>}
                          {p.bathrooms && <span className="px-2 py-1 bg-muted rounded">{p.bathrooms} bath</span>}
                          {p.sizes_m2 && <span className="px-2 py-1 bg-muted rounded">{p.sizes_m2} m²</span>}
                        </div>
                        <p className="text-sm font-medium text-primary">{p.starting_price_eur || p.price}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}


          </div>
        )}

        {/* Step 3: Design */}
        {step === "design" && selectedProperty && (
          <div>
            <Button variant="ghost" onClick={() => setStep("property")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to properties
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                    {currentImage ? (
                      <img src={currentImage} alt="Your design" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No interior photo selected</p>
                        <p className="text-sm mt-1">Pick an interior shot on the right to start designing.</p>
                      </div>
                    )}
                    {generating && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-3">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <p className="text-sm">Designing your space with AI...</p>
                      </div>
                    )}
                  </div>
                </Card>

                {history.length > 1 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold mb-2 text-muted-foreground">YOUR DESIGNS</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {history.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(img)}
                          className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${currentImage === img ? "border-primary" : "border-transparent"}`}
                        >
                          <img src={img} alt={`v${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-1">{selectedProperty.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProperty.location_translated || selectedProperty.location}</p>
                </Card>

                <Card className="p-4 space-y-3">
                  <label className="text-sm font-semibold">Choose an interior photo</label>
                  {loadingInteriors ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Filtering out facades…
                    </div>
                  ) : interiorImages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No interior photos available for this property.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {interiorImages.map((img) => (
                        <button
                          key={img}
                          onClick={() => handleSelectInterior(img)}
                          disabled={generating}
                          className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${baseImage === img ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-primary/50"}`}
                        >
                          <img src={img} alt="interior" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </Card>


                <Card className="p-4 space-y-3">
                  <label className="text-sm font-semibold">Refine your design</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Add red velvet sofas in the corner, warm wood floor, large windows..."
                    className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={generating || !currentImage}
                  />
                  <Button onClick={handleGenerate} disabled={generating || !prompt.trim() || !currentImage} className="w-full">
                    {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Apply design</>}
                  </Button>


                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={history.length < 2 || generating} className="flex-1">
                      Undo
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset} disabled={history.length < 2 || generating} className="flex-1">
                      <RotateCcw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                    {currentImage && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentImage} download="design.png" target="_blank" rel="noreferrer">
                          <Download className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground">QUICK IDEAS</p>
                  <div className="flex flex-col gap-2">
                    {PROMPT_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPrompt(s)}
                        disabled={generating}
                        className="text-left text-xs p-2 rounded bg-muted hover:bg-muted/70 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
