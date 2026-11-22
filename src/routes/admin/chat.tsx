import { createFileRoute } from "@tanstack/react-router";
import TeamChat from "@/admin/pages/TeamChat";

export const Route = createFileRoute("/admin/chat")({
  component: TeamChat,
});
