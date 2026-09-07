import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: "/lovable-uploads/hero-antalya-1200.webp",
        imagesrcset:
          "/lovable-uploads/hero-antalya-768.webp 768w, /lovable-uploads/hero-antalya-1200.webp 1200w",
        imagesizes: "100vw",
        fetchpriority: "high",
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
