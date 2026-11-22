import { createFileRoute } from "@tanstack/react-router";
import Meetings from "@/admin/pages/Meetings";

export const Route = createFileRoute("/admin/meetings")({
  component: Meetings,
});
