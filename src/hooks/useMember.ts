import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase as cloud } from "@/integrations/supabase/client";

/** VIP Club / partner session (Lovable Cloud accounts). */
export function useMember() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let alive = true;
    cloud.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = cloud.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      setUser(session?.user ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return setIsAdmin(false);
    cloud.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  return { user, ready, isAdmin, signOut: () => cloud.auth.signOut() };
}

// Partner-code helpers live in a Supabase-free module so the app shell can
// call them without loading the database client.
export { capturePartnerRef, getPartnerRef } from "@/lib/partnerRef";
