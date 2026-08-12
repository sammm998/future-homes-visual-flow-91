import { createFileRoute } from "@tanstack/react-router";
import AnalyticsEmail from "@/admin/pages/AnalyticsEmail";

export const Route = createFileRoute("/admin/analytics/email")({
  component: AnalyticsEmail,
});
