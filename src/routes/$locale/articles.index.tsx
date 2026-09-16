import { createFileRoute } from "@tanstack/react-router";
import ArticlesIndex from "@/pages/ArticlesIndex";

export const Route = createFileRoute("/$locale/articles/")({
  head: () => ({
    meta: [
      { title: "Property Guides & Turkey Articles | Future Homes International" },
      {
        name: "description",
        content:
          "Guides on buying property in Turkey, Dubai, Cyprus and Bali, plus city, food and lifestyle articles from Future Homes International.",
      },
      { property: "og:title", content: "Property Guides & Turkey Articles" },
      {
        property: "og:description",
        content: "City guides, costs, legal steps and lifestyle for property buyers abroad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlesIndex,
});
