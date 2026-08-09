import { createFileRoute } from "@tanstack/react-router";
import AnalyticsHeatmap from "@/admin/pages/AnalyticsHeatmap";

export const Route = createFileRoute("/admin/analytics/heatmap")({
  component: AnalyticsHeatmap,
});
