import { Building2, Film, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";
import { useMediaVisibility } from "@/hooks/useMediaVisibility";
import { useTranslation } from "@/hooks/useTranslation";
import apartmentTransformation from "@/assets/apartment-blueprint-to-finished.mp4.asset.json";
import apartmentPoster from "@/assets/apartment-video-poster.jpg.asset.json";

const labels: Record<string, { studio: string; blueprint: string; finished: string; hint: string; interactive: string; room: string; area: string; enter: string; exit: string }> = {
  en: { studio: "Future Homes Design Studio", blueprint: "3D blueprint", finished: "Finished home", hint: "Drag to look around · Scroll to move closer", interactive: "Interactive model", room: "2 bedroom residence", area: "118 m²", enter: "Enter the home", exit: "Exit interior" },
  sv: { studio: "Future Homes Designstudio", blueprint: "3D-ritning", finished: "Färdigt hem", hint: "Dra för att se dig omkring · Scrolla för att gå närmare", interactive: "Interaktiv modell", room: "Bostad med 2 sovrum", area: "118 m²", enter: "Gå in i bostaden", exit: "Lämna interiören" },
  no: { studio: "Future Homes Designstudio", blueprint: "3D-tegning", finished: "Ferdig bolig", hint: "Dra for å se deg rundt · Rull for å gå nærmere", interactive: "Interaktiv modell", room: "Bolig med 2 soverom", area: "118 m²", enter: "Gå inn i boligen", exit: "Forlat interiøret" },
  da: { studio: "Future Homes Designstudio", blueprint: "3D-tegning", finished: "Færdigt hjem", hint: "Træk for at se dig omkring · Rul for at gå tættere på", interactive: "Interaktiv model", room: "Bolig med 2 soveværelser", area: "118 m²", enter: "Gå ind i boligen", exit: "Forlad interiøret" },
  tr: { studio: "Future Homes Tasarım Stüdyosu", blueprint: "3D plan", finished: "Tamamlanmış ev", hint: "Etrafı görmek için sürükleyin · Yaklaşmak için kaydırın", interactive: "Etkileşimli model", room: "2 yatak odalı konut", area: "118 m²", enter: "Evin içine gir", exit: "İç mekândan çık" },
  de: { studio: "Future Homes Designstudio", blueprint: "3D-Grundriss", finished: "Fertiges Zuhause", hint: "Ziehen zum Umschauen · Scrollen zum Annähern", interactive: "Interaktives Modell", room: "Residenz mit 2 Schlafzimmern", area: "118 m²", enter: "Wohnung betreten", exit: "Innenraum verlassen" },
  fr: { studio: "Studio Design Future Homes", blueprint: "Plan 3D", finished: "Maison terminée", hint: "Glissez pour regarder · Faites défiler pour avancer", interactive: "Modèle interactif", room: "Résidence de 2 chambres", area: "118 m²", enter: "Entrer dans le logement", exit: "Quitter l’intérieur" },
  es: { studio: "Estudio de Diseño Future Homes", blueprint: "Plano 3D", finished: "Hogar terminado", hint: "Arrastra para mirar · Desplaza para acercarte", interactive: "Modelo interactivo", room: "Residencia de 2 dormitorios", area: "118 m²", enter: "Entrar en la vivienda", exit: "Salir del interior" },
  id: { studio: "Studio Desain Future Homes", blueprint: "Denah 3D", finished: "Hunian selesai", hint: "Geser untuk melihat · Gulir untuk mendekat", interactive: "Model interaktif", room: "Hunian 2 kamar tidur", area: "118 m²", enter: "Masuk ke hunian", exit: "Keluar dari interior" },
  ru: { studio: "Дизайн-студия Future Homes", blueprint: "3D-план", finished: "Готовый интерьер", hint: "Перетащите для обзора · Прокрутите для приближения", interactive: "Интерактивная модель", room: "Резиденция с 2 спальнями", area: "118 м²", enter: "Войти в интерьер", exit: "Выйти из интерьера" },
  ar: { studio: "استوديو تصميم فيوتشر هومز", blueprint: "مخطط ثلاثي الأبعاد", finished: "المنزل المكتمل", hint: "اسحب للنظر حولك · مرر للاقتراب", interactive: "نموذج تفاعلي", room: "مسكن بغرفتي نوم", area: "118 م²", enter: "ادخل إلى المنزل", exit: "اخرج من الداخل" },
  fa: { studio: "استودیو طراحی فیوچر هومز", blueprint: "نقشه سه‌بعدی", finished: "خانه تکمیل‌شده", hint: "برای نگاه کردن بکشید · برای نزدیک شدن اسکرول کنید", interactive: "مدل تعاملی", room: "اقامتگاه دو خوابه", area: "118 متر مربع", enter: "وارد خانه شوید", exit: "خروج از فضای داخلی" },
  ur: { studio: "فیوچر ہومز ڈیزائن اسٹوڈیو", blueprint: "تھری ڈی نقشہ", finished: "مکمل گھر", hint: "دیکھنے کے لیے کھینچیں · قریب جانے کے لیے اسکرول کریں", interactive: "انٹرایکٹو ماڈل", room: "دو بیڈ روم رہائش", area: "118 مربع میٹر", enter: "گھر کے اندر جائیں", exit: "اندرونی حصے سے نکلیں" },
};

function Feature() {
  const { t, lang } = useTranslation();
  const copy = labels[lang] ?? labels.en;
  const { ref, visible, hasEntered } = useMediaVisibility<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (visible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void video.play().catch(() => {});
    } else video.pause();
  }, [visible]);

  return (
    <section className="w-full overflow-hidden bg-navy py-14 text-navy-foreground sm:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
          <div className="max-w-xl pb-2">
            <Badge className="border border-gold/35 bg-gold/10 text-gold">{copy.studio}</Badge>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t("home.before_after")}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-foreground/65 md:text-lg">
              {t("home.before_after_subtitle")}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-navy-foreground/10 bg-navy-foreground/10 sm:mt-10">
              <div className="min-w-0 bg-navy p-4 sm:p-5">
                <span className="block text-[10px] font-bold uppercase text-gold">{copy.room}</span>
                <span className="mt-2 block text-2xl font-semibold">{copy.area}</span>
              </div>
              <div className="min-w-0 bg-navy p-4 sm:p-5">
                <span className="block text-[10px] font-bold uppercase text-gold">{copy.blueprint}</span>
                <span className="mt-2 flex items-center gap-2 text-sm font-semibold"><Building2 className="h-5 w-5" /> {copy.finished}</span>
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -left-5 top-10 hidden h-28 w-px bg-gold/50 lg:block" />
            <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-navy-foreground/10 bg-navy shadow-[var(--shadow-luxe)] sm:aspect-video">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={hasEntered ? apartmentTransformation.url : undefined}
                poster={apartmentPoster.url}
                muted
                loop
                playsInline
                controls
                preload="none"
                aria-label={`${copy.blueprint} — ${copy.finished}`}
              />

              <div className="pointer-events-none absolute inset-x-3 top-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:inset-x-6 sm:top-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/15 bg-navy/75 px-3 py-2 text-[9px] font-bold uppercase text-navy-foreground backdrop-blur-md">
                  <Film className="h-3.5 w-3.5 text-gold" />
                  {copy.blueprint}
                </span>
                <span className="inline-flex items-center gap-2 justify-self-end rounded-full border border-gold/30 bg-navy/75 px-3 py-2 text-[9px] font-bold uppercase text-navy-foreground backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  {copy.finished}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Feature };