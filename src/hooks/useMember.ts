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

const PARTNER_KEY = "fh_partner_ref";
/** Remember a partner code from ?partner=CODE for 90 days. */
export function capturePartnerRef() {
  if (typeof window === "undefined") return;
  const code = new URLSearchParams(window.location.search).get("partner");
  if (code && /^[a-z0-9]{4,20}$/i.test(code)) {
    localStorage.setItem(PARTNER_KEY, JSON.stringify({ code: code.toLowerCase(), at: Date.now() }));
  }
}
export function getPartnerRef(): string | undefined {
  if (typeof window === "undefined") return;
  try {
    const v = JSON.parse(localStorage.getItem(PARTNER_KEY) || "null");
    if (v && Date.now() - v.at < 90 * 864e5) return v.code;
  } catch {
    /* ignore */
  }
}
