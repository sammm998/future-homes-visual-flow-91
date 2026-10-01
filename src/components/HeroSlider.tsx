import { useEffect, useState } from 'react';
import heroEstate from '@/assets/hero-modern-estate.webp';
import heroEstateMobile from '@/assets/hero-modern-estate-768.webp';
import heroEstateLaptop from '@/assets/hero-modern-estate-1200.webp';
import broll1 from '@/assets/hero-broll-1.mp4.asset.json';
import broll2 from '@/assets/hero-broll-2.mp4.asset.json';

const CLIPS = [broll1.url, broll2.url];

const HeroSlider = () => {
  const [enableVideo, setEnableVideo] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setTimeout(() => setEnableVideo(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div dir="ltr" className="absolute inset-0 overflow-hidden bg-navy">
      <img
        src={heroEstate}
        srcSet={`${heroEstateMobile} 768w, ${heroEstateLaptop} 1200w, ${heroEstate} 1920w`}
        sizes="100vw"
        alt="Modern Mediterranean estate overlooking the sea at sunset"
        width={1920}
        height={1080}
        className="h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      {enableVideo &&
        CLIPS.map((src, i) => (
          <video
            key={src}
            src={src}
            muted
            playsInline
            autoPlay={i === 0}
            preload={i === 0 ? 'auto' : 'metadata'}
            aria-hidden="true"
            ref={(el) => {
              if (!el) return;
              if (i === active) {
                if (el.paused) el.play().catch(() => {});
              } else if (!el.paused) {
                el.pause();
                el.currentTime = 0;
              }
            }}
            onEnded={() => setActive((a) => (a + 1) % CLIPS.length)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/55 to-navy/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-navy/10" />
    </div>
  );
};

export default HeroSlider;
