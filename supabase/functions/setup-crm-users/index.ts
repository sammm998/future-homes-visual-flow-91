import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const USERS = [
  { email: "mikail@futurehomesturkey.com", password: "Mikail#FH2026!Secure" },
  { email: "batuhan@futurehomesturkey.com", password: "Batuhan#FH2026!Secure" },
  { email: "info@futurehomesinternational.com", password: "InfoFHI#2026!Secure" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: any[] = [];
    const { data: existing } = await supabase.auth.admin.listUsers();

    for (const { email, password } of USERS) {
      const found = existing?.users?.find((u: any) => u.email === email);
      let userId: string;

      if (found) {
        userId = found.id;
        await supabase.auth.admin.updateUserById(userId, { password, email_confirm: true });
      } else {
        const { data: created, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (error) throw new Error(`${email}: ${error.message}`);
        userId = created.user!.id;
      }

      await supabase.from("user_roles").upsert(
        { user_id: userId, role: "admin" },
        { onConflict: "user_id,role" }
      );
      await supabase.from("admin_users").upsert(
        { user_id: userId, email },
        { onConflict: "user_id" }
      );

      results.push({ email, userId, status: found ? "updated" : "created" });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
