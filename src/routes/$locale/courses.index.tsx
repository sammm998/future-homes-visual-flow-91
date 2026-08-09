import { createFileRoute } from "@tanstack/react-router";
import CoursesIndex from "@/pages/CoursesIndex";

export const Route = createFileRoute("/$locale/courses/")({
  component: CoursesIndex,
});
