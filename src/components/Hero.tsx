import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import HeroSearchStatic from "@/components/HeroSearchStatic";
import { useTranslation } from "@/hooks/useTranslation";

interface HeroProps {
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle
}) => {
  const { t } = useTranslation();

  // Lazy-load the polished Radix-based search form after the page is idle so
  // the initial paint/hydration stays lightweight. The static native form is
  // shown immediately and is fully functional.
  const [InteractiveSearch, setInteractiveSearch] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("@/components/HeroSearch")
        .then((m) => {
          if (!cancelled) {
            setInteractiveSearch(() => m.HeroSearch);
          }
        })
        .catch(() => {
          // Keep the static form if the interactive chunk fails to load.
        });
    };

    if (typeof window !== "undefined") {
      // Load after a short delay to keep the initial paint/hydration lean, but
      // also load immediately on first user interaction so the polished form
      // is available before the user needs it.
      const t = setTimeout(load, 300);
      const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
      const onInteraction = () => {
        clearTimeout(t);
        load();
      };
      events.forEach((e) => window.addEventListener(e, onInteraction, { once: true, passive: true }));

      return () => {
        cancelled = true;
        clearTimeout(t);
        events.forEach((e) => window.removeEventListener(e, onInteraction));
      };
    }
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden -mt-20 pt-20">
      <HeroSlider />

      <div className="flex flex-col h-full min-h-screen">
        <div className="flex-1 p-4 sm:p-8 lg:p-16 relative z-10 flex flex-col justify-center items-center">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4 sm:mb-6 min-h-[5.5rem] sm:min-h-[7rem] md:min-h-[10rem] flex items-center justify-center">
              {title || t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 mb-8 sm:mb-12 min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center">
              {subtitle || t('hero.subtitle')}
            </p>

            {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
