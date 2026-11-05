import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import MapSearch from "@/pages/MapSearch";

export const Route = createFileRoute("/map-search")({
  head: () =>
    buildRouteSeoHead({
      locale: "en",
      path: "/map-search",
      title: "Property Map Search | Homes for Sale on the Map",
      description: "Browse apartments and villas for sale in Turkey, Dubai, Cyprus and Bali on an interactive map.",
      type: "website",
    }),
  component: MapSearch,
});
