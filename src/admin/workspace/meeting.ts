export function newRoomUrl(title: string, rand: () => string = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12)): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "meeting";
  return `https://meet.jit.si/FutureHomes-${slug}-${rand()}`;
}
export function shareExpiry(days: number, now = Date.now()): string {
  const d = Math.min(Math.max(Math.round(days), 1), 90);
  return new Date(now + d * 864e5).toISOString();
}
