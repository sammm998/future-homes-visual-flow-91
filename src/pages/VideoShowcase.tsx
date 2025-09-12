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
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Play className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Video Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Property <span className="text-primary">Video Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Take immersive virtual tours of our premium properties across Dubai, Antalya, and Cyprus. 
              Click any video to start your journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {allVideos.length} Premium Videos
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                3 Destinations
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                HD Quality
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {cities.map((city, cityIndex) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: cityIndex * 0.2 }}
              className="mb-16 last:mb-0"
            >
              {/* City Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl">{city.flag}</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{city.name}</h2>
                  <p className="text-muted-foreground">{city.description}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {city.videos.length} Videos
                  </span>
                </div>
              </div>

              {/* Video Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {city.videos.map((video, videoIndex) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: videoIndex * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer"
                    onClick={() => openVideo({
                      ...video,
                      cityName: city.name,
                      cityFlag: city.flag,
                      cityDescription: city.description
                    })}
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-border/20 group-hover:shadow-2xl transition-all duration-500">
                      {/* Video Thumbnail */}
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500">
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-primary/90 group-hover:border-primary transition-all duration-300"
                          >
                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                          </motion.div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-white/90 text-sm font-medium">
                              {city.name} {city.flag}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                            {video.title}
                          </h3>
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
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&mute=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&controls=1&showinfo=0`}
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