import { createFileRoute } from "@tanstack/react-router";
import ArticlesIndex from "@/pages/ArticlesIndex";

export const Route = createFileRoute("/$locale/articles/")({
  component: ArticlesIndex,
});
