import { createFileRoute } from "@tanstack/react-router";
import Article from "@/pages/Article";

export const Route = createFileRoute("/$locale/article/$id")({
  component: Article,
});
