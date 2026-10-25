// Public (read-only, RLS-protected) access to the Lovable Cloud database that
// now holds homes, translations and site content. The publishable key is safe
// to ship; it is an opaque sb_ key, so it is sent as `apikey` only.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const CLOUD_URL = "https://slwesocsoncujeghgkzh.supabase.co";
export const CLOUD_PUBLISHABLE_KEY = "sb_publishable_hhsY9ChXnw98hh-tr9vm8Q_w49N0ZIs";
export const cloudRestHeaders = { apikey: CLOUD_PUBLISHABLE_KEY };

const stripBearerKey: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  if (headers.get("Authorization") === `Bearer ${CLOUD_PUBLISHABLE_KEY}`) headers.delete("Authorization");
  headers.set("apikey", CLOUD_PUBLISHABLE_KEY);
  return fetch(input, { ...init, headers });
};

export const createPublicCloudClient = () =>
  createClient<Database>(CLOUD_URL, CLOUD_PUBLISHABLE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: stripBearerKey },
  });
