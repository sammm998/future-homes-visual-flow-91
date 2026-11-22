import { createFileRoute } from "@tanstack/react-router";
import { MEDIA_QUALITIES, MEDIA_WIDTHS } from "@/utils/imageOptimization";

type EdgeCache = { match(req: Request): Promise<Response | undefined>; put(req: Request, res: Response): Promise<void> };
const edgeCache = (): EdgeCache | null =>
  (globalThis as unknown as { caches?: { default?: EdgeCache } }).caches?.default ?? null;

const pickAllowed = (raw: string | null, allowed: readonly number[]): number | null => {
  const n = Number(raw);
  if (!raw || !Number.isFinite(n)) return null;
  // Snap to the nearest allowed value so arbitrary widths cannot multiply cache entries.
  return allowed.reduce((best, v) => (Math.abs(v - n) < Math.abs(best - n) ? v : best), allowed[0]);
};

// Serves uploaded listing images from the private Cloud bucket. Listing photos
// are public marketing content; only paths inside property-images are served.
// `?w=` (and optional `?q=`) return a resized copy via Storage image
// transformation, so cards and galleries no longer download full-size
// originals; responses are kept in the edge cache.
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const path = String((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..") || !/^[\w./-]+$/.test(path)) return new Response("Not found", { status: 404 });

        const url = new URL(request.url);
        const width = pickAllowed(url.searchParams.get("w"), MEDIA_WIDTHS);
        const quality = pickAllowed(url.searchParams.get("q"), MEDIA_QUALITIES) ?? 72;

        const cache = edgeCache();
        const cacheKey = new Request(`${url.origin}${url.pathname}${width ? `?w=${width}&q=${quality}` : ""}`);
        const hit = await cache?.match(cacheKey).catch(() => undefined);
        if (hit) return hit;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const bucket = supabaseAdmin.storage.from("property-images");
        let result = width
          ? await bucket.download(path, { transform: { width, quality, resize: "contain" } })
          : await bucket.download(path);
        // Image transformation may be unavailable on the project: serve the original.
        if (width && (result.error || !result.data)) result = await bucket.download(path);
        if (result.error || !result.data) return new Response("Not found", { status: 404 });

        const response = new Response(result.data, {
          headers: {
            "Content-Type": result.data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
        if (cache) await cache.put(cacheKey, response.clone()).catch(() => undefined);
        return response;
      },
    },
  },
});
