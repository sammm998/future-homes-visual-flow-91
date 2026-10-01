import { Suspense, useEffect, useState } from "react";
import { Box, Hand, Maximize2, Rotate3D } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { InteractivePropertyModel } from "@/components/InteractivePropertyModel";

type ViewMode = "blueprint" | "finished";

const labels: Record<string, { studio: string; blueprint: string; finished: string; hint: string; interactive: string; room: string; area: string }> = {
  en: { studio: "Future Homes Design Studio", blueprint: "3D blueprint", finished: "Finished home", hint: "Drag to rotate · Scroll to zoom", interactive: "Interactive model", room: "2 bedroom residence", area: "118 m²" },
  sv: { studio: "Future Homes Designstudio", blueprint: "3D-ritning", finished: "Färdigt hem", hint: "Dra för att rotera · Scrolla för att zooma", interactive: "Interaktiv modell", room: "Bostad med 2 sovrum", area: "118 m²" },
  no: { studio: "Future Homes Designstudio", blueprint: "3D-tegning", finished: "Ferdig bolig", hint: "Dra for å rotere · Rull for å zoome", interactive: "Interaktiv modell", room: "Bolig med 2 soverom", area: "118 m²" },
  da: { studio: "Future Homes Designstudio", blueprint: "3D-tegning", finished: "Færdigt hjem", hint: "Træk for at rotere · Rul for at zoome", interactive: "Interaktiv model", room: "Bolig med 2 soveværelser", area: "118 m²" },
  tr: { studio: "Future Homes Tasarım Stüdyosu", blueprint: "3D plan", finished: "Tamamlanmış ev", hint: "Döndürmek için sürükleyin · Yakınlaştırmak için kaydırın", interactive: "Etkileşimli model", room: "2 yatak odalı konut", area: "118 m²" },
  de: { studio: "Future Homes Designstudio", blueprint: "3D-Grundriss", finished: "Fertiges Zuhause", hint: "Ziehen zum Drehen · Scrollen zum Zoomen", interactive: "Interaktives Modell", room: "Residenz mit 2 Schlafzimmern", area: "118 m²" },
  fr: { studio: "Studio Design Future Homes", blueprint: "Plan 3D", finished: "Maison terminée", hint: "Glissez pour pivoter · Faites défiler pour zoomer", interactive: "Modèle interactif", room: "Résidence de 2 chambres", area: "118 m²" },
  es: { studio: "Estudio de Diseño Future Homes", blueprint: "Plano 3D", finished: "Hogar terminado", hint: "Arrastra para girar · Desplaza para acercar", interactive: "Modelo interactivo", room: "Residencia de 2 dormitorios", area: "118 m²" },
  id: { studio: "Studio Desain Future Homes", blueprint: "Denah 3D", finished: "Hunian selesai", hint: "Geser untuk memutar · Gulir untuk memperbesar", interactive: "Model interaktif", room: "Hunian 2 kamar tidur", area: "118 m²" },
  ru: { studio: "Дизайн-студия Future Homes", blueprint: "3D-план", finished: "Готовый интерьер", hint: "Перетащите для вращения · Прокрутите для масштаба", interactive: "Интерактивная модель", room: "Резиденция с 2 спальнями", area: "118 м²" },
  ar: { studio: "استوديو تصميم فيوتشر هومز", blueprint: "مخطط ثلاثي الأبعاد", finished: "المنزل المكتمل", hint: "اسحب للتدوير · مرر للتكبير", interactive: "نموذج تفاعلي", room: "مسكن بغرفتي نوم", area: "118 م²" },
  fa: { studio: "استودیو طراحی فیوچر هومز", blueprint: "نقشه سه‌بعدی", finished: "خانه تکمیل‌شده", hint: "برای چرخش بکشید · برای زوم اسکرول کنید", interactive: "مدل تعاملی", room: "اقامتگاه دو خوابه", area: "118 متر مربع" },
  ur: { studio: "فیوچر ہومز ڈیزائن اسٹوڈیو", blueprint: "تھری ڈی نقشہ", finished: "مکمل گھر", hint: "گھمانے کے لیے کھینچیں · زوم کے لیے اسکرول کریں", interactive: "انٹرایکٹو ماڈل", room: "دو بیڈ روم رہائش", area: "118 مربع میٹر" },
};

function Feature() {
  const { t, lang } = useTranslation();
  const [mode, setMode] = useState<ViewMode>("finished");
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
                  <InteractivePropertyModel mode={mode} />
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
                <div className="grid grid-cols-2 rounded-md border border-navy-foreground/15 bg-navy/75 p-1 backdrop-blur-md">
                  <Button
                    type="button"
                    variant={mode === "blueprint" ? "default" : "ghost"}
                    className={mode === "blueprint" ? "bg-gold text-gold-foreground hover:bg-gold/90" : "text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"}
                    onClick={() => setMode("blueprint")}
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