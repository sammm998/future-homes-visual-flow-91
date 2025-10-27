import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Home, Building, Store } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { useCurrency } from "@/contexts/CurrencyContext";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface HeroWithMarqueeProps {
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
}

const HeroWithMarquee: React.FC<HeroWithMarqueeProps> = ({
  title,
  subtitle
}) => {
  const navigate = useNavigate();
  const { selectedCurrency } = useCurrency();
  const [searchType, setSearchType] = useState("Buy");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const [refNo, setRefNo] = useState("");
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('property_images')
          .eq('is_active', true)
          .not('property_images', 'is', null)
          .limit(20);

        if (error) throw error;

        const images: string[] = [];
        data?.forEach(property => {
          if (property.property_images && Array.isArray(property.property_images)) {
            property.property_images.forEach(img => {
              if (img && !img.includes('cdn.futurehomesturkey.com')) {
                images.push(img);
              }
            });
          }
        });

        setPropertyImages(images.slice(0, 16));
      } catch (error) {
        console.error('Error fetching property images:', error);
      }
    };

    fetchPropertyImages();
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchType) params.append('searchType', searchType);
    if (propertyType) params.append('propertyType', propertyType);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (location) params.append('location', location);
    if (refNo) params.append('refNo', refNo);
    
    navigate(`/properties?${params.toString()}`);
  }, [navigate, searchType, propertyType, bedrooms, location, refNo]);

  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
  };

  const duplicatedImages = [...propertyImages, ...propertyImages];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video - YouTube embed */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/F7N_4SyQaPk?autoplay=1&mute=1&loop=1&playlist=F7N_4SyQaPk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          className="absolute object-cover"
          style={{
            width: 'calc(100vw + 20vh)',
            height: 'calc(100vh + 20vw)', 
            minWidth: '177.77vh',
            minHeight: '56.25vw',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.2)',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Animated Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6"
        >
          {(title || "Future Homes").split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={FADE_IN_ANIMATION_VARIANTS}
              className="inline-block"
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.5 }}
          className="text-xl text-neutral-200 mb-8 max-w-xl"
        >
          {subtitle || "Your Future Real Estate Partner"}
        </motion.p>

        {/* Search Button with Dialog */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
        >
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="h-14 px-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold rounded-full"
              >
                <Search className="mr-2" size={24} />
                Search Properties
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-5xl">
              <Card className="border-0 shadow-none">
                {/* Search Type Tabs */}
                <div className="flex justify-center mb-6">
                  <div className="bg-muted rounded-lg p-1 inline-flex">
                    <button
                      className={cn(
                        "px-6 py-2 rounded-md text-sm font-medium transition-all",
                        searchType === "Buy"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted-foreground/10"
                      )}
                      onClick={() => setSearchType("Buy")}
                    >
                      Buy
                    </button>
                    <button
                      className={cn(
                        "px-6 py-2 rounded-md text-sm font-medium transition-all",
                        searchType === "Rent"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted-foreground/10"
                      )}
                      onClick={() => setSearchType("Rent")}
                    >
                      Rent
                    </button>
                  </div>
                </div>

                {/* Search Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartments">
                        <div className="flex items-center gap-2">
                          <Building size={16} />
                          Apartments
                        </div>
                      </SelectItem>
                      <SelectItem value="villas">
                        <div className="flex items-center gap-2">
                          <Home size={16} />
                          Villas
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="antalya">Antalya</SelectItem>
                      <SelectItem value="alanya">Alanya</SelectItem>
                      <SelectItem value="dubai">Dubai</SelectItem>
                      <SelectItem value="cyprus">Cyprus</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="lg:col-span-2">
                    <Input
                      placeholder="Reference No or Keywords"
                      value={refNo}
                      onChange={(e) => setRefNo(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => {
                    handleSearch();
                    setShowFilters(false);
                  }}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
                >
                  <Search className="mr-2" size={20} />
                  Search Properties
                </Button>
              </Card>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Animated Image Marquee at Bottom - Larger Images */}
      {propertyImages.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-2/5 md:h-1/2 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] z-0">
          <motion.div
            className="flex gap-6"
            animate={{
              x: ["-50%", "0%"],
              transition: {
                ease: "linear",
                duration: 40,
                repeat: Infinity,
              },
            }}
          >
            {duplicatedImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] h-56 md:h-80 lg:h-96 flex-shrink-0"
                style={{
                  rotate: `${(index % 2 === 0 ? -2 : 5)}deg`,
                }}
              >
                <img
                  src={src}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl shadow-xl"
                />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default HeroWithMarquee;
