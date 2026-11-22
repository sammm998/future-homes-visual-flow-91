import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import { lazy, Suspense } from "react";
import { isCityLandingSlug } from "@/data/cityLandingSlugs";

const CityLandingBySlug = lazy(() => import("@/pages/CityLandingBySlug"));

// "/$locale" also matches one-segment city landing pages such as /alanya-property-for-sale
// (it outranks "/$slug"), so those are rendered here instead of returning a 404.
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!(PREFIXED_LOCALES as readonly string[]).includes(params.locale) && !isCityLandingSlug(params.locale)) {
      throw notFound();
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  if (!(PREFIXED_LOCALES as readonly string[]).includes(locale) && isCityLandingSlug(locale)) {
    return <Suspense fallback={null}><CityLandingBySlug slug={locale} /></Suspense>;
  }
  return <Outlet />;
}
