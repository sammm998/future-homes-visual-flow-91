import { createFileRoute } from "@tanstack/react-router";
import SocialListening from "@/admin/pages/SocialListening";

export const Route = createFileRoute("/admin/social-listening")({
  component: SocialListening,
});
