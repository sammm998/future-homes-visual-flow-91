// Client for the existing property/CRM database (homes, leads, team, translations).
// Lovable Cloud (src/integrations/supabase) is only used for VIP Club and partner data.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { brokeredPreviewStorage } from "@/integrations/supabase/previewAuthStorage";

export const LEGACY_SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
export const LEGACY_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI";

export const supabase = createClient<Database>(LEGACY_SUPABASE_URL, LEGACY_SUPABASE_KEY, {
  auth: { storage: brokeredPreviewStorage(), persistSession: true, autoRefreshToken: true, storageKey: "sb-kiogiyemoqbnuvclneoe-auth-token" },
});
