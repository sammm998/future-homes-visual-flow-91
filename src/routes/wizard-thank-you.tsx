import { createFileRoute } from "@tanstack/react-router";
import WizardThankYou from "@/pages/WizardThankYou";

export const Route = createFileRoute("/wizard-thank-you")({
  component: WizardThankYou,
});
