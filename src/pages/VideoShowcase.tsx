import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MapPin, X, Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";

const VideoShowcasePage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cities = [
    {
      id: "dubai",
      name: "Dubai",
      flag: "🇦🇪",
      description: "Experience luxury living in the heart of Dubai",
      videos: [
        { id: "_akWMCrxcaM", title: "Dubai Luxury Properties", duration: "3:45" },
        { id: "q-Co4EL68Xo", title: "Dubai Waterfront Living", duration: "4:20" },
        { id: "0FpNFd2y5CE", title: "Dubai Modern Apartments", duration: "2:58" }
      ]
    },
    {
      id: "antalya", 
      name: "Antalya",
      flag: "🇹🇷",
      description: "Discover Mediterranean paradise in Antalya",
      videos: [
        { id: "G4qgEcpSZ9c", title: "Antalya Coastal Properties", duration: "5:12" },
        { id: "b2vVzPWM4UE", title: "Antalya Luxury Living", duration: "3:33" },
        { id: "nT9e7UvjFAY", title: "Antalya Premium Developments", duration: "4:07" }
      ]
    },
    {
      id: "cyprus",
      name: "Cyprus", 
      flag: "🇨🇾",
      description: "Explore island living in beautiful Cyprus",
      videos: [
        { id: "_eYeY9EAlxs", title: "Cyprus Island Living", duration: "3:28" },
        { id: "6samL2SdYG8", title: "Cyprus Premium Properties", duration: "4:45" }
      ]
    }
  ];

  // Flatten all videos into a single array with city information
  const allVideos = cities.flatMap(city => 
    city.videos.map(video => ({
      ...video,
      cityName: city.name,
      cityFlag: city.flag,
      cityId: city.id,
      cityDescription: city.description
    }))
  );

  const openVideo = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Video Showcase - Future Homes Property Tours"
        description="Explore our premium properties through immersive video tours. Virtual walkthrough of luxury homes in Dubai, Antalya, and Cyprus."
        keywords="property video tours, virtual property viewing, Dubai properties video, Antalya real estate tours, Cyprus property showcase"
      />
      
      <Navigation />
      
      {/* Simple Header */}
      <section className="pt-12 pb-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Video Gallery</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Property Video Collection
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore premium properties through immersive virtual tours
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {cities.map((city, cityIndex) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: cityIndex * 0.1 }}
              className="mb-20 last:mb-0"
            >
              {/* City Header - More Elegant */}
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl"></div>
                <div className="relative flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl border border-primary/20">
                      {city.flag}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{city.name}</h2>
                      <p className="text-muted-foreground mt-1">{city.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-primary">{city.videos.length} Videos</span>
                  </div>
                </div>
              </div>

              {/* Video Cards Grid - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {city.videos.map((video, videoIndex) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: videoIndex * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="group cursor-pointer"
                    onClick={() => openVideo({
                      ...video,
                      cityName: city.name,
                      cityFlag: city.flag,
                      cityDescription: city.description
                    })}
                  >
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20">
                      {/* Video Thumbnail */}
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      />
                      
                      {/* Enhanced Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/20 group-hover:to-transparent transition-all duration-500">
                        
                        {/* Play Button - More Prominent */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center group-hover:bg-primary/95 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/40 transition-all duration-400"
                          >
                            <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                          </motion.div>
                        </div>


                        {/* Video Info - Better Typography */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-white/90 text-sm font-semibold">
                              {city.name} {city.flag}
                            </span>
                          </div>
                          <h3 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300 mb-2">
                            {video.title}
                          </h3>
                          <div className="w-12 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black border-none m-0">
          <div className="relative w-full h-full flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video container */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-6xl aspect-video">
                {selectedVideo && (
                  <iframe
                    key={selectedVideo.id}
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&mute=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&controls=1&showinfo=0&loop=0&playlist=${selectedVideo.id}&end=1`}
                    title={selectedVideo.title}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Video info */}
            {selectedVideo && (
              <div className="p-6 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white">{selectedVideo.cityName}</h3>
                  <span className="text-2xl">{selectedVideo.cityFlag}</span>
                </div>
                <p className="text-white/90 text-lg font-medium mb-2">{selectedVideo.title}</p>
                <p className="text-white/70">{selectedVideo.cityDescription}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoShowcasePage;