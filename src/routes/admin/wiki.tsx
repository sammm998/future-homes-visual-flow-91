import { createFileRoute } from "@tanstack/react-router";
import Wiki from "@/admin/pages/Wiki";

export const Route = createFileRoute("/admin/wiki")({
  component: Wiki,
});
