import { notFound } from "@tanstack/react-router";
import { getCityLandingConfig } from "@/data/cityLandingPages";
import CityLandingPage from "@/pages/CityLandingPage";

/** Loaded on demand by the slug routes so the city copy is not in every page's bundle. */
export default function CityLandingBySlug({ slug }: { slug: string }) {
  const config = getCityLandingConfig(slug);
  if (!config) throw notFound();
  return <CityLandingPage config={config} />;
}
