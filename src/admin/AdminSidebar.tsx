import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Newspaper,
  Users,
  Mail,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
  Inbox,
  Send,
  UserCircle2,
  ListChecks,
  Globe2,
  Plus,
  Megaphone,
  Activity,
  Flame,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

type Item = { to: string; label: string; icon: typeof Home; end?: boolean };

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/properties", label: "Properties", icon: Home },
      { to: "/admin/properties/new", label: "Add property", icon: Plus },
      { to: "/admin/blog", label: "Blog", icon: Newspaper },
      { to: "/admin/blog/ai", label: "Create with AI", icon: Sparkles },
    ],
  },
  {
    label: "CRM",
    items: [
      { to: "/admin/crm/leads", label: "Leads", icon: Users },
      { to: "/admin/crm/contacts", label: "Contacts", icon: UserCircle2 },
      { to: "/admin/crm/tasks", label: "Tasks", icon: ListChecks },
    ],
  },
  {
    label: "Email",
    items: [
      { to: "/admin/email/inbox", label: "Inbox", icon: Inbox },
      { to: "/admin/email/campaigns", label: "Campaigns", icon: Megaphone },
      { to: "/admin/email/subscribers", label: "Subscribers", icon: Mail },
      { to: "/admin/email/templates", label: "Templates", icon: Send },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/admin/analytics/traffic", label: "Traffic", icon: BarChart3 },
      { to: "/admin/analytics/properties", label: "Properties", icon: Home },
      { to: "/admin/analytics/leads", label: "Leads", icon: Users },
      { to: "/admin/analytics/email", label: "Email", icon: Mail },
      { to: "/admin/analytics/realtime", label: "Realtime", icon: Activity },
      { to: "/admin/analytics/heatmap", label: "Heatmaps", icon: Flame },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
      { to: "/", label: "Visit site", icon: Globe2 },
    ],
  },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-admin-sidebar-border bg-admin-sidebar text-admin-sidebar-foreground">
      <SidebarHeader className="bg-admin-sidebar text-admin-sidebar-foreground">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="h-8 w-8 rounded-md bg-admin-accent text-admin-sidebar grid place-items-center font-bold">FH</div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Future Homes</div>
              <div className="text-[11px] uppercase tracking-wider opacity-70">Admin</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-admin-sidebar">
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-admin-sidebar-foreground/60 text-[11px] uppercase tracking-wider">
                {g.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = item.end ? pathname === item.to : pathname.startsWith(item.to) && item.to !== "/";
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="hover:bg-white/10 data-[active=true]:bg-admin-accent/15 data-[active=true]:text-admin-accent data-[active=true]:border-l-2 data-[active=true]:border-admin-accent rounded-md text-admin-sidebar-foreground"
                      >
                        <NavLink to={item.to} end={item.end}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
