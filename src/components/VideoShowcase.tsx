import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const VideoShowcase = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeCity, setActiveCity] = useState("dubai");

  const cities = [
    {
      id: "dubai",
      name: "Dubai",
      flag: "🇦🇪",
      description: "Experience luxury living in the heart of Dubai",
      videos: [
        { id: "_akWMCrxcaM", title: "Dubai Luxury Properties" },
        { id: "q-Co4EL68Xo", title: "Dubai Waterfront Living" },
        { id: "0FpNFd2y5CE", title: "Dubai Modern Developments" }
      ]
    },
    {
      id: "antalya", 
      name: "Antalya",
      flag: "🇹🇷",
      description: "Discover Mediterranean paradise in Antalya",
      videos: [
        { id: "G4qgEcpSZ9c", title: "Antalya Coastal Properties" }
      ]
    },
    {
      id: "cyprus",
      name: "Cyprus", 
      flag: "🇨🇾",
      description: "Explore island living in beautiful Cyprus",
      videos: [
        { id: "_eYeY9EAlxs", title: "Cyprus Island Living" }
      ]
    }
  ];

  const selectedCityData = selectedCity ? cities.find(city => city.id === selectedCity) : null;
  const currentVideo = selectedCityData?.videos[currentVideoIndex];

  const openCityGallery = (cityId) => {
    setSelectedCity(cityId);
    setCurrentVideoIndex(0);
    setShowModal(true);
  };

  const nextVideo = () => {
    if (selectedCityData && currentVideoIndex < selectedCityData.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const activeCityData = cities.find(city => city.id === activeCity);

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Video Tour</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Explore Our <span className="text-primary">Destinations</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Virtual tours of premium locations around the world
            </p>
          </motion.div>

          {/* Main Video Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Left Sidebar - Categories */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-semibold mb-6">Destinations</h3>
              <div className="space-y-3">
                {cities.map((city) => (
                  <motion.button
                    key={city.id}
                    onClick={() => setActiveCity(city.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                      activeCity === city.id
                        ? 'bg-primary/10 border-primary/30 shadow-lg'
                        : 'bg-card border-border hover:border-primary/20 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{city.flag}</span>
                        <h4 className="font-semibold">{city.name}</h4>
                      </div>
                      {city.videos.length > 1 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {city.videos.length}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{city.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Video Display */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              {/* Main Video */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/20 mb-6">
                <img
                  src={`https://img.youtube.com/vi/${activeCityData?.videos[0].id}/maxresdefault.jpg`}
                  alt={activeCityData?.name}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={() => openCityGallery(activeCity)}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openCityGallery(activeCity)}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-300"
                  >
                    <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                  </motion.div>
                </div>
              </div>

              {/* Video Info */}
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-2">{activeCityData?.videos[0].title}</h4>
                <p className="text-muted-foreground">{activeCityData?.description}</p>
              </div>

              {/* Video Gallery Thumbnails */}
              {activeCityData && activeCityData.videos.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeCityData.videos.slice(1).map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => {
                        setCurrentVideoIndex(index + 1);
                        openCityGallery(activeCity);
                      }}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border/20 group-hover:border-primary/30 transition-all duration-300">
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 flex items-center justify-center transition-colors duration-300">
                          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <h5 className="text-sm font-medium mt-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h5>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Gallery Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 bg-black border-border/20">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Navigation arrows */}
            {selectedCityData && selectedCityData.videos.length > 1 && (
              <>
                <button
                  onClick={prevVideo}
                  disabled={currentVideoIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextVideo}
                  disabled={currentVideoIndex === selectedCityData.videos.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Video container */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                key={currentVideo?.id}
                src={`https://www.youtube.com/embed/${currentVideo?.id}?autoplay=1&mute=1&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&playlist=${currentVideo?.id}&loop=1`}
                title={currentVideo?.title || `${selectedCityData?.name} Video`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video info and gallery navigation */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-xl font-bold text-white">{selectedCityData?.name}</h3>
                  <span className="text-xl">{selectedCityData?.flag}</span>
                </div>
                {selectedCityData && selectedCityData.videos.length > 1 && (
                  <div className="text-sm text-white/70">
                    {currentVideoIndex + 1} / {selectedCityData.videos.length}
                  </div>
                )}
              </div>
              
              <p className="text-white/80 mb-4">{currentVideo?.title}</p>

              {/* Video thumbnails gallery */}
              {selectedCityData && selectedCityData.videos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {selectedCityData.videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-colors ${
                        index === currentVideoIndex 
                          ? 'border-primary' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoShowcase;