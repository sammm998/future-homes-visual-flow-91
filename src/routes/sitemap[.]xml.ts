import { createFileRoute } from "@tanstack/react-router";

// Serves the sitemap as real XML (previously rendered client-side by
// src/pages/SitemapXML.tsx, which crawlers could not read).
export const Route = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: async () => {
        const response = await fetch(
          "https://kiogiyemoqbnuvclneoe.supabase.co/functions/v1/generate-sitemap",
        );
        if (!response.ok) {
          return new Response("Failed to generate sitemap", { status: 502 });
        }
        const xml = await response.text();
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
