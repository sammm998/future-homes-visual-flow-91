import { createFileRoute } from "@tanstack/react-router";
import AIInsights from "@/admin/pages/AIInsights";

export const Route = createFileRoute("/admin/ai-insights")({
  component: AIInsights,
});
