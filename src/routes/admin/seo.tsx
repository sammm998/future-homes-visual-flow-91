import { createFileRoute } from "@tanstack/react-router";
import SeoOverview from "@/admin/pages/SeoOverview";

export const Route = createFileRoute("/admin/seo")({
  component: SeoOverview,
});
