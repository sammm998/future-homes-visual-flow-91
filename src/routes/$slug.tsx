import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { isCityLandingSlug } from "@/data/cityLandingSlugs";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";

const CityLandingBySlug = lazy(() => import("@/pages/CityLandingBySlug"));

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    const isLocale = (PREFIXED_LOCALES as readonly string[]).includes(params.slug);
    if (!isLocale && !isCityLandingSlug(params.slug)) {
      throw notFound();
    }
  },
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useParams();
  if ((PREFIXED_LOCALES as readonly string[]).includes(slug)) {
    return (
      <>
        <Index />
        <Newsletter />
      </>
    );
  }
  if (!isCityLandingSlug(slug)) throw notFound();
  return <Suspense fallback={null}><CityLandingBySlug slug={slug} /></Suspense>;
}
