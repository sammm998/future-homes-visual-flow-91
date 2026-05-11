import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const email = "samincroseo@gmail.com";
    const password = "Croseo123";

    // Check if user already exists
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((u: any) => u.email === email);

    let userId: string;
    if (found) {
      userId = found.id;
      // Update password and ensure confirmed
      await supabase.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
      });
    } else {
      const { data: created, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      userId = created.user!.id;
    }

    // Ensure admin role
    await supabase.from("user_roles").upsert(
      { user_id: userId, role: "admin" },
      { onConflict: "user_id,role" }
    );
    await supabase.from("admin_users").upsert(
      { user_id: userId, email },
      { onConflict: "user_id" }
    );

    return new Response(
      JSON.stringify({ success: true, userId, email }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
