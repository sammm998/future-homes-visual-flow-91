import { createFileRoute } from "@tanstack/react-router";
import CourseLesson from "@/pages/CourseLesson";

export const Route = createFileRoute("/$locale/courses/$country/$moduleSlug")({
  component: CourseLesson,
});
