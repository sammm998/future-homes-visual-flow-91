import { createFileRoute } from "@tanstack/react-router";
import CourseLesson from "@/pages/CourseLesson";

export const Route = createFileRoute("/courses/$country/$moduleSlug")({
  component: CourseLesson,
});
