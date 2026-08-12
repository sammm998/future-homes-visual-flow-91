import { createFileRoute } from "@tanstack/react-router";
import WizardThankYou from "@/pages/WizardThankYou";

export const Route = createFileRoute("/$locale/wizard-thank-you")({
  component: WizardThankYou,
});
