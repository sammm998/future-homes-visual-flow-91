// Homes, translations, leads, team and site content now live in Lovable Cloud.
// `supabase` is the Cloud client (admins sign in there). Only `.functions`
// still reaches the original project's edge functions (emails, AI helpers).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { supabase as cloud } from "@/integrations/supabase/client";

export const LEGACY_SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
export const LEGACY_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI";

const legacyFunctions = createClient(LEGACY_SUPABASE_URL, LEGACY_SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: "sb-legacy-functions" },
});

const adminFunctions = new Set(['generate-article', 'generate-article-images', 'translate-blog-posts', 'translate-properties', 'translate-slugs']);
const functions = new Proxy(legacyFunctions.functions, {
  get(target, prop) {
    if (prop === 'invoke') return async (name: string, options?: Parameters<typeof target.invoke>[1]) => {
      if (!adminFunctions.has(name)) return target.invoke(name, options);
      const { data: { session } } = await cloud.auth.getSession();
      const headers = new Headers(options?.headers);
      if (session?.access_token) headers.set('Authorization', `Bearer ${session.access_token}`);
      return target.invoke(name, { ...options, headers: Object.fromEntries(headers.entries()) });
    };
    const value = Reflect.get(target, prop);
    return typeof value === 'function' ? value.bind(target) : value;
  },
});

export const supabase = new Proxy(cloud as unknown as SupabaseClient<Database>, {
  get(target, prop, receiver) {
    if (prop === "functions") return functions;
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
