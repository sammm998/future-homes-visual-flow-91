import { createFileRoute } from "@tanstack/react-router";
import CyprusPropertySearch from "@/pages/CyprusPropertySearch";

export const Route = createFileRoute("/cyprus")({
  head: () => ({
    meta: [
      { title: "Properties in Cyprus | Future Homes International" },
      { name: "description", content: "Browse available apartments, villas and investment homes in Cyprus. Refine your search by price, bedrooms and reference number." },
      { property: "og:title", content: "Properties in Cyprus | Future Homes International" },
      { property: "og:description", content: "Explore available homes in Cyprus with Future Homes International." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CyprusPropertySearch,
});
