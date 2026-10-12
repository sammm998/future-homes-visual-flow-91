import { createFileRoute } from "@tanstack/react-router";
import IstanbulPropertySearch from "@/pages/IstanbulPropertySearch";

export const Route = createFileRoute("/istanbul")({
  head: () => ({
    meta: [
      { title: "Properties in Istanbul | Future Homes International" },
      { name: "description", content: "Browse available apartments, villas and investment homes in Istanbul. Refine your search by price, bedrooms and reference number." },
      { property: "og:title", content: "Properties in Istanbul | Future Homes International" },
      { property: "og:description", content: "Explore available homes in Istanbul with Future Homes International." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IstanbulPropertySearch,
});
