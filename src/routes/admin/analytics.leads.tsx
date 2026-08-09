import { createFileRoute } from "@tanstack/react-router";
import AnalyticsLeads from "@/admin/pages/AnalyticsLeads";

export const Route = createFileRoute("/admin/analytics/leads")({
  component: AnalyticsLeads,
});
