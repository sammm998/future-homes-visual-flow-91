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

export const supabase = new Proxy(cloud as unknown as SupabaseClient<Database>, {
  get(target, prop, receiver) {
    if (prop === "functions") return legacyFunctions.functions;
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
