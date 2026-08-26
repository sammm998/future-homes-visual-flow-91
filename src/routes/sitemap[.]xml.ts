import { createFileRoute } from "@tanstack/react-router";
import { SITEMAP_BASE_URL, SITEMAP_LOCALES, xmlResponse } from "@/lib/sitemapData";

// Sitemap index: points Google at one sitemap per language version.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // No <lastmod> here: generation time is not a page-specific timestamp.
        const items = SITEMAP_LOCALES.map(
          (locale) =>
            [
              "  <sitemap>",
              `    <loc>${SITEMAP_BASE_URL}/sitemap/${locale}.xml</loc>`,
              "  </sitemap>",
            ].join("\n"),
        ).join("\n");


        return xmlResponse(
          [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            items,
            "</sitemapindex>",
          ].join("\n"),
        );
      },
    },
  },
});
