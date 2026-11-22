import { createFileRoute } from "@tanstack/react-router";
import TeamFeed from "@/admin/pages/TeamFeed";

export const Route = createFileRoute("/admin/feed")({
  component: TeamFeed,
});
