import { createFileRoute } from "@tanstack/react-router";
import BlogList from "@/admin/pages/BlogList";

export const Route = createFileRoute("/admin/blog/")({
  component: BlogList,
});
