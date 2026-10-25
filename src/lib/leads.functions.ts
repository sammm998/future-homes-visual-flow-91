import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { LEGACY_SUPABASE_URL, LEGACY_SUPABASE_KEY } from "@/integrations/legacy/client";

const leadSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().max(4000).optional(),
  source: z.string().trim().max(60).optional(),
  partnerRef: z.string().trim().regex(/^[a-z0-9]{4,20}$/i).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Stores a website enquiry in the CRM (leads table of the property database)
 * through its contact-notification function, which saves the lead first and
 * then e-mails the office.
 */
export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${LEGACY_SUPABASE_URL}/functions/v1/send-contact-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: LEGACY_SUPABASE_KEY, Authorization: `Bearer ${LEGACY_SUPABASE_KEY}` },
        body: JSON.stringify({
          name: data.name?.trim() || "Website Visitor",
          email: data.email || undefined,
          phone: data.phone || undefined,
          message: data.message || undefined,
          source: data.source || "website",
        }),
      });
      await res.json().catch(() => ({})); // office e-mail notification only
      // The CRM now lives in Lovable Cloud.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error: leadError } = await supabaseAdmin.from("leads").insert({
        name: data.name?.trim() || "Website Visitor", email: data.email || null, phone: data.phone || null,
        message: data.message || null, source: data.source || "website",
      });
      const json = { leadSaved: !leadError };
      if (leadError) console.error("[saveLead] cloud insert failed:", leadError.message);
      if (data.partnerRef) {
        try {
          // Credit the introduction to an approved partner (Lovable Cloud).
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: partner } = await supabaseAdmin.from("partners").select("id, commission_pct").eq("ref_code", data.partnerRef.toLowerCase()).eq("status", "approved").maybeSingle();
          if (partner) {
            await supabaseAdmin.from("partner_referrals").insert({
              partner_id: partner.id, client_name: data.name || null, client_email: data.email || null, client_phone: data.phone || null,
              source: data.source || "website", notes: data.message?.slice(0, 1000) || null, agreed_commission_pct: partner.commission_pct,
            });
          }
        } catch (e) {
          console.error("[saveLead] partner attribution failed:", e);
        }
      }
      return { saved: !!json.leadSaved };
    } catch (e) {
      console.error("[saveLead] threw:", e);
      return { saved: false };
    }
  });
