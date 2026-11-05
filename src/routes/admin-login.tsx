import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/pages/AdminLogin";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [
    { title: 'Admin Login | Future Homes International' },
    { name: 'description', content: 'Secure team sign-in and password recovery for Future Homes International.' },
    { property: 'og:title', content: 'Admin Login | Future Homes International' },
    { property: 'og:description', content: 'Secure team sign-in and password recovery for Future Homes International.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: AdminLogin,
});
