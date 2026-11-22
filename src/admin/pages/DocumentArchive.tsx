import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import DocumentsPanel from "@/admin/crm/DocumentsPanel";

export default function DocumentArchive() {
  const { t } = useAdminT();
  const [ref, setRef] = useState("");
  const [query, setQuery] = useState("");
  const scopeRef = ref.trim() || null;
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">{t("Document archive")}</h1>
        <p className="text-sm text-muted-foreground">{t("Private files — only admins can open them. Files added on a lead or deal also appear here.")}</p></div>
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-[200px]" placeholder={t("Property REF folder")} value={ref} onChange={(e) => setRef(e.target.value)} />
        <Input className="max-w-xs" placeholder={t("Search name or tag")} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <DocumentsPanel scope={{ propertyRef: scopeRef }} query={query} />
    </div>
  );
}
