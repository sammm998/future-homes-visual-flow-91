import { createFileRoute, notFound } from "@tanstack/react-router";
import { PATH_TO_LANG } from "@/utils/slugHelpers";
import PropertyDetail from "@/pages/PropertyDetail";

export const Route = createFileRoute("/$locale/$segment/$id")({
  beforeLoad: ({ params }) => {
    if (!(params.segment in PATH_TO_LANG)) {
      throw notFound();
    }
  },
  component: PropertyDetail,
});
