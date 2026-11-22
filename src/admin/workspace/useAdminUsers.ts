import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminUser = { id: string; email: string };
let cache: AdminUser[] | null = null;

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(cache ?? []);
  const [me, setMe] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
    if (cache) return;
    supabase.rpc("list_admin_users").then(({ data }) => {
      cache = (data as AdminUser[]) ?? [];
      setUsers(cache);
    });
  }, []);
  const name = (id?: string | null) => {
    const u = users.find((x) => x.id === id);
    if (!u) return "—";
    const n = u.email.split("@")[0] ?? u.email;
    return n.charAt(0).toUpperCase() + n.slice(1);
  };
  return { users, me, name };
}
