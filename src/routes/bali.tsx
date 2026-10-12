import { createFileRoute } from "@tanstack/react-router";
import BaliPropertySearch from "@/pages/BaliPropertySearch";

export const Route = createFileRoute("/bali")({
  head: () => ({
    meta: [
      { title: "Properties in Bali | Future Homes International" },
      { name: "description", content: "Browse available apartments, villas and investment homes in Bali. Refine your search by price, bedrooms and reference number." },
      { property: "og:title", content: "Properties in Bali | Future Homes International" },
      { property: "og:description", content: "Explore available homes in Bali with Future Homes International." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BaliPropertySearch,
});
