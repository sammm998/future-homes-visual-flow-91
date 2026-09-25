import { useEffect, useState } from 'react';

import baliImage from '@/assets/bali-destination.webp';
import marinaImage from '@/assets/marina-destination.webp';
import istanbulImage from '@/assets/istanbul-destination.webp';
import antalyaVideo from '@/assets/hero-video-antalya.mp4.asset.json';
import istanbulVideo from '@/assets/hero-video-istanbul.mp4.asset.json';
import dubaiVideo from '@/assets/hero-video-dubai.mp4.asset.json';
import mersinVideo from '@/assets/hero-video-mersin.mp4.asset.json';
import cyprusVideo from '@/assets/hero-video-cyprus.mp4.asset.json';
import baliVideo from '@/assets/hero-video-bali.mp4.asset.json';

const slides = [
  {
    image: "/lovable-uploads/hero-antalya-1200.webp",
    srcSet: "/lovable-uploads/hero-antalya-768.webp 768w, /lovable-uploads/hero-antalya-1200.webp 1200w",
    video: antalyaVideo.url,
    alt: "Antalya - Turkish Riviera Paradise"
  },
  {
    image: istanbulImage,
    video: istanbulVideo.url,
    alt: "Istanbul - Where East Meets West"
  },
  {
    image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.webp",
    video: dubaiVideo.url,
    alt: "Dubai - Modern Metropolis"
  },
  {
    image: marinaImage,
    video: mersinVideo.url,
    alt: "Mersin - Mediterranean Coastal"
  },
  {
    image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.webp",
    video: cyprusVideo.url,
    alt: "Cyprus - Island Paradise"
  },
  {
    image: baliImage,
    video: baliVideo.url,
    alt: "Bali - Island of Gods Paradise"
  }
];

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [videosEnabled, setVideosEnabled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReduceMotion(media.matches);
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);

    const enable = window.setTimeout(() => setVideosEnabled(true), 1200);
    return () => {
      window.clearTimeout(enable);
      media.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current);
        return (current + 1) % slides.length;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const nextIndex = (activeIndex + 1) % slides.length;

  return (
    <div dir="ltr" className="absolute inset-0 w-full h-full overflow-hidden bg-muted" aria-hidden="true">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const shouldLoadVideo = videosEnabled && !reduceMotion && (
          isActive || index === previousIndex || index === nextIndex
        );

        return (
          <div
            key={slide.alt}
            className={`absolute inset-0 transition-opacity ease-in-out duration-[1400ms] ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={slide.image}
              srcSet={slide.srcSet}
              sizes={slide.srcSet ? "100vw" : undefined}
              alt=""
              width={1200}
              height={675}
              className="absolute inset-0 w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding={index === 0 ? "sync" : "async"}
            />
            {shouldLoadVideo && (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={slide.video}
                poster={slide.image}
                autoPlay={isActive}
                muted
                loop
                playsInline
                preload={isActive ? "auto" : "metadata"}
              />
            )}
          </div>
        );
      })}
      <div className="absolute inset-0 z-20 bg-black/50" />
    </div>
  );
};


export default HeroSlider;
