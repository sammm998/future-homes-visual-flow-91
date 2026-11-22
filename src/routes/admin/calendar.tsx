import { createFileRoute } from "@tanstack/react-router";
import TeamCalendar from "@/admin/pages/TeamCalendar";

export const Route = createFileRoute("/admin/calendar")({
  component: TeamCalendar,
});
