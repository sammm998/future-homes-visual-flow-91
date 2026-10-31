import { useEffect, useRef, useState } from 'react';
import { homeHeroImage } from '@/lib/homeHeroImage';
import { useMediaVisibility } from '@/hooks/useMediaVisibility';
import broll1 from '@/assets/hero-broll-1-optimized.mp4.asset.json';
import broll2 from '@/assets/hero-broll-2-optimized.mp4.asset.json';
import broll1m from '@/assets/hero-broll-1-mobile.mp4.asset.json';
import broll2m from '@/assets/hero-broll-2-mobile.mp4.asset.json';

const DESKTOP_CLIPS = [broll2.url, broll1.url];
// Phones get light portrait-cropped 640p versions (~300 KB each).
const MOBILE_CLIPS = [broll2m.url, broll1m.url];
const CROSSFADE_MS = 1200;

const HeroSlider = () => {
  const { ref, visible } = useMediaVisibility<HTMLDivElement>();
  const [enableVideo, setEnableVideo] = useState(false);
  const [CLIPS, setClips] = useState(DESKTOP_CLIPS);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const activeIndex = useRef(0);
  const transitioning = useRef(false);
  const cleanupTimer = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (reduce || conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? '')) return;
    // Videos start only after the page has fully loaded and the browser is idle,
    // so they never compete with the first paint.
    if (window.innerWidth < 768) setClips(MOBILE_CLIPS);
    let id = 0;
    let idleId: number | undefined;
    const start = () => {
      const run = () => setEnableVideo(true);
      // An idle callback can fire immediately on slow networks. Allow the still
      // image and text to finish painting before requesting either video.
      id = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(run, { timeout: 4000 });
        } else run();
      }, 8000);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(id);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, []);

  useEffect(() => () => {
    if (cleanupTimer.current) window.clearTimeout(cleanupTimer.current);
  }, []);

  useEffect(() => {
    if (!enableVideo) return;
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (visible && index === activeIndex.current) {
        void video.play().catch(() => {});
      } else if (!visible) {
        video.pause();
      }
    });
  }, [visible, enableVideo]);

  const transitionToNext = (index: number) => {
    if (!visible || index !== activeIndex.current || transitioning.current) return;
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
    <div ref={ref} dir="ltr" className="absolute inset-0 overflow-hidden bg-navy">
      <img
        src={homeHeroImage.src}
        srcSet={homeHeroImage.srcSet}
        sizes={homeHeroImage.sizes}
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
            src={visible || started ? src : undefined}
            muted
            playsInline
            autoPlay={visible && i === 0}
            preload={i === 0 ? "auto" : "metadata"}
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
