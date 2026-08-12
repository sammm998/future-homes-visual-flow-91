import { createFileRoute, notFound } from "@tanstack/react-router";
import { PATH_TO_LANG } from "@/utils/slugHelpers";
import { getPropertySeo } from "@/lib/propertySeo.functions";
import PropertyDetail from "@/pages/PropertyDetail";

export const Route = createFileRoute("/$locale/$segment/$id")({
  beforeLoad: ({ params }) => {
    if (!(params.segment in PATH_TO_LANG)) {
      throw notFound();
    }
  },
  loaderDeps: ({ search }) => ({ ref: (search as Record<string, unknown>)?.ref ?? null }),
  loader: async ({ params, deps }) => ({
    seo: await getPropertySeo({
      data: { id: params.id, lang: params.locale, ref: deps.ref ? String(deps.ref) : null },
    }),
  }),
  component: PropertyDetail,
});
