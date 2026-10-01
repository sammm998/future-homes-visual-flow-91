import { supabase } from "@/integrations/supabase/client";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

function getOrCreateId(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  storage.setItem(key, value);
  return value;
}

export function trackConversionEvent(eventType: string, payload: EventPayload = {}) {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) return;

  const visitorId = getOrCreateId(window.localStorage, "fh_visitor_id");
  const sessionId = getOrCreateId(window.sessionStorage, "fh_session_id");
  const ua = window.navigator.userAgent;
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";

  void supabase.from("analytics_events").insert({
    event_type: eventType,
    page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    visitor_id: visitorId,
    session_id: sessionId,
    device,
    payload,
  }).then(({ error }) => {
    if (error) console.warn("analytics", error.message);
  });

  const dataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  dataLayer?.push({ event: eventType, ...payload });
}