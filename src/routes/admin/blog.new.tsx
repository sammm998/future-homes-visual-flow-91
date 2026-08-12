import { createFileRoute } from "@tanstack/react-router";
import BlogEdit from "@/admin/pages/BlogEdit";

export const Route = createFileRoute("/admin/blog/new")({
  component: BlogEdit,
});
