import { createFileRoute } from "@tanstack/react-router";
import DesignYourHome from "@/pages/DesignYourHome";

export const Route = createFileRoute("/design-your-home")({
  component: DesignYourHome,
});
