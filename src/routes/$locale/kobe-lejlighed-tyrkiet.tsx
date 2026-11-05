import { createFileRoute, notFound } from "@tanstack/react-router";
import NordicLandingPage from "@/pages/NordicLandingPage";
import { getNordicPage } from "@/data/nordicLandingPages";
import { getNordicIndexEntry, nordicRouteHead } from "@/data/nordicLandingIndex";

const SLUG = "kobe-lejlighed-tyrkiet";

export const Route = createFileRoute("/$locale/kobe-lejlighed-tyrkiet")({
  beforeLoad: ({ params }) => {
    if (!getNordicIndexEntry(params.locale, SLUG)) throw notFound();
  },
  head: ({ params }) => nordicRouteHead(params.locale, SLUG),
  component: NordicLandingRoute,
});

function NordicLandingRoute() {
  const { locale } = Route.useParams();
  const page = getNordicPage(locale, SLUG);
  if (!page) return null;
  return <NordicLandingPage page={page} />;
}
