import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/InvestmentCalculator";

export const Route = createFileRoute("/$locale/investment-calculator")({
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: params.locale,
      path: "/investment-calculator",
      title: "Property Investment Calculator | Rental Yield & ROI",
      description: "Compare purchase costs, rental income, fees and net cash flow in Antalya, Dubai and Bali.",
      type: "website",
    }),
  component: Page,
});
