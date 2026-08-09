import { createFileRoute } from "@tanstack/react-router";
import AnalyticsTraffic from "@/admin/pages/AnalyticsTraffic";

export const Route = createFileRoute("/admin/analytics/")({
  component: AnalyticsTraffic,
});
