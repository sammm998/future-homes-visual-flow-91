import { createFileRoute } from "@tanstack/react-router";
import TurkishCitizenshipByInvestment from "@/pages/TurkishCitizenshipByInvestment";

export const Route = createFileRoute("/$locale/turkish-citizenship-by-investment")({
  component: TurkishCitizenshipByInvestment,
});
