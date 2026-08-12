import { createFileRoute } from "@tanstack/react-router";
import PropertyForSaleInTurkey from "@/pages/PropertyForSaleInTurkey";

export const Route = createFileRoute("/$locale/property-for-sale-in-turkey")({
  component: PropertyForSaleInTurkey,
});
