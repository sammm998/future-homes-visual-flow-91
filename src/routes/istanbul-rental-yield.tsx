import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/IstanbulRentalYield";

export const Route = createFileRoute("/istanbul-rental-yield")({
  head: () => ({
    meta: [
      { title: "Istanbul Rental Yields by District | Future Homes" },
      { name: "description", content: "Indicative rental yields for 12 Istanbul districts, sample listings and a net yield calculator after costs and tax." },
      { property: "og:title", content: "Istanbul Rental Yields by District | Future Homes" },
      { property: "og:description", content: "Indicative rental yields for 12 Istanbul districts, sample listings and a net yield calculator after costs and tax." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
