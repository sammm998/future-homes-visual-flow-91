import { createFileRoute } from "@tanstack/react-router";
import TaskChat from "@/admin/pages/TaskChat";

export const Route = createFileRoute("/admin/task-chats")({
  component: TaskChat,
});
