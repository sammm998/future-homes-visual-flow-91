import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/OffPlanComparison";
import { newPagesShared } from "@/content/newPagesShared";

export const Route = createFileRoute("/off-plan-turkey-vs-dubai")({
  head: ({ params }) => {
    const locale = (params as { locale?: string }).locale;
    const m = newPagesShared(locale).meta.offplan;
    return buildRouteSeoHead({ locale, path: "/off-plan-turkey-vs-dubai", title: m.title, description: m.description, type: "article" });
  },
  component: Page,
});
