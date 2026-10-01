import { Suspense, useEffect, useState } from "react";
import { Box, DoorOpen, Hand, Maximize2, Rotate3D, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { InteractivePropertyModel } from "@/components/InteractivePropertyModel";

type ViewMode = "blueprint" | "finished";

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
  const [mode, setMode] = useState<ViewMode>("finished");
  const [immersive, setImmersive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const copy = labels[lang] ?? labels.en;

  useEffect(() => setMounted(true), []);

  return (
    <section className="w-full overflow-hidden bg-navy py-20 text-navy-foreground lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
          <div className="max-w-xl pb-2">
            <Badge className="border border-gold/35 bg-gold/10 text-gold">{copy.studio}</Badge>
            <h2 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              {t("home.before_after")}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-foreground/65 md:text-lg">
              {t("home.before_after_subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-navy-foreground/10 bg-navy-foreground/10">
              <div className="bg-navy p-5">
                <span className="block text-[10px] font-bold uppercase text-gold">{copy.room}</span>
                <span className="mt-2 block text-2xl font-semibold">{copy.area}</span>
              </div>
              <div className="bg-navy p-5">
                <span className="block text-[10px] font-bold uppercase text-gold">{copy.interactive}</span>
                <span className="mt-2 flex items-center gap-2 text-sm font-semibold"><Rotate3D className="h-5 w-5" /> 360°</span>
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -left-5 top-10 hidden h-28 w-px bg-gold/50 lg:block" />
            <div className="relative aspect-[4/5] min-h-[31rem] overflow-hidden rounded-lg border border-navy-foreground/10 bg-navy shadow-[var(--shadow-luxe)] sm:aspect-[16/11]">
              {mounted ? (
                <Suspense fallback={<div className="grid h-full place-items-center text-sm text-navy-foreground/60">{copy.interactive}</div>}>
                  <InteractivePropertyModel mode={mode} immersive={immersive} />
                </Suspense>
              ) : (
                <div className="h-full bg-navy" />
              )}

              <div className="pointer-events-none absolute inset-x-4 top-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:inset-x-6 sm:top-6">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/15 bg-navy/70 px-3 py-2 text-[9px] font-bold uppercase text-navy-foreground backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {copy.interactive}
                  </span>
                </div>
                <Maximize2 className="h-5 w-5 shrink-0 text-navy-foreground/70" />
              </div>

              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                {mode === "finished" && (
                  <Button
                    type="button"
                    className="mx-auto mb-3 flex bg-gold text-gold-foreground shadow-lg hover:bg-gold/90"
                    onClick={() => setImmersive((current) => !current)}
                  >
                    {immersive ? <Undo2 /> : <DoorOpen />} {immersive ? copy.exit : copy.enter}
                  </Button>
                )}
                <div className="grid grid-cols-2 rounded-md border border-navy-foreground/15 bg-navy/75 p-1 backdrop-blur-md">
                  <Button
                    type="button"
                    variant={mode === "blueprint" ? "default" : "ghost"}
                    className={mode === "blueprint" ? "bg-gold text-gold-foreground hover:bg-gold/90" : "text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"}
                    onClick={() => { setMode("blueprint"); setImmersive(false); }}
                  >
                    <Box /> {copy.blueprint}
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "finished" ? "default" : "ghost"}
                    className={mode === "finished" ? "bg-ivory text-navy hover:bg-ivory/90" : "text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"}
                    onClick={() => setMode("finished")}
                  >
                    <Box /> {copy.finished}
                  </Button>
                </div>
                <p className="mt-3 flex items-center justify-center gap-2 text-center text-[10px] font-semibold uppercase text-navy-foreground/55">
                  <Hand className="h-3.5 w-3.5" /> {copy.hint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Feature };