import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import { SUPPORTED_LOCALES } from "@/utils/localeRouting";
import { mediaUrl } from "@/lib/mediaUrl";
import { emptyTestimonial, testimonialPayload, type TestimonialForm } from "@/admin/testimonialForm";

type Translation = { review_text: string; designation: string };
const fields = [
  ["customer_name", "Name"], ["customer_country", "Country"],
  ["location", "Location"], ["property_type", "Property type"],
  ["company_name", "Company"], ["company_url", "Company URL"],
] as const;

export default function TestimonialsManager() {
  const { t } = useAdminT();
  const cache = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyTestimonial);
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const query = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const invalidate = async () => {
    await Promise.all([
      cache.invalidateQueries({ queryKey: ["admin-testimonials"] }),
      cache.invalidateQueries({ queryKey: ["testimonials"] }),
    ]);
  };
  const edit = async (row?: Tables<"testimonials">) => {
    setFormError(""); setLanguage("en"); setTranslations({}); setId(row?.id ?? null);
    if (!row) { setForm({ ...emptyTestimonial }); setOpen(true); return; }
    const { data, error } = await supabase.from("testimonial_translations").select("language_code,review_text,designation").eq("testimonial_id", row.id);
    if (error) { toast.error(error.message); return; }
    setTranslations(Object.fromEntries((data ?? []).map(item => [item.language_code, { review_text: item.review_text, designation: item.designation ?? "" }])));
    setForm(Object.fromEntries(Object.keys(emptyTestimonial).map(key => [key, String(row[key as keyof TestimonialForm] ?? "")])) as TestimonialForm);
    setOpen(true);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setFormError("");
    try {
      const payload = testimonialPayload(form);
      const result = id
        ? await supabase.from("testimonials").update(payload).eq("id", id).select("id").single()
        : await supabase.from("testimonials").insert(payload).select("id").single();
      if (result.error) throw result.error;
      setId(result.data.id);
      const rows = Object.entries(translations).filter(([, value]) => value.review_text.trim()).map(([language_code, value]) => ({
        testimonial_id: result.data.id, language_code, review_text: value.review_text.trim(), designation: value.designation.trim() || null, updated_at: new Date().toISOString(),
      }));
      if (rows.length) {
        const { error } = await supabase.from("testimonial_translations").upsert(rows, { onConflict: "testimonial_id,language_code" });
        if (error) throw error;
      }
      const cleared = Object.entries(translations).filter(([, value]) => !value.review_text.trim()).map(([code]) => code);
      if (cleared.length) {
        const { error } = await supabase.from("testimonial_translations").delete().eq("testimonial_id", result.data.id).in("language_code", cleared);
        if (error) throw error;
      }
      await invalidate(); setOpen(false); toast.success(t("Saved"));
    } catch (error) {
      setFormError(error instanceof Error ? t(error.message) : t("Failed to save"));
    } finally { setBusy(false); }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.size > 20 * 1024 * 1024) { setFormError(t("Choose an image under 20 MB")); return; }
    setUploading(true); setFormError("");
    try {
      const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
      const path = `testimonials/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file);
      if (error) throw error;
      setForm(previous => ({ ...previous, image_url: new URL(mediaUrl(path)).pathname }));
    } catch (error) { setFormError(error instanceof Error ? error.message : t("Failed to save")); }
    finally { setUploading(false); }
  };
  const remove = async (row: Tables<"testimonials">) => {
    if (!confirm(`${t("Delete testimonial?")} ${row.customer_name}`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    await invalidate(); toast.success(t("Deleted"));
  };
  const localized = language === "en" ? form : translations[language] ?? { review_text: "", designation: "" };
  const setText = (key: "review_text" | "designation", value: string) => {
    if (language === "en") setForm(previous => ({ ...previous, [key]: value }));
    else setTranslations(previous => ({ ...previous, [language]: { ...(previous[language] ?? { review_text: "", designation: "" }), [key]: value } }));
  };
  const rows = query.data?.filter(row => `${row.customer_name} ${row.customer_country ?? ""} ${row.review_text}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{t("Testimonials")}</h1>
      <div className="flex gap-2">
        <Button variant="outline" asChild><a href="/testimonials" target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />{t("View")}</a></Button>
        <Button onClick={() => edit()}><Plus className="mr-2 h-4 w-4" />{t("Add testimonial")}</Button>
      </div>
    </div>
    <Input aria-label={t("Search")} placeholder={t("Search...")} value={search} onChange={event => setSearch(event.target.value)} />
    {query.isPending ? <p>{t("Loading...")}</p> : query.isError ? <div role="alert">{query.error.message}<Button variant="outline" onClick={() => query.refetch()}>{t("Refresh")}</Button></div> : !rows?.length ? <p>{t("No results")}</p> : <div className="divide-y border-y">
      {rows.map(row => <div key={row.id} className="flex items-center gap-4 py-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">{row.image_url && <img src={row.image_url} alt={row.customer_name} className="h-full w-full object-cover" />}</div>
        <div className="min-w-0 flex-1"><h2 className="font-semibold break-words">{row.customer_name}</h2><p className="text-sm text-muted-foreground">{row.customer_country} · {row.rating ?? "—"}/5</p><p className="line-clamp-2 text-sm">{row.review_text}</p></div>
        <Button size="icon" variant="ghost" aria-label={`${t("Edit")} ${row.customer_name}`} onClick={() => edit(row)}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" aria-label={`${t("Delete")} ${row.customer_name}`} onClick={() => remove(row)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>)}
    </div>}
    <Dialog open={open} onOpenChange={value => { if (!busy && !uploading) setOpen(value); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{t(id ? "Edit testimonial" : "Add testimonial")}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <div key={key} className="space-y-1"><Label htmlFor={key}>{t(label)}</Label><Input id={key} required={key === "customer_name"} value={form[key]} onChange={event => setForm(previous => ({ ...previous, [key]: event.target.value }))} /></div>)}</div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-1"><Label htmlFor="image_url">{t("Photo URL")}</Label><Input id="image_url" value={form.image_url} onChange={event => setForm(previous => ({ ...previous, image_url: event.target.value }))} /></div>
            <Button variant="outline" type="button" asChild><label className="cursor-pointer"><Upload className="mr-2 h-4 w-4" />{t(uploading ? "Loading..." : "Upload photo")}<input type="file" accept="image/*" className="sr-only" disabled={uploading || busy} onChange={event => upload(event.target.files?.[0])} /></label></Button>
          </div>
          {form.image_url && <img src={form.image_url} alt={form.customer_name || t("Photo URL")} className="h-24 w-24 rounded object-cover" />}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="rating">{t("Rating")}</Label><Input id="rating" type="number" min={1} max={5} step={1} required value={form.rating} onChange={event => setForm(previous => ({ ...previous, rating: event.target.value }))} /></div>
            <div className="space-y-1"><Label>{t("Language")}</Label><Select value={language} onValueChange={setLanguage}><SelectTrigger aria-label={t("Review language")}><SelectValue /></SelectTrigger><SelectContent>{SUPPORTED_LOCALES.map(code => <SelectItem value={code} key={code}>{code.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-1"><Label htmlFor="designation">{t("Position")}</Label><Input id="designation" dir={["ar", "fa", "ur"].includes(language) ? "rtl" : "ltr"} value={localized.designation} onChange={event => setText("designation", event.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="review_text">{t("Review")} · {language.toUpperCase()}</Label><Textarea id="review_text" rows={5} required={language === "en"} dir={["ar", "fa", "ur"].includes(language) ? "rtl" : "ltr"} value={localized.review_text} onChange={event => setText("review_text", event.target.value)} /></div>
          {formError && <p role="alert" className="text-destructive">{formError}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={busy || uploading} onClick={() => setOpen(false)}>{t("Cancel")}</Button><Button type="submit" disabled={busy || uploading}>{t(busy ? "Saving..." : "Save")}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}