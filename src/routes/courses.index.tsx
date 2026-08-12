import { createFileRoute } from "@tanstack/react-router";
import CoursesIndex from "@/pages/CoursesIndex";

export const Route = createFileRoute("/courses/")({
  component: CoursesIndex,
});
