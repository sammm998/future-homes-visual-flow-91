import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/IstanbulRentalYield";
import { newPagesShared } from "@/content/newPagesShared";

export const Route = createFileRoute("/$locale/istanbul-rental-yield")({
  head: ({ params }) => {
    const locale = (params as { locale?: string }).locale;
    const m = newPagesShared(locale).meta.yield;
    return buildRouteSeoHead({ locale, path: "/istanbul-rental-yield", title: m.title, description: m.description, type: "article" });
  },
  component: Page,
});
