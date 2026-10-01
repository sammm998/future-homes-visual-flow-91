import { createFileRoute } from "@tanstack/react-router";
import MapSearch from "@/pages/MapSearch";

export const Route = createFileRoute("/map-search")({
  head: () => ({
    meta: [
      { title: "Kartsökning | Future Homes International" },
      { name: "description", content: "Utforska internationella bostäder i en interaktiv kartvy med smarta filter." },
      { property: "og:title", content: "Kartsökning | Future Homes International" },
      { property: "og:description", content: "Utforska internationella bostäder i en interaktiv kartvy med smarta filter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapSearch,
});
