import { FaWhatsapp } from "react-icons/fa";
import { ArrowUpRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouterState } from "@tanstack/react-router";
import { getLocaleFromPathname, localizePath } from "@/utils/localeRouting";
import { getCurrentLanguage } from "@/utils/seoUtils";
import { cc, whatsappLink } from "@/utils/conversionCopy";
import antalyaEstate from "@/assets/destination-antalya-estate.jpg";
import istanbulEstate from "@/assets/destination-istanbul-estate.jpg";
import dubaiEstate from "@/assets/destination-dubai-estate.jpg";
import mersinEstate from "@/assets/destinations/mersin-cinematic.jpg";
import cyprusEstate from "@/assets/destinations/cyprus-cinematic.jpg";
import baliEstate from "@/assets/destinations/bali-cinematic.jpg";

/** Homepage strip right under the hero: two clear ways to reach an advisor + trust points. */
export default function ConversionBand() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = getCurrentLanguage();
  const locale = getLocaleFromPathname(pathname);
  const destinations = [
    { name: "Antalya", path: "/antalya", image: antalyaEstate },
    { name: "Istanbul", path: "/istanbul", image: istanbulEstate },
    { name: "Dubai", path: "/dubai", image: dubaiEstate },
    { name: "Mersin", path: "/mersin", image: mersinEstate },
    { name: "Cyprus", path: "/cyprus", image: cyprusEstate },
    { name: "Bali", path: "/bali", image: baliEstate },
  ];

  return (
    <section className="bg-background px-4 py-14 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 sm:mb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase text-gold-foreground">Future Homes Concierge</p>
            <h2 className="text-3xl font-semibold leading-tight text-navy md:text-5xl">{cc("band_title", lang)}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{cc("band_sub", lang)}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 w-full bg-whatsapp px-6 text-whatsapp-foreground hover:bg-whatsapp/90 sm:w-auto">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" />{cc("whatsapp", lang)}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 w-full border-navy/20 px-6 text-navy hover:bg-ivory sm:w-auto">
              <a href={localizePath("/contact-us", locale)}><CalendarCheck aria-hidden="true" />{cc("band_cta_form", lang)}</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <a key={destination.name} href={localizePath(destination.path, locale)} className="group relative aspect-[16/10] overflow-hidden rounded-lg bg-navy sm:aspect-[4/5]">
              <img src={destination.image} alt={`${destination.name} luxury property`} width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 p-5 text-navy-foreground md:p-8">
                <div><p className="mb-2 text-xs font-semibold uppercase text-gold">Future Homes</p><h3 className="text-2xl font-semibold md:text-3xl">{destination.name}</h3></div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-foreground/40 bg-navy/20 backdrop-blur-md transition-colors group-hover:bg-gold group-hover:text-navy"><ArrowUpRight aria-hidden="true" /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
