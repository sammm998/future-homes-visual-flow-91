import { createFileRoute } from "@tanstack/react-router";
import IstanbulPropertySearch from "@/pages/IstanbulPropertySearch";

export const Route = createFileRoute("/istanbul")({
  component: IstanbulPropertySearch,
});
