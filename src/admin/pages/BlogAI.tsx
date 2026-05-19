import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

export default function BlogAI() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ title: string; content: string; excerpt?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic or title");
    setGenerating(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: {
          topics: [{ title: topic }],
          mode: "single",
          customPrompt: customPrompt || undefined,
        },
      });
      if (error) throw error;
      const article = data?.results?.[0]?.article ?? data?.[0] ?? data?.results?.[0];
      if (!article) throw new Error("No article returned");
      setResult({
        title: article.title || topic,
        content: article.content || article.html || "",
        excerpt: article.excerpt || article.summary,
      });
      toast.success("Article generated");
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!result) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: result.title,
        slug: slugify(result.title),
        content: result.content,
        excerpt: result.excerpt ?? null,
        language_code: "en",
        published: false,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Draft saved");
    navigate(`/admin/blog/${data.id}`);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/admin/blog"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create with AI</h1>
          <p className="text-muted-foreground text-sm">
            Generate a polished article draft. You can edit it after saving.
          </p>
        </div>
      </div>

      <Card className="bg-admin-surface">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-admin-accent" /> Article brief
          </CardTitle>
          <CardDescription>
            Describe the article you want. Be specific about audience, location, and angle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Topic / working title</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Top 5 reasons to invest in Dubai real estate in 2026"
            />
          </div>
          <div>
            <Label>Custom instructions (optional)</Label>
            <Textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Tone, audience, must-include points, CTAs…"
            />
          </div>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Generate article</>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-admin-surface">
          <CardHeader>
            <CardTitle className="text-base">{result.title}</CardTitle>
            {result.excerpt && <CardDescription>{result.excerpt}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="prose prose-sm max-w-none border rounded p-4 max-h-[500px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: result.content }}
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveDraft} disabled={saving}>
                {saving ? "Saving…" : "Save as draft & edit"}
              </Button>
              <Button variant="outline" onClick={() => setResult(null)}>
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
