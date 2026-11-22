import { createFileRoute } from "@tanstack/react-router";
import Drive from "@/admin/pages/Drive";

export const Route = createFileRoute("/admin/drive")({
  component: Drive,
});
