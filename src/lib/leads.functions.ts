import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().max(4000).optional(),
  source: z.string().trim().max(60).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Stores a website enquiry in the CRM (leads table) before any e-mail is sent,
 * so a failing mail provider can never lose a lead.
 */
export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("leads").insert({
        name: data.name?.trim() || "Website Visitor",
        email: data.email || null,
        phone: data.phone || null,
        message: data.message || null,
        source: data.source || "website",
        status: "new",
      });
      if (error) {
        console.error("[saveLead] insert failed:", error.message);
        return { saved: false };
      }
      return { saved: true };
    } catch (e) {
      console.error("[saveLead] threw:", e);
      return { saved: false };
    }
  });
