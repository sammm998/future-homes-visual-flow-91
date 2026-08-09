import { createFileRoute } from "@tanstack/react-router";
import Article from "@/pages/Article";

export const Route = createFileRoute("/article/$id")({
  component: Article,
});
