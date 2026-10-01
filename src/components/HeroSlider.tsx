import { useEffect, useRef, useState } from 'react';
import heroEstate from '@/assets/hero-modern-estate.webp';
import heroEstateMobile from '@/assets/hero-modern-estate-768.webp';
import heroEstateLaptop from '@/assets/hero-modern-estate-1200.webp';
import broll1 from '@/assets/hero-broll-1.mp4.asset.json';
import broll2 from '@/assets/hero-broll-2.mp4.asset.json';

const CLIPS = [broll2.url, broll1.url];
const CROSSFADE_MS = 1200;

const HeroSlider = () => {
  const [enableVideo, setEnableVideo] = useState(false);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const activeIndex = useRef(0);
  const transitioning = useRef(false);
  const cleanupTimer = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setTimeout(() => setEnableVideo(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => () => {
    if (cleanupTimer.current) window.clearTimeout(cleanupTimer.current);
  }, []);

  const transitionToNext = (index: number) => {
    if (index !== activeIndex.current || transitioning.current) return;
    const nextIndex = (index + 1) % CLIPS.length;
    const next = videos.current[nextIndex];
    const current = videos.current[index];
    if (!next || !current) return;

    transitioning.current = true;
    // Start the incoming clip before revealing it; keep the outgoing frame alive
    // throughout the crossfade rather than pausing it on the state change.
    next.play().then(() => {
      activeIndex.current = nextIndex;
      setActive(nextIndex);
      cleanupTimer.current = window.setTimeout(() => {
        current.pause();
        current.currentTime = 0;
        transitioning.current = false;
        cleanupTimer.current = null;
      }, CROSSFADE_MS);
    }).catch(() => {
      transitioning.current = false;
    });
  };

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
            preload="auto"
            aria-hidden="true"
            ref={(el) => { videos.current[i] = el; }}
            onPlaying={() => { if (i === 0) setStarted(true); }}
            onTimeUpdate={(event) => {
              const video = event.currentTarget;
              if (Number.isFinite(video.duration) && video.duration - video.currentTime <= 1.8) {
                transitionToNext(i);
              }
            }}
            onEnded={() => transitionToNext(i)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === active && started ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/55 to-navy/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-navy/10" />
    </div>
  );
};

export default HeroSlider;
