import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Index from "@/pages/Index";
import DeferredSection from "@/components/DeferredSection";
import { homeHeroPreload } from "@/lib/homeHeroImage";

const Newsletter = lazy(() => import("@/components/Newsletter"));

export const Route = createFileRoute("/$locale/")({
  head: () => ({
    meta: [
      { title: "Future Homes International | International Property" },
      { name: "description", content: "Explore selected international homes with personal guidance in your language." },
      { property: "og:title", content: "Future Homes International | International Property" },
      { property: "og:description", content: "Explore selected international homes with personal guidance in your language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
