import { createFileRoute } from "@tanstack/react-router";
import Information from "@/pages/Information";

export const Route = createFileRoute("/$locale/information")({
  component: Information,
});
