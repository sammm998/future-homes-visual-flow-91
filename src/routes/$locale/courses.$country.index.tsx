import { createFileRoute } from "@tanstack/react-router";
import CourseOverview from "@/pages/CourseOverview";

export const Route = createFileRoute("/$locale/courses/$country/")({
  component: CourseOverview,
});
