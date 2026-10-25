import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Index from "@/pages/Index";
import DeferredSection from "@/components/DeferredSection";
import { homeHeroPreload } from "@/lib/homeHeroImage";

const Newsletter = lazy(() => import("@/components/Newsletter"));

export const Route = createFileRoute("/")({
  head: () => ({
    // Localized title/description/og come from EnhancedSEOHead on the page (one source, all 13 languages).
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [homeHeroPreload],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Index />
      <DeferredSection minHeight={500} rootMargin="100px"><Newsletter /></DeferredSection>
    </>
  );
}
