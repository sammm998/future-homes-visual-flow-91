import { createFileRoute, notFound } from "@tanstack/react-router";
import { PATH_TO_LANG } from "@/utils/slugHelpers";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import { getCityLandingConfig } from "@/data/cityLandingPages";
import PropertyDetail from "@/pages/PropertyDetail";
import CityLandingPage from "@/pages/CityLandingPage";

export const Route = createFileRoute("/$segment/$id")({
  beforeLoad: ({ params }) => {
    const isPropertySegment = params.segment in PATH_TO_LANG;
    const isLocaleCity =
      (PREFIXED_LOCALES as readonly string[]).includes(params.segment) &&
      !!getCityLandingConfig(params.id);
    if (!isPropertySegment && !isLocaleCity) {
      throw notFound();
    }
  },
  component: SegmentPage,
});

function SegmentPage() {
  const { segment, id } = Route.useParams();
  if (segment in PATH_TO_LANG) {
    return <PropertyDetail />;
  }
  const config = getCityLandingConfig(id);
  if (!config) throw notFound();
  return <CityLandingPage config={config} />;
}
