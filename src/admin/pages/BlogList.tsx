import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Row {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
  featured_image: string | null;
  language_code: string | null;
  views_count: number | null;
  created_at: string;
}

export default function BlogList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const load = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,title,slug,category,published,published_at,featured_image,language_code,views_count,created_at")
      .is("parent_post_id", null)
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) toast.error(error.message);
    setRows((data as Row[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    load();
  };

  const filtered = useMemo(() => {
    if (!rows) return null;
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "published" && !r.published) return false;
      if (filter === "draft" && r.published) return false;
      if (!needle) return true;
      return (
        r.title?.toLowerCase().includes(needle) ||
        r.category?.toLowerCase().includes(needle) ||
        r.slug?.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, filter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage articles, drafts, and SEO content.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/blog/ai">
              <Sparkles className="h-4 w-4 mr-2" /> Create with AI
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" /> New post
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-admin-surface">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search title, slug, category…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "published", "draft"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filter === s ? "default" : "outline"}
                onClick={() => setFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardContent className="p-0">
          {!filtered ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No posts yet.</div>
          ) : (
            <div className="divide-y">
              {filtered.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4">
                  <div className="w-16 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                    {r.featured_image && (
                      <img src={r.featured_image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{r.title}</span>
                      <Badge variant={r.published ? "default" : "secondary"}>
                        {r.published ? "Published" : "Draft"}
                      </Badge>
                      {r.category && <Badge variant="outline">{r.category}</Badge>}
                      {r.language_code && r.language_code !== "en" && (
                        <Badge variant="outline">{r.language_code.toUpperCase()}</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      /{r.slug ?? r.id} · {new Date(r.created_at).toLocaleDateString()}
                      {r.views_count ? ` · ${r.views_count} views` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.slug && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button asChild size="icon" variant="ghost">
                      <Link to={`/admin/blog/${r.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
