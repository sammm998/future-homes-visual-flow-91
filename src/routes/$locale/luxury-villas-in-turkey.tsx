import { createFileRoute } from "@tanstack/react-router";
import LuxuryVillasInTurkey from "@/pages/LuxuryVillasInTurkey";

export const Route = createFileRoute("/$locale/luxury-villas-in-turkey")({
  component: LuxuryVillasInTurkey,
});
