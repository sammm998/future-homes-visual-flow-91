import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CampaignEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    subject: "", from_name: "Future Homes International",
    reply_to: "info@futurehomesturkey.com", html: "", status: "draft",
  });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("email_campaigns").select("*").eq("id", id!).maybeSingle();
      if (data) setForm({
        subject: data.subject ?? "", from_name: data.from_name ?? "Future Homes International",
        reply_to: data.reply_to ?? "", html: data.html ?? "", status: data.status,
      });
      setLoading(false);
    })();
  }, [id]);

  const save = async () => {
    if (!form.subject.trim()) return toast.error("Subject required");
    setSaving(true);
    if (isNew) {
      const { data, error } = await supabase.from("email_campaigns").insert(form).select("id").single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Created");
      navigate(`/admin/email/campaigns/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase.from("email_campaigns").update(form).eq("id", id!);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
  };

  const remove = async () => {
    if (!confirm("Delete?")) return;
    await supabase.from("email_campaigns").delete().eq("id", id!);
    navigate("/admin/email/campaigns");
  };

  const sendTest = async () => {
    setSending(true);
    toast.info("Test send wiring goes here (Resend edge function).");
    setSending(false);
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon"><Link to="/admin/email/campaigns"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-2xl font-semibold tracking-tight">{isNew ? "New campaign" : form.subject}</h1>
          {!isNew && <Badge>{form.status}</Badge>}
        </div>
        <div className="flex gap-2">
          {!isNew && <Button variant="outline" onClick={remove}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>}
          <Button variant="outline" onClick={sendTest} disabled={sending}><Send className="h-4 w-4 mr-2" /> Send test</Button>
          <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Setup</CardTitle></CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>From name</Label><Input value={form.from_name} onChange={(e) => setForm({ ...form, from_name: e.target.value })} /></div>
            <div><Label>Reply-to</Label><Input value={form.reply_to} onChange={(e) => setForm({ ...form, reply_to: e.target.value })} /></div>
          </div>
          <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">HTML content</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <Textarea rows={20} className="font-mono text-xs" value={form.html} onChange={(e) => setForm({ ...form, html: e.target.value })} />
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="border rounded p-4 max-h-[400px] overflow-auto bg-white" dangerouslySetInnerHTML={{ __html: form.html }} />
        </CardContent>
      </Card>
    </div>
  );
}
