import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCityLandingConfig } from "@/data/cityLandingPages";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import CityLandingPage from "@/pages/CityLandingPage";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    const isLocale = (PREFIXED_LOCALES as readonly string[]).includes(params.slug);
    if (!isLocale && !getCityLandingConfig(params.slug)) {
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
  const config = getCityLandingConfig(slug);
  if (!config) throw notFound();
  return <CityLandingPage config={config} />;
}
