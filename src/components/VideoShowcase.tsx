import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MapPin, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const VideoShowcase = () => {
  const [selectedCity, setSelectedCity] = useState("dubai");
  const [showModal, setShowModal] = useState(false);

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
    <>
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Compact Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Play className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Video Tour</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Explore Our <span className="text-primary">Destinations</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Virtual tours of premium locations
            </p>
          </motion.div>

          {/* Compact Video Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {cities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedCity(city.id);
                  setShowModal(true);
                }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-border/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <img
                    src={city.thumbnail}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300"
                    >
                      <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                    </motion.div>
                  </div>

                  {/* City label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{city.flag}</span>
                        <h3 className="text-sm font-semibold text-white">{city.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-border/20">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video container */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedCityData?.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${selectedCityData?.name} Video`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video info */}
            <div className="p-6 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="text-xl font-bold text-white">{selectedCityData?.name}</h3>
                <span className="text-xl">{selectedCityData?.flag}</span>
              </div>
              <p className="text-white/80">{selectedCityData?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoShowcase;