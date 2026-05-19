import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export default function BlogEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    featured_image: "",
    meta_title: "",
    meta_description: "",
    language_code: "en",
    published: false,
  });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) toast.error(error.message);
      if (data) {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          category: data.category ?? "",
          tags: (data.tags ?? []).join(", "),
          featured_image: data.featured_image ?? "",
          meta_title: data.meta_title ?? "",
          meta_description: data.meta_description ?? "",
          language_code: data.language_code ?? "en",
          published: !!data.published,
        });
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  const update = (k: keyof typeof form, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      excerpt: form.excerpt || null,
      content: form.content,
      category: form.category || null,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      featured_image: form.featured_image || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      language_code: form.language_code || "en",
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    };

    if (isNew) {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(payload)
        .select("id")
        .single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Post created");
      navigate(`/admin/blog/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id!);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Post saved");
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) return;
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    navigate("/admin/blog");
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/blog"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isNew ? "New post" : "Edit post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="bg-admin-surface">
            <CardContent className="p-5 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  onBlur={() => !form.slug && update("slug", slugify(form.title))}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  placeholder="my-post"
                />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                />
              </div>
              <div>
                <Label>Content (HTML or Markdown)</Label>
                <Textarea
                  rows={20}
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div>
                <Label>Meta title</Label>
                <Input
                  value={form.meta_title}
                  onChange={(e) => update("meta_title", e.target.value)}
                />
              </div>
              <div>
                <Label>Meta description</Label>
                <Textarea
                  rows={2}
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="pub">Published</Label>
                <Switch
                  id="pub"
                  isSelected={form.published}
                  onChange={(v) => update("published", v)}
                />
              </div>
              <div>
                <Label>Language</Label>
                <Input
                  value={form.language_code}
                  onChange={(e) => update("language_code", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Taxonomy</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                />
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-surface">
            <CardHeader><CardTitle className="text-base">Featured image</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <Input
                placeholder="https://…"
                value={form.featured_image}
                onChange={(e) => update("featured_image", e.target.value)}
              />
              {form.featured_image && (
                <img
                  src={form.featured_image}
                  alt=""
                  className="w-full aspect-video object-cover rounded"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
