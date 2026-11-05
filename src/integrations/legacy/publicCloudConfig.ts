// Lovable Cloud endpoint constants without the Supabase SDK, so modules that
// only need plain REST access (route loaders/head) do not pull the client
// library into the initial browser bundle.
export const CLOUD_URL = "https://slwesocsoncujeghgkzh.supabase.co";
export const CLOUD_PUBLISHABLE_KEY = "sb_publishable_hhsY9ChXnw98hh-tr9vm8Q_w49N0ZIs";
export const cloudRestHeaders = { apikey: CLOUD_PUBLISHABLE_KEY };
