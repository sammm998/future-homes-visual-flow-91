import { createFileRoute, notFound } from "@tanstack/react-router";
import NordicLandingPage from "@/pages/NordicLandingPage";
import { getNordicPage } from "@/data/nordicLandingPages";

const SLUG = "kobe-lejlighed-tyrkiet";

export const Route = createFileRoute("/$locale/kobe-lejlighed-tyrkiet")({
  beforeLoad: ({ params }) => {
    const page = getNordicPage(params.locale, SLUG);
    if (!page) throw notFound();
  },
  head: ({ params }) => {
    const page = getNordicPage(params.locale, SLUG);
    if (!page) return {};
    const url = `https://futurehomesinternational.com/${page.locale}/${page.slug}`;
    return {
      meta: [
        { title: page.title },
        { name: "description", content: page.description },
        { name: "keywords", content: page.keywords.join(", ") },
        { property: "og:title", content: page.title },
        { property: "og:description", content: page.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: NordicLandingRoute,
});

function NordicLandingRoute() {
  const { locale } = Route.useParams();
  const page = getNordicPage(locale, SLUG);
  if (!page) return null;
  return <NordicLandingPage page={page} />;
}
