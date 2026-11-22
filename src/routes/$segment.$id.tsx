import { createFileRoute, notFound } from "@tanstack/react-router";
import { PATH_TO_LANG } from "@/utils/slugHelpers";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";
import { lazy, Suspense } from "react";
import { isCityLandingSlug } from "@/data/cityLandingSlugs";
import PropertyDetail from "@/pages/PropertyDetail";
import { getPropertySeoWithin } from "@/lib/propertySeo.functions";

const CityLandingBySlug = lazy(() => import("@/pages/CityLandingBySlug"));

export const Route = createFileRoute("/$segment/$id")({
  beforeLoad: ({ params }) => {
    const isPropertySegment = params.segment in PATH_TO_LANG;
    const isLocaleCity =
      (PREFIXED_LOCALES as readonly string[]).includes(params.segment) &&
      isCityLandingSlug(params.id);
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
      seo: await getPropertySeoWithin({
          id: params.id,
          lang: PATH_TO_LANG[params.segment as keyof typeof PATH_TO_LANG] ?? "en",
          ref: deps.ref ? String(deps.ref) : null,
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
  if (!isCityLandingSlug(id)) throw notFound();
  return <Suspense fallback={null}><CityLandingBySlug slug={id} /></Suspense>;
}
