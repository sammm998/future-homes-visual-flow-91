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
    <section className="w-full min-h-[calc(100svh-7rem)] relative overflow-hidden cinematic-section">
      <HeroSlider />

      <div className="flex flex-col min-h-[calc(100svh-7rem)]">
        <div className="flex-1 px-4 py-14 sm:px-8 lg:px-16 relative z-10 flex flex-col justify-center items-center">
          <div className="max-w-7xl w-full text-center cinematic-reveal">
            <p className="cinematic-rule text-brand-accent text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              Future Homes International
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-brand-foreground mb-5 sm:mb-7 flex items-center justify-center leading-[0.98] drop-shadow-sm">
              {title || t('hero.title')}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-brand-foreground/85 mb-8 sm:mb-12 flex items-center justify-center font-light">
              {subtitle || t('hero.subtitle')}
            </p>

            {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
          </div>
        </div>
        <div className="relative z-10 pb-6 flex justify-center" aria-hidden="true">
          <div className="h-12 w-px bg-gradient-to-b from-brand-foreground/70 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
