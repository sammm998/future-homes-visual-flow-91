import { createFileRoute } from "@tanstack/react-router";
import ContactThankYou from "@/pages/ContactThankYou";

export const Route = createFileRoute("/$locale/contact-thank-you")({
  component: ContactThankYou,
});
