import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MapPin } from "lucide-react";

const VideoShowcase = () => {
  const [selectedCity, setSelectedCity] = useState("dubai");
  const [isPlaying, setIsPlaying] = useState(false);

  const cities = [
    {
      id: "dubai",
      name: "Dubai",
      flag: "🇦🇪",
      videoId: "_akWMCrxcaM",
      thumbnail: "/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.png",
      description: "Experience luxury living in the heart of Dubai"
    },
    {
      id: "antalya", 
      name: "Antalya",
      flag: "🇹🇷",
      videoId: "G4qgEcpSZ9c",
      thumbnail: "/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png",
      description: "Discover Mediterranean paradise in Antalya"
    },
    {
      id: "cyprus",
      name: "Cyprus", 
      flag: "🇨🇾",
      videoId: "_eYeY9EAlxs",
      thumbnail: "/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.png",
      description: "Explore island living in beautiful Cyprus"
    }
  ];

  const selectedCityData = cities.find(city => city.id === selectedCity);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Cinema-style lighting effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Video Gallery</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            Discover Your
            <br />
            <span className="text-primary">Dream Location</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a virtual tour through our premium destinations
          </p>
        </motion.div>

        {/* City Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex gap-4 p-2 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  selectedCity === city.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span className="text-xl">{city.flag}</span>
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Video Player */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-border/20">
            {/* Cinema-style frame */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10 pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] z-10 pointer-events-none" />
            
            <div className="aspect-video relative">
              {!isPlaying ? (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src={selectedCityData?.thumbnail}
                    alt={selectedCityData?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300"
                    >
                      <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                    </motion.div>
                  </div>

                  {/* City info overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="text-2xl font-bold text-white">{selectedCityData?.name}</h3>
                        <span className="text-2xl">{selectedCityData?.flag}</span>
                      </div>
                      <p className="text-white/80 text-lg">{selectedCityData?.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedCityData?.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${selectedCityData?.name} Video`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Cinema-style bottom lighting */}
          <div className="h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-b-3xl -mt-4 relative z-0" />
        </motion.div>

        {/* Floating elements for ambiance */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-32 right-16 w-1 h-1 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};

export default VideoShowcase;