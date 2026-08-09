import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { PREFIXED_LOCALES } from "@/utils/localeRouting";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!(PREFIXED_LOCALES as readonly string[]).includes(params.locale)) {
      throw notFound();
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  return <Outlet />;
}
