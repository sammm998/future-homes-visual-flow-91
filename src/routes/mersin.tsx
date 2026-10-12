import { createFileRoute } from "@tanstack/react-router";
import MersinPropertySearch from "@/pages/MersinPropertySearch";

export const Route = createFileRoute("/mersin")({
  head: () => ({
    meta: [
      { title: "Properties in Mersin | Future Homes International" },
      { name: "description", content: "Browse available apartments, villas and investment homes in Mersin. Refine your search by price, bedrooms and reference number." },
      { property: "og:title", content: "Properties in Mersin | Future Homes International" },
      { property: "og:description", content: "Explore available homes in Mersin with Future Homes International." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MersinPropertySearch,
});
