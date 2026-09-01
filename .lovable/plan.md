# Prestandalyft: från 73 mot 95-100 i PageSpeed (mobil)

Rapporten pekar ut fem konkreta flaskhalsar. LCP på 30,3 s är helt dominerande och beror på två saker: enorma okomprimerade bilder och att LCP-elementet är AI-assistentens avatar med 2 000 ms renderingsfördröjning.

## 1. Krossa bildvikten (störst effekt)

Statiska bilder i `public/lovable-uploads/` och `src/assets/` är kraftigt översto ra:

- `122a7bd0-...png` — 3,0 MB (visas i 721 px bredd)
- `291af508-...png` / `ali-karan-founder.png` — 2,1 MB
- `37669c23-...png` — 1,0 MB, `760abba9-...png` — 1,0 MB
- ytterligare ett tjugotal filer över 500 KB

Åtgärd: konvertera alla dessa till WebP i flera bredder (480/768/1200) och byt ut referenserna i koden mot `<picture>`/`srcset` med `sizes`. Originalen ersätts, inte behålls. Enbart detta tar bort ~8,5 MB av nedladdningen på startsidan.

## 2. Supabase-bilder via bildtransformation

`OptimizedPropertyImage` returnerar idag Supabase-URL:er oförändrade (`createOptimizedUrl` gör ingenting). Vi kopplar på Supabase render-endpointen med `width`, `quality=75`, `format=webp` per srcset-bredd. Samma sak för testimonial-avatarer, som idag laddar 1254×1254 (180 KB styck) för att visas i 40×40 — de begärs i 80 px.

## 3. Fixa LCP-elementet

LCP är `<img src="/assets/ai-avatar...jpg">` inuti AI-assistent-widgeten, med 2 000 ms "fördröjning av elementrendering". Widgeten är inte huvudinnehåll och ska inte vara LCP-kandidat.

- Montera AI-assistenten först efter hydrering/idle (eller vid interaktion) så den inte tävlar om första renderingen.
- Ge avataren explicit `width`/`height` och `loading="lazy"`.
- Låt hero-bilden vara den enda `fetchpriority="high"`-resursen, med `rel=preload` i rutten.

## 4. Layout och CLS-skydd

Ett tjugotal `<img>` saknar `width`/`height`. Vi lägger till explicita mått eller `aspect-*`-wrapper på alla bilder som listas i rapporten (destinationskort, logotyper, artikelbilder, property-kort, testimonials).

## 5. Cache och renderingsblockering

- `/lovable-uploads/*` och `/future-homes-logo-new.jpg` serveras utan cache-header. Vi sätter `Cache-Control: public, max-age=31536000, immutable` för statiska tillgångar.
- Google Fonts-anropet blockerar rendering i 750 ms. Vi laddar CSS:en icke-blockerande (`media="print"` + `onload`) med `<noscript>`-fallback, och behåller `display=swap`.
- Logotypen används i menyn i 385×228 men filen är 1609×953 — byts mot rätt storlek.

## 6. Tillgänglighet 82 → 95+

- Knappar utan tillgängligt namn: `aria-label` på ikonknappar.
- Bilder utan `alt`: sätt beskrivande alt, eller `alt=""` för dekorativa.
- Länkar utan igenkännligt namn i footer/sociala ikoner.
- För små tryckytor: minst 44×44 px på ikonknappar i mobilmenyn.

## 7. SEO 92 → 100

Samma alt-text-brist driver SEO-avdraget; åtgärdas i punkt 6.

## Teknisk not

Bildvarianter genereras i byggsteget med `vite-imagetools` (bundlade bilder) plus förkomprimerade WebP-filer för `public/`-bilderna. Supabase-transformationerna sker på URL-nivå, inga databasändringar. Inga ändringar i affärslogik, routing eller översättningar.

## Förväntat utfall

FCP och CLS är redan gröna. Med bildvikten borta och rätt LCP-element bör LCP falla från 30,3 s till ~2 s och Speed Index under 2 s, vilket ger 95-100 på mobil. Exakt 100 kan variera mellan mätningar eftersom Supabase-bilder ligger på tredjepartsdomän — jag rapporterar uppmätt resultat efter publicering.
