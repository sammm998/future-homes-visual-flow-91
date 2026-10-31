# Roadmap

## Homepage speed
- [x] Rechecked homepage/search speed; shared catalog now uses explicit fields (about 190 KB less uncompressed). Live Indonesian homepage FCP/LCP 1.75 s, response starts at 1.35 s in one desktop browser sample; local home → visible Antalya cards 4.58 s including scroll/screenshot overhead, so sub-second navigation is not verified. Correct REF 3019 two-bedroom price verified in all 13 languages, 21 tests pass, no browser errors. No instance change or publication; live improvement remains unmeasured.
- [x] Destination intent prefetch, smaller city payloads, shared cached source/translation reads; removed duplicate card navigation and forced scroll resets, pagination persisted in URL. Home → Antalya measured 2.53 s locally; back button restored page 2, same card and scroll 850; all six destinations and 13 language bedroom prices checked, 20 tests passed. Not a guarantee of sub-second cold loads; live comparison requires publishing.
- [x] Reduce offscreen video work and scroll-triggered form downloads; Before & After reduced 13.84 MB → 2.57 MB, destination images 1.02 MB → 0.44 MB, offscreen section rendering deferred. All 13 homepage locales, Antalya results, 17 regression tests and build checked. Visibility pause verified using a temporary WebM test source because sandbox Chromium cannot decode H264; published speed measurement still requires publishing.

## Reported search and customer-photo issues
- [x] Keep search position stable for same-page filter changes; bedrooms, type, minimum/maximum price stayed at scroll 600, filters survived reload, no runtime errors, 14 focused tests passed.
- [x] Restore Mr. Edward's review/photo from old CMS to current Cloud; photo verified in public testimonials. Old CMS remains separate; future edits there do not sync automatically.
- [x] Match listing prices, price sorting/filtering and linked detail prices to selected bedrooms; REF 3019 shows €95,000 for 2 beds in all 13 languages, with 15 regression tests passing.
- [x] Correct district options, spelling normalization and deselection; Mersin Erdemli → All verified with bedroom selection preserved, no browser errors.

- [x] Minska startsidans FCP/LCP: AVIF-varianter (480 px 14 KB, 768 px 30 KB), delade preload/bildkandidater, rubrik utan fade, sökformulär/video senare efter sidladdning. Verifierat spanska och engelska på 390/1280 px, inga nya runtimefel, REF 1474-sökning, 3 språktester och build OK. Lokal LCP på /es 1,83 → 1,37 s (inte jämförbart med PageSpeed-produktion); ny PageSpeed-mätning kräver publicering.
- [x] Slutför alla saknade/felaktiga bostadsöversättningar — 281 översättningar sparade i Lovable Cloud; nya bostäder sparas dit automatiskt vid sparning i admin
- [x] Kontrollera språk från Google, rätta språkväxling samt engelska kart-/prisrubriker på samtliga 13 språk; verifierat alla språk på REF 1415, indonesiska/urdu/franska Google-länkar, bilder och språkbyten utan runtimefel (11 tester godkända).
- [x] Rätta sparad engelsk indonesisk titel/beskrivning för REF 1415 och övriga felaktiga bostadstexter — löst via översättningar i Lovable Cloud.
- [x] Bekräfta att REF 1474–1479 helt saknar översättningar; testa spansk översättning av REF 1474, lägg massrättningen i aktuella bostadsadministrationen, avvisa kopierade engelska stycken och bevara misslyckad källändringsrättning för återförsök (8 tester godkända).
- [x] Spara översättningarna för REF 1474–1479 och verifiera bostadssidorna — klart via Lovable Cloud.
- [x] Granska lagrade översättningar för 294 bostäder på 13 språk; rätta språkbyten, engelska enhetstyper, kontroll av engelska kopior och fullständig sidindelning i administratörens översättningsverktyg.
- [x] Kör rättning av samtliga saknade/felaktiga bostadsöversättningar och verifiera en verklig uppladdning — klart via Lovable Cloud; nya bostäder sparas dit vid admin-sparning.

- [x] Kundvideo: ortsavgränsad sökning, återanvända data, scrollbar filterpanel och referensnummer/sortering högst upp; startsida → Antalya → scroll → prissortering → REF 1474 verifierat utan runtimefel.

- [x] Trigga översättning efter sparande, verifiera lagrade språk och testa återupptagning samt felstopp.
- [x] Översätt Antalya REF 1475 och 1474 samt kontrollera en verklig uppladdning — klart via Lovable Cloud.

- [x] Slå ihop kundomdömen till en sektion med innehåll vänster och rullande recensioner höger.
- [x] Förfina 3D-bostaden till en färdig, modern och detaljerat möblerad miljö.
- [x] Lägg till en knapp för att gå in i 3D-miljön med förstapersonsvy.
- [x] Kontrollera båda upplevelserna på dator och mobil.
- [x] Modernisera Easy Find i samma exklusiva stil som startsidan.
- [x] Modernisera övriga publika informations-, kontakt-, artikel- och bostadslistningssidor.
- [x] Säkerställ en sammanhållen upplevelse på alla språk, dator och mobil.
- [x] Lufta upp bostadslistningarna med rymligare filter och större tvåkolumnskort.
- [x] Rätta Bali-markörerna så de använder bostadens plats i stället för kartans visningscentrum.
- [x] Ersätt den felaktiga adressrubriken i sidfoten med tydliga kontorsorter.
- [x] Ge startsidan en lyxigare Gallery Estate-komposition och förfina sidomenyn.
- [x] Designa om kartsökningen med filter och bostadslista till vänster samt karta till höger.
- [x] Matcha kartsökningen mot referensens horisontella filter, luftiga lista och rundade karta.
- [x] Ge välkomstpopupen ny lyxig design, rätta språk/valuta i navigationslisten och behåll kontaktbannern.
- [x] Ersätt den fasta vänsterlisten med en exklusiv toppmeny och en meny som öppnas från höger.
- [x] Designa om About Us-sidan i startsidens editoriala stil med kontorsstråk och team.
- [x] Uppdatera Om oss med Bali och fyra marknader i text och statistik.
- [x] Rätta informationssidans artikelkategorier så varje filter visar rätt ämnen.

- [x] Fas 1: Investeringskalkylator, "Where Should I Buy?"-test och visningsresa-planerare (sparar leads).
- [x] Fas 2: VIP Club med favoriter, Smart Property Alerts (e-post) och förhandslanseringar.
- [ ] WhatsApp-utskick för alerts — väntar på att Twilio kopplas och ett WhatsApp-godkänt avsändarnummer.
- [x] Fas 3: Partnerprogram med egen länk, portal och admin (3 % standardprovision).
- [ ] Ge Ali/teamet adminroll i VIP-admin — väntar på att de skapar ett konto på /vip.
- [ ] Översätt de nya verktygen till alla 13 språk.
- [x] Fylla kontaktsektionens "Our Locations" på startsidan med alla fem kontor (Antalya, Mersin, Dubai, Strasbourg, Bali) på alla 13 språk.

## Flytt till Lovable Cloud
- [x] Tabeller, data (294 bostäder, 3446 översättningar, 1602 bloggar, omdömen, team, sidinnehåll) och sajten läser från Cloud
- [x] Leads, nyhetsbrev, statistik och adminpanelen sparar i Cloud
- [ ] Admin-konton — väntar på att Samin/teamet skapar konto på /vip så jag kan ge adminbehörighet
- [ ] Gamla leads/CRM — väntar på CSV-export från den gamla adminpanelen
- [ ] Kopiera gamla bilder — de fungerar från gamla lagringen; kräver att publika bildmappar tillåts i arbetsytans inställningar för att flyttas
