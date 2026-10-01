import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import HeroSearchStatic from "@/components/HeroSearchStatic";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cc, whatsappLink } from "@/utils/conversionCopy";
import { getCurrentLanguage } from "@/utils/seoUtils";

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
  const lang = getCurrentLanguage();

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
    <section className="bg-ivory px-3 pb-24 pt-3 sm:px-5 lg:px-8 lg:pb-28">
      <div className="relative min-h-[680px] overflow-visible rounded-lg shadow-[var(--shadow-luxe)] sm:min-h-[720px]">
        <div className="absolute inset-0 overflow-hidden rounded-lg">
        <HeroSlider />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-6 pb-40 pt-20 sm:min-h-[720px] sm:px-10 md:pb-36 lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-navy-foreground/25 bg-navy/25 px-4 py-2 text-[11px] font-semibold uppercase text-navy-foreground backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-gold" /> Future Homes International
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] text-navy-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              {title || t('hero.title')}
            </h1>
            <p className="mt-5 hidden max-w-xl text-base leading-relaxed text-navy-foreground/85 sm:block sm:text-lg md:text-xl">
              {subtitle || t('hero.subtitle')}
            </p>
            <Button asChild variant="outline" className="mt-8 hidden h-12 border-navy-foreground/35 bg-navy-foreground/10 px-6 text-navy-foreground backdrop-blur-md hover:bg-navy-foreground hover:text-navy sm:inline-flex">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> {cc("whatsapp", lang)}
              </a>
            </Button>
          </div>

          <div className="absolute inset-x-4 -bottom-16 sm:inset-x-8 lg:inset-x-16">
            {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
            <ul className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium text-navy sm:text-sm">
              {(["trust_1", "trust_2", "trust_3"] as const).map((key) => (
                <li key={key} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" />{cc(key, lang)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
