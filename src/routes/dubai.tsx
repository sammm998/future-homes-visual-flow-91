import { createFileRoute } from "@tanstack/react-router";
import DubaiPropertySearch from "@/pages/DubaiPropertySearch";

export const Route = createFileRoute("/dubai")({
  head: () => ({
    meta: [
      { title: "Properties in Dubai | Future Homes International" },
      { name: "description", content: "Browse available apartments, villas and investment homes in Dubai. Refine your search by price, bedrooms and reference number." },
      { property: "og:title", content: "Properties in Dubai | Future Homes International" },
      { property: "og:description", content: "Explore available homes in Dubai with Future Homes International." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DubaiPropertySearch,
});
