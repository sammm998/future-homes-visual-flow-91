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
