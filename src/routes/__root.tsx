// ported from main.tsx / App.tsx
import "@/utils/cleanConsole";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { HelmetProvider } from '@/lib/helmet-compat';
import { setCurrentLocation, getCurrentLanguage } from "@/utils/seoUtils";


import appCss from "../styles.css?url";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import NotFound from "@/pages/NotFound";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguageUrlSync } from "@/hooks/useLanguageUrlSync";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import PublicSidebarRail from "@/components/PublicSidebarRail";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Sitewide defaults only — per-page title/description/og live in SEOHead
    meta: [
      { charSet: "UTF-8" },
      { name: "author", content: "Future Homes International" },
      { name: "google-site-verification", content: "tX9miiJWQEEYeB5sWZ8ZeSrcL_RViXlqe_l9fxM7UfQ" },
      { property: "og:site_name", content: "Future Homes International" },
      { name: "theme-color", content: "#071827" },
      { name: "msapplication-TileColor", content: "#071827" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap",
        media: "print",
        "data-font-css": "true",
      } as unknown as { rel: string; href: string },

      { rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=5" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=5" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=5" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=5" },
      { rel: "manifest", href: "/site.webmanifest?v=5" },
      { rel: "dns-prefetch", href: "//kiogiyemoqbnuvclneoe.supabase.co" },
      { rel: "preconnect", href: "https://kiogiyemoqbnuvclneoe.supabase.co", crossOrigin: "anonymous" },
    ],
    scripts: [
      {
        children:
          "(function(){function a(){var l=document.querySelectorAll('link[data-font-css]');for(var i=0;i<l.length;i++){l[i].media='all';}}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',a);}else{a();}window.addEventListener('load',a);})();",
      },
      {
        // Analytics (GTM + GA4) are loaded lazily — after the page is interactive
        // or on first user interaction — so they no longer block LCP/TBT.
        children:
          "(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};var loaded=false;function load(){if(loaded)return;loaded=true;" +
          "(function(w,d,s,l,i){w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MNJGPRLB');" +
          // GA4 (G-BVKH3BBPG0) is served through the GTM container above, so we do
          // NOT load gtag/js a second time here — that duplicated ~570 kB of JS.
          "window.gtag('js',new Date());}" +
          "var ev=['scroll','pointerdown','keydown','touchstart'];function onEv(){ev.forEach(function(e){window.removeEventListener(e,onEv)});load();}" +
          "ev.forEach(function(e){window.addEventListener(e,onEv,{once:true,passive:true})});" +
          "function schedule(){if('requestIdleCallback' in window){requestIdleCallback(load,{timeout:12000});}else{setTimeout(load,10000);}}" +
          "if(document.readyState==='complete'){schedule();}else{window.addEventListener('load',schedule);}})();",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const location = router.state.location;
  // Make the active locale available to non-hook helpers during SSR *and*
  // on the client, so server HTML matches what React hydrates.
  setCurrentLocation(location.pathname, location.searchStr ? `?${location.searchStr}` : "");
  const lang = getCurrentLanguage();
  const dir = ["ar", "fa", "ur"].includes(lang) ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <HeadContent />

      </head>
      <body>
        {/* Google Tag Manager (noscript) — ported from index.html */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MNJGPRLB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerLocation = useRouterState({ select: (s) => s.location });
  setCurrentLocation(
    routerLocation.pathname,
    routerLocation.searchStr ? `?${routerLocation.searchStr}` : "",
  );
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <TooltipProvider>
              <PerformanceMonitor logLevel="none" />
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <AppChrome />
            </TooltipProvider>
          </CurrencyProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

function AppChrome() {
  // Keep locale prefix, legacy ?lang= links and property URLs in sync
  useLanguageUrlSync();
  useAnalyticsTracker();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const pathWithoutLocale = pathname.replace(/^\/(?:sv|da|de|no|fr|tr|ru|ar|fa|ur|es|id)(?=\/|$)/, "");
  const isInternal = /^\/(?:admin(?:\/|-|$)|auth(?:\/|$))/.test(pathWithoutLocale);

  return (
    <>
      <ConnectionStatus />
      {!isInternal && <PublicSidebarRail />}
      <main>
        <Outlet />
      </main>
      <WhatsAppButton />
    </>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="text-muted-foreground">Something went wrong on our end. You can try again or head back home.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a className="px-4 py-2 rounded-md border border-border text-foreground" href="/">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
