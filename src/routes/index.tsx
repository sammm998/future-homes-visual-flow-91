import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";
import heroEstate from "@/assets/hero-modern-estate.webp";

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
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Index />
      <Newsletter />
    </>
  );
}
