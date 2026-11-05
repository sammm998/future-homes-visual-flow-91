import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Index from "@/pages/Index";
import DeferredSection from "@/components/DeferredSection";
import { getCityLandingConfig } from "@/data/cityLandingPages";
import { homeHeroPreload } from "@/lib/homeHeroImage";

const Newsletter = lazy(() => import("@/components/Newsletter"));

export const Route = createFileRoute("/$locale/")({
  // City landing slugs (e.g. /alanya-property-for-sale) also match this route; their page sets its own head.
  head: ({ params }) => (getCityLandingConfig(params.locale) ? {} : {
    // Localized title/description/og come from EnhancedSEOHead on the page (one source, all 13 languages).
    links: [homeHeroPreload],
  }),
  component: LocaleHomePage,
});

function LocaleHomePage() {
  return (
    <>
      <Index />
      <DeferredSection minHeight={500} rootMargin="100px"><Newsletter /></DeferredSection>
    </>
  );
}
