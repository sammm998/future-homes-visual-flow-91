import { createFileRoute } from "@tanstack/react-router";

/**
 * Maintenance endpoint: updates a team member's image_url.
 *
 * Protected by the MAINTENANCE_TOKEN secret (x-maintenance-token header).
 * POST body: { memberId: string, imageUrl: string }
 */

export const Route = createFileRoute("/api/public/team-image-update")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env["MAINTENANCE_TOKEN"];
        if (!token) {
          return Response.json({ error: "MAINTENANCE_TOKEN not configured in this environment" }, { status: 500 });
        }
        if (request.headers.get("x-maintenance-token") !== token) {
          return new Response("Unauthorized", { status: 401 });
        }

        let memberId = "";
        let imageUrl = "";
        try {
          const body = (await request.json()) as { memberId?: string; imageUrl?: string };
          memberId = String(body?.memberId ?? "").trim();
          imageUrl = String(body?.imageUrl ?? "").trim();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!memberId || !imageUrl) {
          return Response.json({ error: "memberId and imageUrl are required" }, { status: 400 });
        }
        if (!/^https:\/\//.test(imageUrl)) {
          return Response.json({ error: "imageUrl must be an https URL" }, { status: 400 });
        }

        const { supabaseAdmin } = (await import("@/integrations/supabase/client.server")) as any;

        const { data, error } = await supabaseAdmin
          .from("team_members")
          .update({ image_url: imageUrl })
          .eq("id", memberId)
          .select("id, name, image_url");

        if (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }
        if (!data || data.length === 0) {
          return Response.json({ error: "Team member not found" }, { status: 404 });
        }

        return Response.json({ ok: true, member: data[0] });
      },
    },
  },
});
