import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
export type AdminUser = { id: string; email: string };
export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  useEffect(() => { void supabase.rpc("list_admin_users").then(({ data }) => setUsers((data ?? []) as AdminUser[])); }, []);
  const label = (id?: string | null) => users.find((u) => u.id === id)?.email.split("@")[0] ?? (id ? "—" : "Unassigned");
  return { users, label };
}
