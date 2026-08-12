import { createFileRoute } from "@tanstack/react-router";
import AliKaran from "@/pages/AliKaran";

export const Route = createFileRoute("/$locale/ali-karan")({
  component: AliKaran,
});
