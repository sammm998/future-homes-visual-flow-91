import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { adminTr } from "./adminTranslationsTr";

export type AdminLang = "en" | "tr";

const STORAGE_KEY = "admin_lang";

interface AdminI18nValue {
  lang: AdminLang;
  setLang: (l: AdminLang) => void;
  /** Translate an English source string to the active admin language. */
  t: (s: string) => string;
}

const AdminI18nContext = createContext<AdminI18nValue | null>(null);

const getInitialLang = (): AdminLang => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "tr" ? "tr" : "en";
};

export function AdminI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(getInitialLang);

  const setLang = useCallback((l: AdminLang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  const t = useCallback(
    (s: string) => {
      if (lang === "tr") return adminTr[s] ?? s;
      return s;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminT() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) {
    // Fallback: identity translation when used outside the provider.
    return { lang: "en" as AdminLang, setLang: () => {}, t: (s: string) => s };
  }
  return ctx;
}
