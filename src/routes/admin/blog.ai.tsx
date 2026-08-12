import { createFileRoute } from "@tanstack/react-router";
import BlogAI from "@/admin/pages/BlogAI";

export const Route = createFileRoute("/admin/blog/ai")({
  component: BlogAI,
});
