import { createFileRoute } from "@tanstack/react-router";
import AnalyticsRealtime from "@/admin/pages/AnalyticsRealtime";

export const Route = createFileRoute("/admin/analytics/realtime")({
  component: AnalyticsRealtime,
});
