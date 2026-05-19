import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getVisitorId() {
  let v = localStorage.getItem("fh_visitor_id");
  if (!v) { v = uid(); localStorage.setItem("fh_visitor_id", v); }
  return v;
}
function getSessionId() {
  let s = sessionStorage.getItem("fh_session_id");
  if (!s) { s = uid(); sessionStorage.setItem("fh_session_id", s); }
  return s;
}

function parseUA() {
  const ua = navigator.userAgent;
  const isTablet = /iPad|Tablet/i.test(ua);
  const isMobile = !isTablet && /Mobi|Android|iPhone/i.test(ua);
  const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
  let os = "Other";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iOS/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua)) browser = "Safari";
  return { device, os, browser };
}

function detectChannel(referrer: string, search: string) {
  const params = new URLSearchParams(search);
  const utm = params.get("utm_source");
  if (utm) return utm.toLowerCase();
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes(location.hostname.replace(/^www\./, ""))) return "internal";
    if (/google|bing|duckduckgo|yahoo|yandex|baidu/.test(host)) return "organic";
    if (/facebook|instagram|t\.co|twitter|linkedin|tiktok|youtube|pinterest|reddit/.test(host)) return "social";
    return "referral";
  } catch { return "direct"; }
}

function detectCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const region = tz.split("/")[1] || tz;
    // Rough mapping for common cases
    const map: Record<string, string> = {
      Stockholm: "SE", Oslo: "NO", Copenhagen: "DK", Helsinki: "FI",
      London: "GB", Dublin: "IE", Paris: "FR", Berlin: "DE", Madrid: "ES",
      Rome: "IT", Amsterdam: "NL", Brussels: "BE", Lisbon: "PT", Athens: "GR",
      Istanbul: "TR", Dubai: "AE", Moscow: "RU", Warsaw: "PL", Prague: "CZ",
      Vienna: "AT", Zurich: "CH", New_York: "US", Los_Angeles: "US", Chicago: "US",
      Toronto: "CA", Mexico_City: "MX", Tokyo: "JP", Shanghai: "CN", Hong_Kong: "HK",
      Singapore: "SG", Bangkok: "TH", Jakarta: "ID", Karachi: "PK", Tehran: "IR",
      Sydney: "AU", Auckland: "NZ",
    };
    return map[region] || region;
  } catch { return null; }
}

export function useAnalyticsTracker() {
  const location = useLocation();
  const lastPath = useRef<string>("");

  useEffect(() => {
    if (lastPath.current === location.pathname + location.search) return;
    lastPath.current = location.pathname + location.search;

    // Don't track admin views
    if (location.pathname.startsWith("/admin")) return;

    const { device, os, browser } = parseUA();
    const channel = detectChannel(document.referrer, location.search);
    const country = detectCountry();

    supabase.from("analytics_events").insert({
      event_type: "pageview",
      page: location.pathname + location.search,
      referrer: document.referrer || null,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      device, os, browser, channel, country,
      payload: {
        title: document.title,
        lang: document.documentElement.lang || navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    }).then(({ error }) => {
      if (error) console.warn("analytics", error.message);
    });
  }, [location.pathname, location.search]);
}
