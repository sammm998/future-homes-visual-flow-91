import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { signatureTokenUsable } from "@/admin/crm/model";

const tokenRe = /^[a-f0-9]{48}$/;
const postSchema = z.object({
  token: z.string().regex(tokenRe),
  name: z.string().trim().min(2).max(120),
  signature: z.string().startsWith("data:image/png;base64,").max(600_000),
  agree: z.literal(true),
});

export const Route = createFileRoute("/api/public/sign")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = new URL(request.url).searchParams.get("token") ?? "";
        if (!tokenRe.test(token)) return Response.json({ error: "invalid" }, { status: 404 });
        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
        const { data } = await db.from("signature_requests")
          .select("title, body, signer_name, status, expires_at, signed_at").eq("token", token).maybeSingle();
        if (!data) return Response.json({ error: "invalid" }, { status: 404 });
        return Response.json({ ...data, usable: signatureTokenUsable(data) });
      },
      POST: async ({ request }) => {
        const parsed = postSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
        const { data: req } = await db.from("signature_requests").select("id, status, expires_at, deal_id").eq("token", parsed.data.token).maybeSingle();
        if (!req || !signatureTokenUsable(req)) return Response.json({ error: "expired" }, { status: 410 });
        const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
        const { error } = await db.from("signature_requests").update({
          status: "signed", signed_at: new Date().toISOString(), signed_name: parsed.data.name,
          signature_png: parsed.data.signature, signer_ip: ip, signer_ua: request.headers.get("user-agent")?.slice(0, 300) ?? null,
        }).eq("id", req.id).eq("status", "pending");
        if (error) return Response.json({ error: "failed" }, { status: 500 });
        await db.from("feed_posts").insert({ body: `✍️ ${parsed.data.name} signed an agreement`, kind: "system", entity_type: "deal", entity_id: req.deal_id });
        return Response.json({ ok: true });
      },
    },
  },
});
