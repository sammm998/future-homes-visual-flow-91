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
    <section className="relative z-10 -mt-10 px-4">
      <div className="container mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 shadow-2xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">{cc("band_title", lang)}</h2>
            <p className="mt-2 text-muted-foreground">{cc("band_sub", lang)}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground">
              {(["trust_1", "trust_2", "trust_3"] as const).map((k) => (
                <li key={k} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" /> {cc(k, lang)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild size="lg" className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="mr-2 h-5 w-5" aria-hidden="true" /> {cc("whatsapp", lang)}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
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
