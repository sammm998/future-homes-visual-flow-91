import { createFileRoute } from "@tanstack/react-router";
import ApartmentsForSaleInTurkey from "@/pages/ApartmentsForSaleInTurkey";

export const Route = createFileRoute("/apartments-for-sale-in-turkey")({
  component: ApartmentsForSaleInTurkey,
});
