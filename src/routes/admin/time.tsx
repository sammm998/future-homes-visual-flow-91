import { createFileRoute } from "@tanstack/react-router";
import TimeAbsence from "@/admin/pages/TimeAbsence";

export const Route = createFileRoute("/admin/time")({
  component: TimeAbsence,
});
