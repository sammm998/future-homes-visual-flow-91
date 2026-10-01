import { FaWhatsapp } from "react-icons/fa";
import { CheckCircle2, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouterState } from "@tanstack/react-router";
import { getLocaleFromPathname, localizePath } from "@/utils/localeRouting";
import { getCurrentLanguage } from "@/utils/seoUtils";
import { cc, whatsappLink } from "@/utils/conversionCopy";

/** Homepage strip right under the hero: two clear ways to reach an advisor + trust points. */
export default function ConversionBand() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = getCurrentLanguage();
  const locale = getLocaleFromPathname(pathname);

  return (
    <section className="relative z-10 bg-ivory px-4 py-12 md:px-8 md:py-20">
      <div className="container mx-auto max-w-7xl rounded-lg border border-gold/25 bg-background px-6 py-10 shadow-[var(--shadow-luxe)] md:px-12 md:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-foreground">Future Homes Concierge</p>
            <h2 className="text-3xl font-semibold leading-tight text-navy md:text-5xl">{cc("band_title", lang)}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{cc("band_sub", lang)}</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-foreground lg:justify-start">
              {(["trust_1", "trust_2", "trust_3"] as const).map((k) => (
                <li key={k} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden="true" /> {cc(k, lang)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
            <Button asChild size="lg" className="h-14 flex-1 bg-whatsapp px-8 text-whatsapp-foreground shadow-lg hover:bg-whatsapp/90">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="mr-2 h-5 w-5" aria-hidden="true" /> {cc("whatsapp", lang)}
              </a>
            </Button>
            <Button asChild size="lg" className="h-14 flex-1 bg-navy px-8 text-navy-foreground shadow-lg hover:bg-navy/90">
              <a href={localizePath("/contact-us", locale)}>
                <CalendarCheck className="mr-2 h-5 w-5" aria-hidden="true" /> {cc("band_cta_form", lang)}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
