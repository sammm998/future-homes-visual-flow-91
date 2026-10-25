import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import { getCityLandingConfig } from "@/data/cityLandingPages";
import CityLandingPage from "@/pages/CityLandingPage";

// "/$locale" also matches one-segment city landing pages such as /alanya-property-for-sale
// (it outranks "/$slug"), so those are rendered here instead of returning a 404.
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!(PREFIXED_LOCALES as readonly string[]).includes(params.locale) && !getCityLandingConfig(params.locale)) {
      throw notFound();
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const city = (PREFIXED_LOCALES as readonly string[]).includes(locale) ? null : getCityLandingConfig(locale);
  if (city) return <CityLandingPage config={city} />;
  return <Outlet />;
}
