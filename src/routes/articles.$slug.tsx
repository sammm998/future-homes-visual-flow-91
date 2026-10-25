import { createFileRoute } from "@tanstack/react-router";
import ArticlePage from "@/pages/ArticlePage";
import { articleHead, fetchArticleSeo } from "@/lib/articleSeo";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ params }) => ({ seo: await fetchArticleSeo(params.slug, "en") }),
  head: ({ params, loaderData }) => articleHead(loaderData?.seo ?? null, `/articles/${params.slug}`),
  component: ArticlePage,
});
