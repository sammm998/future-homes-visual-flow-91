import { createFileRoute } from "@tanstack/react-router";
import ActivityLogs from "@/admin/pages/ActivityLogs";

export const Route = createFileRoute("/admin/logs")({
  component: ActivityLogs,
});
