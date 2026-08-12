import { createFileRoute } from "@tanstack/react-router";
import Information from "@/pages/Information";

export const Route = createFileRoute("/information")({
  component: Information,
});
