import { createMiddleware } from "@tanstack/react-start";

// Same behaviour as the generated src/integrations/supabase/auth-attacher.ts,
// but the Supabase SDK is imported only when a server function is actually
// called, so it is not part of every page's initial JavaScript.
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
});
