import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import HeroSearchStatic from "@/components/HeroSearchStatic";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cc, whatsappLink } from "@/utils/conversionCopy";
import { getCurrentLanguage } from "@/utils/seoUtils";

interface HeroProps {
  title?: string;
  subtitle?: string;
  gallery?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  gallery = false
}) => {
  const { t } = useTranslation();
  const lang = getCurrentLanguage();

  // Lazy-load the polished Radix-based search form after the page is idle so
  // the initial paint/hydration stays lightweight. The static native form is
  // shown immediately and is fully functional.
  const [InteractiveSearch, setInteractiveSearch] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    let requested = false;
    const load = () => {
      if (requested || cancelled) return;
      requested = true;
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
      // Keep search downloads and the form replacement out of the first paint.
      // Interaction still upgrades immediately; the native form remains usable.
      let timer: ReturnType<typeof setTimeout> | undefined;
      const schedule = () => { timer = setTimeout(load, 5000); };
      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', schedule, { once: true });
      const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
      const onInteraction = () => {
        clearTimeout(timer);
        load();
      };
      events.forEach((e) => window.addEventListener(e, onInteraction, { once: true, passive: true }));

      return () => {
        cancelled = true;
        clearTimeout(timer);
        window.removeEventListener('load', schedule);
        events.forEach((e) => window.removeEventListener(e, onInteraction));
      };
    }
  }, []);

  if (gallery) {
    return (
      <section className="relative min-h-[980px] overflow-hidden bg-navy text-navy-foreground sm:min-h-[960px] lg:min-h-[calc(100svh-1rem)]">
        <HeroSlider />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-navy/15" />

        <div className="relative z-10 mx-auto flex min-h-[980px] max-w-[1840px] flex-col justify-end px-5 pb-10 pt-32 sm:min-h-[960px] sm:px-10 sm:pb-72 lg:min-h-[calc(100svh-1rem)] lg:px-16 lg:pb-44 xl:px-24">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(290px,.45fr)] lg:gap-16">
            <div className="max-w-5xl">
              <div className="mb-7 flex items-center gap-4 text-[10px] font-semibold uppercase text-gold sm:text-xs [letter-spacing:.28em]">
                <span className="h-px w-12 bg-gold" />
                International Estate Gallery
              </div>
              <h1 className="max-w-5xl text-4xl font-semibold leading-[1.03] text-navy-foreground sm:text-6xl md:text-7xl xl:text-8xl">
                {title || t('hero.title')}
              </h1>
            </div>

            <div className="border-l border-navy-foreground/25 pl-6 lg:mb-2 lg:pl-8">
              <p className="max-w-md text-sm leading-7 text-navy-foreground/78 sm:text-base">
                {subtitle || t('hero.subtitle')}
              </p>
              <Button asChild variant="link" className="mt-6 h-auto p-0 text-xs font-semibold uppercase text-navy-foreground hover:text-gold [letter-spacing:.16em]">
                <a href="#property-collection">{t('sidebar.properties')} <span aria-hidden="true">→</span></a>
              </Button>
            </div>
          </div>

          <div id="property-collection" className="mt-12 sm:absolute sm:inset-x-10 sm:bottom-5 sm:mt-0 lg:inset-x-16 xl:inset-x-24">
            {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
          </div>
        </div>

        <div className="absolute bottom-28 right-8 hidden items-center gap-4 text-[9px] font-semibold uppercase text-navy-foreground/60 lg:flex [letter-spacing:.2em] [writing-mode:vertical-rl]">
          <span>Scroll</span><span className="h-20 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ivory px-3 pb-12 pt-3 sm:px-5 sm:pb-24 lg:px-8 lg:pb-28">
      <div className="relative overflow-hidden rounded-lg bg-navy shadow-[var(--shadow-luxe)] sm:min-h-[720px] sm:overflow-visible">
        <div className="absolute inset-0 overflow-hidden rounded-lg">
        <HeroSlider />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-4 pt-36 sm:min-h-[720px] sm:justify-center sm:px-10 sm:pb-36 sm:pt-20 lg:px-16">
          <div className="max-w-3xl px-2 sm:px-0">
            <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-navy-foreground/25 bg-navy/25 px-3 py-2 text-[9px] font-semibold uppercase text-navy-foreground backdrop-blur-md sm:mb-6 sm:px-4 sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-gold" /> Future Homes International
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] text-navy-foreground sm:text-6xl md:text-7xl lg:text-8xl">
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

          <div className="mt-8 sm:absolute sm:inset-x-8 sm:-bottom-16 sm:mt-0 lg:inset-x-16">
            {InteractiveSearch ? <InteractiveSearch /> : <HeroSearchStatic />}
            <ul className="mt-4 grid gap-2 px-2 pb-4 text-xs font-medium text-navy-foreground sm:mt-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 sm:pb-0 sm:text-sm sm:text-navy">
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
