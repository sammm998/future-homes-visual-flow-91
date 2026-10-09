import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/InvestmentCalculator";

export const Route = createFileRoute("/$locale/investment-calculator")({
  head: () => ({
    meta: [
      { title: "Property Investment Calculator | Future Homes International" },
      { name: "description", content: "Compare purchase costs, rental income, fees and net cash flow in Antalya, Dubai and Bali." },
      { property: "og:title", content: "Property Investment Calculator | Future Homes International" },
      { property: "og:description", content: "Compare purchase costs, rental income, fees and net cash flow in Antalya, Dubai and Bali." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
