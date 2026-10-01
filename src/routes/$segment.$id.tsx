import { createFileRoute, notFound } from "@tanstack/react-router";
import { PATH_TO_LANG } from "@/utils/slugHelpers";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import { getCityLandingConfig } from "@/data/cityLandingPages";
import PropertyDetail from "@/pages/PropertyDetail";
import CityLandingPage from "@/pages/CityLandingPage";
import { getPropertySeo } from "@/lib/propertySeo.functions";

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
  loaderDeps: ({ search }) => ({ ref: (search as Record<string, unknown>)?.ref ?? null }),
  loader: async ({ params, deps }) => {
    if (!(params.segment in PATH_TO_LANG)) return { seo: null };
    // The SEO lookup is server-rendered. PropertyDetail performs its own
    // browser-side data lookup after an in-app navigation.
    if (typeof window !== "undefined") return { seo: null };
    return {
      seo: await getPropertySeo({
        data: {
          id: params.id,
          lang: PATH_TO_LANG[params.segment as keyof typeof PATH_TO_LANG] ?? "en",
          ref: deps.ref ? String(deps.ref) : null,
        },
      }),
    };
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
