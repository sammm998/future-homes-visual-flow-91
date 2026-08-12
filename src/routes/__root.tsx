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
import { useLanguageUrlSync } from "@/hooks/useLanguageUrlSync";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const location = useRouterState({ select: (s) => s.location });
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
