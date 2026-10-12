import { createFileRoute } from "@tanstack/react-router";
import AntalyaPropertySearch from "@/pages/AntalyaPropertySearch";

export const Route = createFileRoute("/antalya")({
  head: () => ({
    meta: [
      { title: "Properties in Antalya | Future Homes International" },
      { name: "description", content: "Browse available apartments, villas and investment homes in Antalya. Refine your search by price, bedrooms and reference number." },
      { property: "og:title", content: "Properties in Antalya | Future Homes International" },
      { property: "og:description", content: "Explore available homes in Antalya with Future Homes International." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AntalyaPropertySearch,
});
