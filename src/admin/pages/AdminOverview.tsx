import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, Mail, Newspaper, Plus, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

interface Counts {
  properties: number;
  activeProperties: number;
  blog: number;
  leads: number;
  subscribers: number;
}

export default function AdminOverview() {
  const { t } = useAdminT();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const load = async () => {
      const [props, active, blog, leads, subs] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscriptions").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      setCounts({
        properties: props.count ?? 0,
        activeProperties: active.count ?? 0,
        blog: blog.count ?? 0,
        leads: leads.count ?? 0,
        subscribers: subs.count ?? 0,
      });
    };
    load();
  }, []);

  const stats = [
    { label: t("Properties"), value: counts?.properties, sub: `${counts?.activeProperties ?? 0} ${t("active")}`, icon: Home, href: "/admin/properties" },
    { label: t("Blog posts"), value: counts?.blog, sub: t("All languages"), icon: Newspaper, href: "/admin/blog" },
    { label: t("Leads"), value: counts?.leads, sub: t("Total captured"), icon: Users, href: "/admin/crm/leads" },
    { label: t("Subscribers"), value: counts?.subscribers, sub: t("Active"), icon: Mail, href: "/admin/email/subscribers" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Dashboard")}</h1>
          <p className="text-muted-foreground mt-1">{t("Future Homes International — central operations.")}</p>
        </div>
        <Button asChild className="bg-admin-sidebar text-admin-sidebar-foreground hover:bg-admin-sidebar/90">
          <Link to="/admin/properties/new"><Plus className="h-4 w-4 mr-1.5" /> {t("Add property")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-admin-surface shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-admin-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight tabular-nums">
                {s.value ?? <span className="inline-block h-8 w-12 bg-muted animate-pulse rounded" />}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{s.sub}</span>
                <Link to={s.href} className="text-xs text-admin-accent inline-flex items-center hover:underline">
                  Open <ArrowUpRight className="h-3 w-3 ml-0.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-admin-surface lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button asChild variant="outline" className="justify-start"><Link to="/admin/properties/new"><Plus className="h-4 w-4 mr-2" />New property</Link></Button>
            <Button asChild variant="outline" className="justify-start"><Link to="/admin/blog/ai"><Newspaper className="h-4 w-4 mr-2" />AI blog post</Link></Button>
            <Button asChild variant="outline" className="justify-start"><Link to="/admin/crm/leads"><Users className="h-4 w-4 mr-2" />Open leads</Link></Button>
            <Button asChild variant="outline" className="justify-start"><Link to="/admin/email/inbox"><Mail className="h-4 w-4 mr-2" />Inbox</Link></Button>
            <Button asChild variant="outline" className="justify-start"><Link to="/admin/email/campaigns"><Mail className="h-4 w-4 mr-2" />New campaign</Link></Button>
            <Button asChild variant="outline" className="justify-start"><Link to="/admin/analytics/traffic">View analytics</Link></Button>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface">
          <CardHeader>
            <CardTitle>Build status</CardTitle>
            <CardDescription>Admin dashboard rollout</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between"><span>Shell + Properties CMS</span><span className="text-emerald-600">Live</span></div>
            <div className="flex justify-between"><span>Blog + AI Creator</span><span className="text-muted-foreground">Phase 2</span></div>
            <div className="flex justify-between"><span>CRM + Inbox</span><span className="text-muted-foreground">Phase 3</span></div>
            <div className="flex justify-between"><span>Email marketing</span><span className="text-muted-foreground">Phase 4</span></div>
            <div className="flex justify-between"><span>Analytics</span><span className="text-muted-foreground">Phase 5</span></div>
            <div className="flex justify-between"><span>Settings + polish</span><span className="text-muted-foreground">Phase 6</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
