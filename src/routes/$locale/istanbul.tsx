import { createFileRoute } from "@tanstack/react-router";
import IstanbulPropertySearch from "@/pages/IstanbulPropertySearch";

export const Route = createFileRoute("/$locale/istanbul")({
  component: IstanbulPropertySearch,
});
