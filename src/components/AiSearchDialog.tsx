import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Mic, Square, Wand2, MapPin, Bed, Maximize } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildPropertyUrl } from "@/utils/slugHelpers";
import { getCurrentLanguage } from "@/utils/seoUtils";

type Match = {
  ref: string;
  score: number;
  headline: string;
  reason: string;
  property: any;
};
type Result = { summary: string; filters: string[]; matches: Match[] };

export const COPY: Record<string, Record<string, string>> = {
  en: { title: "AI Search", desc: "Describe your dream home in your own words — or record your voice. We match it against every available property.", ph: "e.g. A 2-bedroom apartment near the beach in Antalya under €200,000 with a pool, good for rental income…", rec: "Record", stop: "Stop", go: "Find my matches", working: "Finding the best matches…", listening: "Listening… tap stop when you're done", transcribing: "Turning your voice into text…", fit: "match", view: "View property", again: "New search", none: "No matching properties found. Try describing it differently." },
  sv: { title: "AI-sök", desc: "Beskriv ditt drömboende med egna ord — eller spela in din röst. Vi matchar mot alla tillgängliga bostäder.", ph: "t.ex. En tvåa nära stranden i Antalya under 200 000 € med pool, bra för uthyrning…", rec: "Spela in", stop: "Stopp", go: "Hitta mina matchningar", working: "Letar fram de bästa bostäderna…", listening: "Lyssnar… tryck stopp när du är klar", transcribing: "Gör om rösten till text…", fit: "match", view: "Visa bostad", again: "Ny sökning", none: "Inga matchande bostäder hittades. Försök beskriva på ett annat sätt." },
  no: {"title": "AI-søk", "desc": "Beskriv drømmeboligen med egne ord — eller ta opp stemmen din. Vi matcher mot alle tilgjengelige boliger.", "ph": "f.eks. En 3-roms leilighet nær stranden i Antalya under 200 000 € med basseng…", "rec": "Ta opp", "stop": "Stopp", "go": "Finn mine treff", "working": "Finner de beste treffene…", "listening": "Lytter… trykk stopp når du er ferdig", "transcribing": "Gjør stemmen om til tekst…", "fit": "treff", "view": "Se bolig", "again": "Nytt søk", "none": "Ingen passende boliger funnet. Prøv å beskrive det annerledes."},
  da: {"title": "AI-søgning", "desc": "Beskriv din drømmebolig med dine egne ord — eller optag din stemme. Vi matcher mod alle ledige boliger.", "ph": "f.eks. En 3-værelses lejlighed nær stranden i Antalya under 200.000 € med pool…", "rec": "Optag", "stop": "Stop", "go": "Find mine match", "working": "Finder de bedste match…", "listening": "Lytter… tryk stop når du er færdig", "transcribing": "Laver din stemme om til tekst…", "fit": "match", "view": "Se bolig", "again": "Ny søgning", "none": "Ingen passende boliger fundet. Prøv at beskrive det anderledes."},
  de: {"title": "KI-Suche", "desc": "Beschreiben Sie Ihr Traumhaus in eigenen Worten — oder sprechen Sie es ein. Wir vergleichen mit allen verfügbaren Immobilien.", "ph": "z. B. Eine 3-Zimmer-Wohnung am Strand in Antalya unter 200.000 € mit Pool…", "rec": "Aufnehmen", "stop": "Stopp", "go": "Passende Immobilien finden", "working": "Suche die besten Treffer…", "listening": "Höre zu… tippen Sie auf Stopp, wenn Sie fertig sind", "transcribing": "Sprache wird in Text umgewandelt…", "fit": "Treffer", "view": "Immobilie ansehen", "again": "Neue Suche", "none": "Keine passenden Immobilien gefunden. Versuchen Sie es anders zu beschreiben."},
  fr: {"title": "Recherche IA", "desc": "Décrivez la maison de vos rêves avec vos mots — ou enregistrez votre voix. Nous la comparons à tous les biens disponibles.", "ph": "ex. Un appartement 3 pièces près de la plage à Antalya à moins de 200 000 € avec piscine…", "rec": "Enregistrer", "stop": "Arrêter", "go": "Trouver mes biens", "working": "Recherche des meilleurs biens…", "listening": "À l'écoute… appuyez sur arrêter quand vous avez fini", "transcribing": "Conversion de votre voix en texte…", "fit": "correspondance", "view": "Voir le bien", "again": "Nouvelle recherche", "none": "Aucun bien correspondant. Essayez de le décrire autrement."},
  es: {"title": "Búsqueda IA", "desc": "Describe la casa de tus sueños con tus palabras — o graba tu voz. La comparamos con todas las propiedades disponibles.", "ph": "p. ej. Un piso de 2 dormitorios cerca de la playa en Antalya por menos de 200.000 € con piscina…", "rec": "Grabar", "stop": "Detener", "go": "Buscar mis coincidencias", "working": "Buscando las mejores opciones…", "listening": "Escuchando… pulsa detener cuando termines", "transcribing": "Convirtiendo tu voz en texto…", "fit": "coincidencia", "view": "Ver propiedad", "again": "Nueva búsqueda", "none": "No se encontraron propiedades. Intenta describirlo de otra forma."},
  tr: {"title": "Yapay Zeka Arama", "desc": "Hayalinizdeki evi kendi kelimelerinizle anlatın — ya da sesinizi kaydedin. Tüm mevcut mülklerle eşleştiriyoruz.", "ph": "örn. Antalya'da denize yakın, havuzlu, 200.000 € altında 2+1 daire…", "rec": "Kaydet", "stop": "Durdur", "go": "Eşleşmeleri bul", "working": "En iyi eşleşmeler aranıyor…", "listening": "Dinleniyor… bitince durdur'a dokunun", "transcribing": "Sesiniz metne dönüştürülüyor…", "fit": "eşleşme", "view": "Mülkü gör", "again": "Yeni arama", "none": "Uygun mülk bulunamadı. Farklı şekilde anlatmayı deneyin."},
  ru: {"title": "ИИ-поиск", "desc": "Опишите дом мечты своими словами — или запишите голос. Мы сравним со всеми доступными объектами.", "ph": "напр. Квартира 2+1 у моря в Анталье до 200 000 € с бассейном…", "rec": "Записать", "stop": "Стоп", "go": "Найти варианты", "working": "Подбираем лучшие варианты…", "listening": "Слушаю… нажмите стоп, когда закончите", "transcribing": "Преобразуем голос в текст…", "fit": "совпадение", "view": "Смотреть объект", "again": "Новый поиск", "none": "Подходящих объектов не найдено. Попробуйте описать иначе."},
  ar: {"title": "البحث بالذكاء الاصطناعي", "desc": "صف منزل أحلامك بكلماتك — أو سجّل صوتك. نطابقه مع جميع العقارات المتاحة.", "ph": "مثال: شقة بغرفتي نوم قرب الشاطئ في أنطاليا بأقل من 200,000 € مع مسبح…", "rec": "تسجيل", "stop": "إيقاف", "go": "ابحث عن المطابقات", "working": "جارٍ البحث عن أفضل النتائج…", "listening": "أستمع… اضغط إيقاف عند الانتهاء", "transcribing": "جارٍ تحويل صوتك إلى نص…", "fit": "تطابق", "view": "عرض العقار", "again": "بحث جديد", "none": "لم يتم العثور على عقارات مطابقة. جرّب وصفًا مختلفًا."},
  fa: {"title": "جستجوی هوش مصنوعی", "desc": "خانه رویایی خود را با کلمات خودتان توصیف کنید — یا صدایتان را ضبط کنید. با همه املاک موجود مقایسه می‌کنیم.", "ph": "مثلاً آپارتمان دوخوابه نزدیک ساحل در آنتالیا زیر ۲۰۰٬۰۰۰ یورو با استخر…", "rec": "ضبط", "stop": "توقف", "go": "یافتن موارد مناسب", "working": "در حال یافتن بهترین موارد…", "listening": "در حال گوش دادن… پس از اتمام توقف را بزنید", "transcribing": "تبدیل صدا به متن…", "fit": "تطابق", "view": "مشاهده ملک", "again": "جستجوی جدید", "none": "ملک مناسبی یافت نشد. لطفاً به شکل دیگری توصیف کنید."},
  ur: {"title": "اے آئی سرچ", "desc": "اپنے خوابوں کے گھر کو اپنے الفاظ میں بیان کریں — یا اپنی آواز ریکارڈ کریں۔ ہم تمام دستیاب پراپرٹیز سے موازنہ کرتے ہیں۔", "ph": "مثلاً انطالیہ میں ساحل کے قریب 200,000 € سے کم، سوئمنگ پول کے ساتھ 2 بیڈروم اپارٹمنٹ…", "rec": "ریکارڈ", "stop": "روکیں", "go": "میرے لیے تلاش کریں", "working": "بہترین نتائج تلاش ہو رہے ہیں…", "listening": "سن رہے ہیں… مکمل ہونے پر روکیں دبائیں", "transcribing": "آواز کو متن میں بدلا جا رہا ہے…", "fit": "مطابقت", "view": "پراپرٹی دیکھیں", "again": "نئی تلاش", "none": "کوئی مناسب پراپرٹی نہیں ملی۔ مختلف انداز میں بیان کریں۔"},
  id: {"title": "Pencarian AI", "desc": "Jelaskan rumah impian Anda dengan kata-kata sendiri — atau rekam suara Anda. Kami mencocokkannya dengan semua properti yang tersedia.", "ph": "mis. Apartemen 2 kamar dekat pantai di Antalya di bawah €200.000 dengan kolam renang…", "rec": "Rekam", "stop": "Berhenti", "go": "Temukan yang cocok", "working": "Mencari yang paling cocok…", "listening": "Mendengarkan… ketuk berhenti jika selesai", "transcribing": "Mengubah suara menjadi teks…", "fit": "cocok", "view": "Lihat properti", "again": "Pencarian baru", "none": "Tidak ada properti yang cocok. Coba jelaskan dengan cara lain."},
};

export function AiSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const lang = open ? getCurrentLanguage() || "en" : "en";
  const c = COPY[lang] || COPY.en;
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"idle" | "recording" | "transcribing" | "searching">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => () => recorder.current?.stream.getTracks().forEach((t) => t.stop()), []);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ["audio/webm", "audio/mp4", "audio/ogg"].find((m) => MediaRecorder.isTypeSupported(m)) || "";
      const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = (r.mimeType || "audio/webm").split(";")[0];
        const blob = new Blob(chunks.current, { type });
        if (!blob.size) return setState("idle");
        setState("transcribing");
        try {
          const fd = new FormData();
          fd.append("file", new File([blob], `voice.${type.split("/")[1]}`, { type }));
          const res = await fetch("/api/ai-transcribe", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setQuery((q) => (q ? `${q} ${data.text}` : data.text).trim());
        } catch (e: any) {
          setError(e.message || "Could not transcribe.");
        }
        setState("idle");
      };
      recorder.current = r;
      r.start();
      setState("recording");
    } catch {
      setError("Microphone access was blocked. You can type instead.");
    }
  };

  const search = async () => {
    if (query.trim().length < 3 || state !== "idle") return;
    setState("searching");
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai-search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, lang }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    }
    setState("idle");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] w-[min(64rem,96vw)] max-w-none overflow-y-auto border-gold/30 bg-ivory p-0">
        <div className="bg-navy px-6 pb-7 pt-8 text-navy-foreground sm:px-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <Wand2 className="h-4 w-4" /> Future Homes AI
          </p>
          <DialogTitle className="mt-3 text-3xl font-semibold sm:text-4xl">{c.title}</DialogTitle>
          <DialogDescription className="mt-2 max-w-2xl text-navy-foreground/75">{c.desc}</DialogDescription>

          <div className="mt-6 rounded-md bg-background p-2 shadow-lg">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.metaKey || e.ctrlKey) && search()}
              placeholder={c.ph}
              rows={3}
              className="resize-none border-0 text-base text-foreground shadow-none focus-visible:ring-0"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-1 pt-2">
              {state === "recording" ? (
                <Button type="button" variant="outline" onClick={() => recorder.current?.stop()} className="border-destructive text-destructive">
                  <Square className="mr-1 h-4 w-4 fill-current" /> {c.stop}
                  <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-destructive" />
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={startRecording} disabled={state !== "idle"} className="text-navy">
                  <Mic className="mr-1 h-4 w-4" /> {c.rec}
                </Button>
              )}
              <Button onClick={search} disabled={state !== "idle" || query.trim().length < 3} className="bg-gold text-gold-foreground hover:bg-gold/90">
                {state === "searching" ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Wand2 className="mr-1 h-4 w-4" />}
                {c.go}
              </Button>
            </div>
          </div>
          {(state === "recording" || state === "transcribing") && (
            <p className="mt-3 text-sm text-gold">{state === "recording" ? c.listening : c.transcribing}</p>
          )}
          {error && <p className="mt-3 text-sm text-destructive-foreground/90">{error}</p>}
        </div>

        <div className="px-6 py-8 sm:px-10">
          {state === "searching" && (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-gold" /> {c.working}</p>
              {[0, 1, 2].map((i) => <div key={i} className="h-36 animate-pulse rounded-md bg-muted" />)}
            </div>
          )}

          {result && state !== "searching" && (
            <div className="space-y-6">
              {result.summary && <p className="text-lg leading-relaxed text-navy">{result.summary}</p>}
              {result.filters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.filters.map((f) => (
                    <span key={f} className="rounded-full border border-gold/50 bg-background px-3 py-1 text-xs font-semibold text-navy">{f}</span>
                  ))}
                </div>
              )}
              {result.matches.length === 0 && <p className="text-muted-foreground">{c.none}</p>}
              <ol className="space-y-4">
                {result.matches.map((m, i) => (
                  <li key={m.ref} className="group grid overflow-hidden rounded-md border border-border bg-background shadow-sm transition hover:shadow-[var(--shadow-luxe)] sm:grid-cols-[15rem_1fr]">
                    <a href={buildPropertyUrl(m.property, lang)} className="relative block aspect-[4/3] overflow-hidden bg-navy sm:aspect-auto">
                      {m.property.image && <img src={m.property.image} alt={m.property.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                      <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold">{i + 1}</span>
                    </a>
                    <div className="flex flex-col gap-3 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">REF {m.ref} · {m.headline}</p>
                          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-navy">{m.property.title}</h3>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-2xl font-semibold text-navy">{m.score}%</p>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.fit}</p>
                        </div>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gold" style={{ width: `${m.score}%` }} /></div>
                      <p className="text-sm leading-relaxed text-foreground/80">{m.reason}</p>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1 text-sm text-muted-foreground">
                        <span className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gold" />{[m.property.district, m.property.location].filter(Boolean).join(", ")}</span>
                          {m.property.bedrooms && <span className="flex items-center gap-1"><Bed className="h-4 w-4 text-gold" />{String(m.property.bedrooms).replace("<>", "–")}</span>}
                          {m.property.sizes_m2 && <span className="flex items-center gap-1"><Maximize className="h-4 w-4 text-gold" />{String(m.property.sizes_m2).replace("<>", "–")} m²</span>}
                        </span>
                        <span className="flex items-center gap-3">
                          <strong className="text-base text-navy">{/^\d/.test(String(m.property.price)) ? `€${m.property.price}` : m.property.price}</strong>
                          <Button asChild size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90">
                            <a href={buildPropertyUrl(m.property, lang)}>{c.view}<ArrowRight className="ml-1 h-4 w-4" /></a>
                          </Button>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AiSearchDialog;
