import { createFileRoute } from "@tanstack/react-router";
import AboutUs from "@/pages/AboutUs";

export const Route = createFileRoute("/$locale/about-us")({
  head: () => ({
    meta: [
      { title: "About Future Homes International | Global Real Estate Experts" },
      { name: "description", content: "Meet Future Homes International — international real estate experts in Turkey, Dubai, Cyprus, Bali and France, serving clients in nine languages." },
      { property: "og:title", content: "About Future Homes International" },
      { property: "og:description", content: "International real estate experts in Turkey, Dubai, Cyprus, Bali and France — serving clients in nine languages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutUs,
});
