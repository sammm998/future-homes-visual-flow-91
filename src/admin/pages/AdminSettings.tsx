import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

export default function AdminSettings() {
  const { t: tr } = useAdminT();
  const [team, setTeam] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: "", position: "", email: "" });

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("display_order");
    setTeam(data ?? []);
    const { data: u } = await supabase.auth.getUser();
    setMe(u.user);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newMember.name || !newMember.position) return toast.error("Name and position required");
    const { error } = await supabase.from("team_members").insert(newMember);
    if (error) return toast.error(error.message);
    setNewMember({ name: "", position: "", email: "" });
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Remove?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Team, account, branding.</p>
      </div>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
        <CardContent className="space-y-2 pt-0 text-sm">
          <div><span className="text-muted-foreground">Email:</span> {me?.email}</div>
          <div><span className="text-muted-foreground">User ID:</span> <code className="text-xs">{me?.id}</code></div>
          <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); location.href = "/admin-login"; }}>Sign out</Button>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Team members</CardTitle></CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid sm:grid-cols-3 gap-2">
            <Input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
            <Input placeholder="Position" value={newMember.position} onChange={(e) => setNewMember({ ...newMember, position: e.target.value })} />
            <Input placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
          </div>
          <Button onClick={add}><Plus className="h-4 w-4 mr-2" /> Add member</Button>
          <div className="divide-y border rounded">
            {team.map((t) => (
              <div key={t.id} className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.position} · {t.email}</div>
                </div>
                <Badge variant={t.is_active ? "default" : "secondary"}>{t.is_active ? "Active" : "Hidden"}</Badge>
                <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            {team.length === 0 && <div className="p-4 text-center text-muted-foreground text-sm">No team members.</div>}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-surface">
        <CardHeader><CardTitle className="text-base">Branding</CardTitle></CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">
          Future Homes International — primary <code>#1a365d</code>, accent <code>#c9a84c</code>.
          Email sender: <code>info@futurehomesturkey.com</code>.
        </CardContent>
      </Card>
    </div>
  );
}
