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
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { HelmetProvider } from '@/lib/helmet-compat';

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
import { useLanguageUrlSync } from "@/hooks/useLanguageUrlSync";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Property for Sale in Turkey, Dubai, Cyprus & Bali" },
      { name: "title", content: "Property for Sale in Turkey, Dubai, Cyprus & Bali" },
      {
        name: "description",
        content:
          "Buy apartments, villas and off-plan homes in Turkey, Dubai, Cyprus and Bali. Turkish citizenship by investment from $400K. Expert local agents.",
      },
      {
        name: "keywords",
        content:
          "property for sale in turkey, apartments for sale in turkey, villas for sale in turkey, property for sale dubai, property for sale in cyprus, property for sale in bali, turkish citizenship by investment, real estate turkey, antalya apartments, istanbul property",
      },
      { name: "author", content: "Future Homes International" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "google-site-verification", content: "tX9miiJWQEEYeB5sWZ8ZeSrcL_RViXlqe_l9fxM7UfQ" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Property for Sale in Turkey, Dubai, Cyprus & Bali" },
      { property: "og:url", content: "https://futurehomesinternational.com/" },
      {
        property: "og:description",
        content:
          "Apartments, villas and off-plan homes with Future Homes International. Investment, citizenship and expert local guidance.",
      },
      { property: "og:image", content: "https://futurehomesinternational.com/og-image.jpg" },
      { property: "og:image:alt", content: "Future Homes International property portfolio" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: "Future Homes International" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: "https://futurehomesinternational.com/" },
      { name: "twitter:title", content: "Property for Sale in Turkey, Dubai, Cyprus & Bali" },
      {
        name: "twitter:description",
        content:
          "Apartments, villas and off-plan homes with Future Homes International. Investment, citizenship and expert local guidance.",
      },
      { name: "twitter:image", content: "https://futurehomesinternational.com/og-image.jpg" },
      { name: "theme-color", content: "#1a365d" },
      { name: "msapplication-TileColor", content: "#1a365d" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Urbanist:wght@500;600;700;800&family=Epilogue:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=5" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=5" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=5" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=5" },
      { rel: "manifest", href: "/site.webmanifest?v=5" },
      { rel: "dns-prefetch", href: "//kiogiyemoqbnuvclneoe.supabase.co" },
      { rel: "preconnect", href: "https://kiogiyemoqbnuvclneoe.supabase.co", crossOrigin: "anonymous" },
    ],
    scripts: [
      // Google Tag Manager (ported from index.html)
      {
        children:
          "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-MNJGPRLB');",
      },
      // Google Analytics (ported from index.html)
      { src: "https://www.googletagmanager.com/gtag/js?id=G-BVKH3BBPG0", async: true },
      {
        children:
          "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-BVKH3BBPG0');",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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

  return (
    <>
      <ConnectionStatus />
      <main>
        <Outlet />
      </main>
    </>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
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
