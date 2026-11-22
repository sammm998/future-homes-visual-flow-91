import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type N = { id: string; title: string; body: string | null; link: string | null; read_at: string | null; created_at: string };

export default function NotificationBell() {
  const [items, setItems] = useState<N[]>([]);
  const load = async () => {
    const { data } = await supabase.from("notifications").select("id,title,body,link,read_at,created_at").order("created_at", { ascending: false }).limit(30);
    setItems((data ?? []) as N[]);
  };
  useEffect(() => {
    void load();
    const ch = supabase.channel("admin-notifications").on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (p) => {
      const n = p.new as N; setItems((x) => [n, ...x]);
      if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.hidden) new Notification(n.title, { body: n.body ?? "" });
    }).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, []);
  const unread = items.filter((i) => !i.read_at).length;
  const markAll = async () => {
    const ids = items.filter((i) => !i.read_at).map((i) => i.id); if (!ids.length) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids);
    void load();
  };
  return (
    <Popover onOpenChange={(o) => { if (o && typeof Notification !== "undefined" && Notification.permission === "default") void Notification.requestPermission(); }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3"><span className="text-sm font-medium">Notifications</span><button className="text-xs text-muted-foreground hover:underline" onClick={markAll}>Mark all read</button></div>
        <div className="max-h-96 overflow-y-auto">
          {!items.length && <p className="p-4 text-sm text-muted-foreground">Nothing yet.</p>}
          {items.map((n) => (
            <Link key={n.id} to={n.link ?? "/admin"} className={`block border-b p-3 text-sm hover:bg-muted ${n.read_at ? "opacity-60" : ""}`}>
              <div className="font-medium">{n.title}</div>{n.body && <div className="text-xs text-muted-foreground">{n.body}</div>}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
