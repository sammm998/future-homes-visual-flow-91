import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Index from "@/pages/Index";
import DeferredSection from "@/components/DeferredSection";
import heroEstate from "@/assets/hero-modern-estate.webp";
import heroEstateMobile from "@/assets/hero-modern-estate-768.webp";
import heroEstateLaptop from "@/assets/hero-modern-estate-1200.webp";

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
    links: [
      {
        rel: "preload",
        as: "image",
        href: heroEstate,
        imageSrcSet: `${heroEstateMobile} 768w, ${heroEstateLaptop} 1200w, ${heroEstate} 1920w`,
        imageSizes: "100vw",
        fetchPriority: "high",
      } as unknown as { rel: string; href: string },
    ],
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
