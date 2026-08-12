import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  SITEMAP_LOCALES,
  getSitemapEntries,
  renderLocaleSitemap,
  xmlResponse,
} from "@/lib/sitemapData";

// Per-language sitemap, e.g. /sitemap-sv.xml, /sitemap-tr.xml, /sitemap-id.xml
export const Route = createFileRoute("/sitemap-$locale/xml")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const locale = String((params as Record<string, string>).locale || "").toLowerCase();
        if (!(SITEMAP_LOCALES as readonly string[]).includes(locale)) {
          return new Response("Unknown language", { status: 404 });
        }
        const entries = await getSitemapEntries();
        return xmlResponse(renderLocaleSitemap(entries, locale));
      },
    },
  },
});
