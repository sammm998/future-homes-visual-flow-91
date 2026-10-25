import { createFileRoute } from "@tanstack/react-router";

// Serves uploaded listing images from the private Cloud bucket. Listing photos
// are public marketing content; only paths inside property-images are served.
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = String((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..") || !/^[\w./-]+$/.test(path)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("property-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: { "Content-Type": data.type || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" },
        });
      },
    },
  },
});
