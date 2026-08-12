import { createFileRoute } from "@tanstack/react-router";
import LuxuryVillasInTurkey from "@/pages/LuxuryVillasInTurkey";

export const Route = createFileRoute("/luxury-villas-in-turkey")({
  component: LuxuryVillasInTurkey,
});
