import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";

export const Route = createFileRoute("/$locale/")({
  head: () => ({
    meta: [
      { title: "Property for Sale in Turkey, Dubai, Cyprus & Bali" },
      {
        name: "description",
        content:
          "Buy apartments, villas and off-plan homes in Turkey, Dubai, Cyprus and Bali with Future Homes International.",
      },
      { property: "og:title", content: "Property for Sale in Turkey, Dubai, Cyprus & Bali" },
      {
        property: "og:description",
        content:
          "Buy apartments, villas and off-plan homes in Turkey, Dubai, Cyprus and Bali with Future Homes International.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
