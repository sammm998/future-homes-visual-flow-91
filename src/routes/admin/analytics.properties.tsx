import { createFileRoute } from "@tanstack/react-router";
import AnalyticsProperties from "@/admin/pages/AnalyticsProperties";

export const Route = createFileRoute("/admin/analytics/properties")({
  component: AnalyticsProperties,
});
