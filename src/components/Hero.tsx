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
    <section className="relative -mt-20 min-h-[92svh] w-full overflow-hidden pt-20">
      <HeroSlider />

      <div className="relative z-10 flex min-h-[92svh] flex-col justify-end px-4 pb-24 pt-28 sm:px-8 md:pb-28 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl border-l border-gold/70 pl-5 text-left sm:pl-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">Future Homes International</p>
            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.03] text-navy-foreground sm:text-5xl md:text-7xl lg:text-8xl">
              {title || t('hero.title')}
            </h1>
            <p className="mb-8 mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/80 sm:text-lg md:text-xl">
              {subtitle || t('hero.subtitle')}
            </p>
          </div>
          {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
        </div>
      </div>
    </section>
  );
};

export default Hero;
