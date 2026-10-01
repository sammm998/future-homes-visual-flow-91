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
    <section className="bg-ivory px-3 pb-3 pt-3 sm:px-5 sm:pb-5 lg:px-8 lg:pb-8">
      <div className="relative min-h-[720px] overflow-hidden rounded-lg shadow-[var(--shadow-luxe)] sm:min-h-[760px]">
        <HeroSlider />

        <div className="relative z-10 flex min-h-[720px] flex-col items-center justify-center px-4 pb-10 pt-24 text-center sm:min-h-[760px] sm:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-5xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-gold">Future Homes International</p>
            <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-none text-navy-foreground sm:text-6xl md:text-8xl lg:text-9xl">
              {title || t('hero.title')}
            </h1>
            <p className="mx-auto mb-12 mt-6 max-w-2xl text-base italic leading-relaxed text-navy-foreground/85 sm:text-lg md:text-xl">
              {subtitle || t('hero.subtitle')}
            </p>
          </div>
          {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
