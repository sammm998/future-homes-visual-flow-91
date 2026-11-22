import { createFileRoute } from "@tanstack/react-router";
import AgentsChat from "@/admin/pages/AgentsChat";

export const Route = createFileRoute("/admin/agents")({
  component: AgentsChat,
});
