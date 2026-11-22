import { createFileRoute } from "@tanstack/react-router";

// Public, token-only download for shared Drive files. Token is random (144 bits) and expires.
export const Route = createFileRoute("/api/public/share/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!/^[a-f0-9]{36}$/.test(params.token)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: link } = await supabaseAdmin.from("share_links").select("expires_at, drive_files(path, filename)").eq("token", params.token).maybeSingle();
        const file = (link as any)?.drive_files;
        if (!link || !file || new Date(link.expires_at).getTime() < Date.now()) return new Response("This link has expired or does not exist.", { status: 410 });
        const { data: signed } = await supabaseAdmin.storage.from("crm-drive").createSignedUrl(file.path, 300, { download: file.filename });
        if (!signed?.signedUrl) return new Response("File unavailable", { status: 404 });
        return Response.redirect(signed.signedUrl, 302);
      },
    },
  },
});
