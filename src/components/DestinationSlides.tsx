import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import antalyaImage from "@/assets/antalya-luxury.jpg";
import dubaiImage from "@/assets/dubai-luxury.jpg";
import cyprusImage from "@/assets/cyprus-luxury.jpg";
import bodrumImage from "@/assets/bodrum-luxury.jpg";
import istanbulImage from "@/assets/istanbul-luxury.jpg";

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  flag: string;
}

const destinations: Destination[] = [
  {
    id: "antalya",
    name: "Antalya",
    country: "Turkey",
    description: "Mediterranean paradise with stunning beaches, modern complexes and investment opportunities",
    image: antalyaImage,
    flag: "🇹🇷"
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    description: "Iconic skyline, luxury living and world-class amenities in the heart of the Middle East",
    image: dubaiImage,
    flag: "🇦🇪"
  },
  {
    id: "cyprus",
    name: "Cyprus",
    country: "Cyprus",
    description: "Crystal clear waters, Mediterranean charm and excellent citizenship investment programs",
    image: cyprusImage,
    flag: "🇨🇾"
  },
  {
    id: "bodrum",
    name: "Bodrum",
    country: "Turkey",
    description: "Exclusive Aegean resort destination with traditional architecture and luxury lifestyle",
    image: bodrumImage,
    flag: "🇹🇷"
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    description: "Where East meets West - premium Bosphorus properties with stunning city views",
    image: istanbulImage,
    flag: "🇹🇷"
  }
];

const DestinationSlides = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentDestination = destinations[currentIndex];

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <img
            src={currentDestination.image}
            alt={currentDestination.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{currentDestination.flag}</span>
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {currentDestination.country}
                </span>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              {currentDestination.name}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              {currentDestination.description}
            </p>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => window.location.href = `/${currentDestination.id.toLowerCase()}`}
            >
              Explore Properties
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-4 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="pointer-events-auto bg-background/20 hover:bg-background/40 backdrop-blur-sm text-foreground border border-border/20"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="pointer-events-auto bg-background/20 hover:bg-background/40 backdrop-blur-sm text-foreground border border-border/20"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-24 left-0 right-0 z-30 hidden md:flex justify-center gap-4 px-4">
        {destinations.map((dest, index) => (
          <button
            key={dest.id}
            onClick={() => goToSlide(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
              index === currentIndex
                ? "border-primary scale-110 shadow-lg"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-1">
              <span className="text-xs font-semibold text-foreground">
                {dest.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DestinationSlides;
