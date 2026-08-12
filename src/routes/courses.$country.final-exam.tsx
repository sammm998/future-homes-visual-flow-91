import { createFileRoute } from "@tanstack/react-router";
import CourseFinalExam from "@/pages/CourseFinalExam";

export const Route = createFileRoute("/courses/$country/final-exam")({
  component: CourseFinalExam,
});
