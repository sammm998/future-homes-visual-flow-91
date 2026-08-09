import { createFileRoute } from "@tanstack/react-router";
import Testimonials from "@/pages/Testimonials";

export const Route = createFileRoute("/$locale/testimonials")({
  component: Testimonials,
});
