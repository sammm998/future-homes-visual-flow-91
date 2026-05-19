import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, Home, Pause, Play } from "lucide-react";
import baliImage from "@/assets/bali-destination.jpg";
import istanbulImage from "@/assets/istanbul-destination.jpg";
import marinaImage from "@/assets/marina-destination.jpg";
import aliKaranImage from "@/assets/ali-karan-founder.png";
import SEOHead from "@/components/SEOHead";

type Slide = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  image: string;
  imagePosition?: string;
  align: "left" | "right" | "center";
  accent: string;
  stat?: { value: string; label: string }[];
};

const slides: Slide[] = [
  {
    id: "intro",
    kicker: "Our Story",
    title: "Future Homes International",
    body: "A journey across continents — building homes, lives and legacies since 2007.",
    image: "/lovable-uploads/37669c23-a476-4550-84f1-f370ce4333a1.png",
    align: "center",
    accent: "from-amber-400/40 to-rose-500/30",
  },
  {
    id: "founder",
    kicker: "The Beginning",
    title: "A vision born in Antalya",
    body: "Founder Ali Karan started with a single belief: international property should feel as personal as buying a home in your own city. From a small office in Antalya, an international family was formed.",
    image: aliKaranImage,
    align: "right",
    accent: "from-orange-500/40 to-amber-300/20",
  },
  {
    id: "growth",
    kicker: "Growth",
    title: "From one office to four countries",
    body: "Today we operate across Turkey, Dubai, Cyprus and Bali — guiding clients from 50+ nationalities through every step of their property journey.",
    image: istanbulImage,
    align: "left",
    accent: "from-sky-500/30 to-indigo-500/30",
    stat: [
      { value: "4", label: "Countries" },
      { value: "50+", label: "Nationalities served" },
      { value: "17", label: "Years of trust" },
    ],
  },
  {
    id: "properties",
    kicker: "Our Homes",
    title: "Crafted apartments. Iconic views.",
    body: "From sea-front residences in Antalya to skyline penthouses in Dubai — every property in our portfolio is hand-selected for quality, location and investment potential.",
    image: marinaImage,
    align: "right",
    accent: "from-teal-400/30 to-emerald-500/30",
  },
  {
    id: "lifestyle",
    kicker: "Lifestyle",
    title: "More than a home — a life",
    body: "Mediterranean mornings, Bali sunsets, Dubai nights. We don't just sell square meters; we open doors to new lives.",
    image: baliImage,
    align: "left",
    accent: "from-rose-500/30 to-orange-400/30",
  },
  {
    id: "promise",
    kicker: "Our Promise",
    title: "With you, long after the keys",
    body: "Legal support, after-sales service, residency and citizenship guidance — our relationship doesn't end at the contract. It begins there.",
    image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.png",
    align: "center",
    accent: "from-violet-500/30 to-fuchsia-500/30",
  },
  {
    id: "cta",
    kicker: "Your Turn",
    title: "Write the next chapter with us",
    body: "Discover the home that will change your story.",
    image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.png",
    align: "center",
    accent: "from-amber-400/40 to-rose-500/30",
  },
];

const SLIDE_DURATION_MS = 7000;

const OurStory = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastChangeRef = useRef(Date.now());

  const go = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(((next % slides.length) + slides.length) % slides.length);
    setProgress(0);
    lastChangeRef.current = Date.now();
  }, [index]);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Auto-advance + progress
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - lastChangeRef.current;
      const p = Math.min(elapsed / SLIDE_DURATION_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setDirection(1);
        setIndex((i) => (i + 1) % slides.length);
        lastChangeRef.current = Date.now();
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(id);
  }, [paused, index]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Wheel + keyboard nav
  useEffect(() => {
    let wheelLock = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLock) return;
      if (Math.abs(e.deltaY) < 20) return;
      wheelLock = true;
      if (e.deltaY > 0) next(); else prev();
      setTimeout(() => { wheelLock = false; }, 800);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
      else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [next, prev]);

  // Touch
  useEffect(() => {
    let startY = 0;
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 50) { if (dy > 0) next(); else prev(); }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const slide = slides[index];

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden text-white select-none">
      <SEOHead
        title="Our Story | Future Homes International"
        description="The story of Future Homes International — from a small Antalya office to a global property family."
      />

      {/* Slides */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Background image with Ken Burns */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: SLIDE_DURATION_MS / 1000 + 1, ease: "linear" }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>

          {/* Gradient overlays */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} mix-blend-overlay`} />
          <div className={`absolute inset-0 ${
            slide.align === "left"
              ? "bg-gradient-to-r from-black/80 via-black/40 to-transparent"
              : slide.align === "right"
              ? "bg-gradient-to-l from-black/80 via-black/40 to-transparent"
              : "bg-gradient-to-t from-black/85 via-black/40 to-black/30"
          }`} />

          {/* Content */}
          <div className={`relative z-10 w-full h-full flex items-center px-6 md:px-20 ${
            slide.align === "right" ? "justify-end" : slide.align === "center" ? "justify-center" : "justify-start"
          }`}>
            <div className={`max-w-2xl ${slide.align === "center" ? "text-center" : ""}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/70 mb-6"
              >
                <span className="inline-block w-12 h-px bg-white/70 align-middle mr-3" />
                {slide.kicker}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg md:text-2xl text-white/85 leading-relaxed font-light"
              >
                {slide.body}
              </motion.p>

              {slide.stat && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.8 }}
                  className={`mt-12 flex gap-10 ${slide.align === "center" ? "justify-center" : ""}`}
                >
                  {slide.stat.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + i * 0.15, duration: 0.6 }}
                    >
                      <div className="text-4xl md:text-5xl font-serif text-white">{s.value}</div>
                      <div className="text-xs uppercase tracking-widest text-white/60 mt-2">{s.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {slide.id === "cta" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                  className="mt-10 flex gap-4 justify-center"
                >
                  <Link
                    to="/"
                    className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                  >
                    Explore properties
                  </Link>
                  <Link
                    to="/contact-us"
                    className="px-8 py-4 border border-white/40 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
                  >
                    Talk to us
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-6">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Home className="w-4 h-4" />
          <span className="text-sm tracking-wide">Future Homes</span>
        </Link>
        <button
          onClick={() => setPaused((p) => !p)}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress bars */}
      <div className="absolute top-20 left-6 right-6 md:left-10 md:right-10 z-30 flex gap-1.5">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-white origin-left"
              initial={false}
              animate={{
                scaleX: i < index ? 1 : i === index ? progress : 0,
              }}
              transition={{ duration: 0.05, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        ))}
      </div>

      {/* Side index */}
      <div className="absolute left-6 md:left-10 bottom-10 z-30 text-white/70 text-sm tracking-widest">
        <span className="text-white text-2xl font-serif">{String(index + 1).padStart(2, "0")}</span>
        <span className="mx-2 text-white/40">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Nav arrows */}
      <div className="absolute right-6 md:right-10 bottom-10 z-30 flex flex-col gap-3">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30"
          aria-label="Previous"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Next"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: index === 0 ? 0.6 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs tracking-widest uppercase pointer-events-none"
      >
        Scroll · Swipe · Arrow keys
      </motion.div>
    </div>
  );
};

export default OurStory;
