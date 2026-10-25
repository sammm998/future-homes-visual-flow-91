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
  head: ({ params }) => {
    const c = getCityLandingConfig(params.locale);
    if (!c) return {};
    const url = `https://futurehomesinternational.com/${c.slug}`;
    return {
      meta: [
        { title: `${c.title} | Future Homes` },
        { name: "description", content: c.metaDescription },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const city = (PREFIXED_LOCALES as readonly string[]).includes(locale) ? null : getCityLandingConfig(locale);
  if (city) return <CityLandingPage config={city} />;
  return <Outlet />;
}
