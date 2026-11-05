import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CitizenshipComplianceGuide";
import { newPagesShared } from "@/content/newPagesShared";

export const Route = createFileRoute("/turkish-citizenship-compliance-guide")({
  head: ({ params }) => {
    const locale = (params as { locale?: string }).locale;
    const m = newPagesShared(locale).meta.guide;
    return buildRouteSeoHead({ locale, path: "/turkish-citizenship-compliance-guide", title: m.title, description: m.description, type: "article" });
  },
  component: Page,
});
