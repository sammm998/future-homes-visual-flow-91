import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";
import heroEstate from "@/assets/hero-modern-estate.webp";

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
      <Newsletter />
    </>
  );
}
