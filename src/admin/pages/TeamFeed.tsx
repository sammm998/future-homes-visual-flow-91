import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

type Post = { id: string; author_id: string | null; body: string; kind: string; likes: string[]; created_at: string };
type Comment = { id: string; post_id: string | null; author_id: string | null; body: string; created_at: string };

export default function TeamFeed() {
  const { t } = useAdminT();
  const { me, name } = useAdminUsers();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("feed_posts").select("*").order("created_at", { ascending: false }).limit(100);
    const ps = (data as Post[]) ?? [];
    setPosts(ps);
    if (ps.length) {
      const { data: cs } = await supabase.from("feed_comments").select("*").in("post_id", ps.map((p) => p.id)).order("created_at");
      setComments((cs as Comment[]) ?? []);
    }
  };
  useEffect(() => {
    load();
    const ch = supabase.channel(`feed-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "feed_posts" }, (p) => setPosts((ps) => (ps.some((x) => x.id === (p.new as Post).id) ? ps : [p.new as Post, ...ps])))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const post = async () => {
    if (!text.trim()) return;
    const { error } = await supabase.from("feed_posts").insert({ body: text.trim(), author_id: me });
    if (error) return toast.error(error.message);
    setText(""); load();
  };
  const like = async (p: Post) => {
    if (!me) return;
    const likes = p.likes.includes(me) ? p.likes.filter((x) => x !== me) : [...p.likes, me];
    setPosts((ps) => ps.map((x) => (x.id === p.id ? { ...x, likes } : x)));
    await supabase.from("feed_posts").update({ likes }).eq("id", p.id);
  };
  const comment = async (pid: string) => {
    const body = draft[pid]?.trim();
    if (!body) return;
    const { error } = await supabase.from("feed_comments").insert({ post_id: pid, body, author_id: me });
    if (error) return toast.error(error.message);
    setDraft((d) => ({ ...d, [pid]: "" })); load();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("Team feed")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("News, wins and new leads for the whole team.")}</p>
      </div>
      <Card className="bg-admin-surface"><CardContent className="p-4 space-y-2">
        <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("Share something with the team…")} />
        <Button onClick={post}>{t("Post")}</Button>
      </CardContent></Card>
      {posts.map((p) => (
        <Card key={p.id} className="bg-admin-surface"><CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            {p.kind === "system" ? <Zap className="h-4 w-4 text-primary" /> : null}
            <span className="font-semibold">{p.kind === "system" ? t("System") : name(p.author_id)}</span>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm">{p.body}</div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <button onClick={() => like(p)} className="flex items-center gap-1"><Heart className={`h-4 w-4 ${me && p.likes.includes(me) ? "fill-current text-destructive" : ""}`} />{p.likes.length}</button>
            <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{comments.filter((c) => c.post_id === p.id).length}</span>
          </div>
          {comments.filter((c) => c.post_id === p.id).map((c) => (
            <div key={c.id} className="border-l-2 pl-3 text-sm"><span className="font-medium">{name(c.author_id)}</span> {c.body}</div>
          ))}
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); comment(p.id); }}>
            <Input value={draft[p.id] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))} placeholder={t("Write a comment…")} />
            <Button type="submit" size="sm" variant="outline">{t("Comment")}</Button>
          </form>
        </CardContent></Card>
      ))}
    </div>
  );
}
