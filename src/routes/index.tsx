import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Index from "@/pages/Index";
import DeferredSection from "@/components/DeferredSection";
import { homeHeroPreload } from "@/lib/homeHeroImage";

const Newsletter = lazy(() => import("@/components/Newsletter"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Future Homes International | Luxury Property Worldwide" },
      { name: "description", content: "Discover carefully selected homes in Turkey, Dubai, Cyprus and Bali with multilingual property advisors." },
      { property: "og:title", content: "Future Homes International | Luxury Property Worldwide" },
      { property: "og:description", content: "Discover carefully selected international homes with personal, multilingual guidance." },
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
