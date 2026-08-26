# Full SEO-genomgång: alla sidor, städer och bostäder

## Utgångsläge

De senaste SEO-skanningarna är gamla (8 aug) och gjordes före flera ändringar, så deras resultat kan inte tas som dagens sanning. Kvarvarande punkter från den skanningen som fortfarande är rimliga att åtgärda:

- Titlar och beskrivningar som är för långa (startsidan ~78 tecken titel, beskrivningar 167/172 tecken) på hem- och stadssidor.
- Ikonknappar och sociala länkar saknar tillgängliga namn (meny, galleri, sociala ikoner).
- Google Search Console är inte kopplat, så sitemap-status och indexeringsdata saknas.

## Vad jag gör

1. **Metadata-kvalitet på alla språk**
   - Går igenom `src/utils/seoMetaTranslations.ts` för alla 13 språk och 19+ sidnycklar.
   - Kortar titlar till under 60 tecken och beskrivningar till 140–160 tecken, med primärt sökord först.
   - Kontrollerar att varje sida har unik titel/description, inga dubbletter mellan städer och språk.

2. **Bostadssidor (property detail)**
   - Verifierar att serverladdad titel/description är översatt, unik per objekt och innehåller stad + typ + REF.
   - Kontrollerar självrefererande canonical och `og:url` per språkprefix, samt hreflang-alternativ för alla 13 språk.
   - Kontrollerar JSON-LD (`RealEstateListing`) mot faktiska fält: pris, valuta, yta i m², sovrum, badrum, bilder.

3. **Sitemap och robots**
   - Går igenom `src/lib/sitemapData.ts`, `/sitemap.xml` (index) och `/sitemap.$locale.xml`: att alla publika rutter och alla aktiva bostäder finns med, per språk, med korrekta `xhtml:link`-hreflang.
   - Tar bort `lastmod` som härleds från byggtid/dagens datum.
   - Kontrollerar att robots.txt inte blockerar något indexerbart och att Sitemap-direktivet pekar rätt.

4. **Sidstruktur och innehåll**
   - Kontroll av exakt en H1 per sida, vettig H2-struktur, alt-texter på bilder (inkl. bostadsgallerier).
   - Interna länkar: att stads-, kategori- och nordiska landningssidor länkas korrekt och att inga länkar är trasiga.

5. **Tillgänglighet som påverkar SEO-poäng**
   - Lägger till `aria-label` på menyknapp, sociala länkar i `Navigation.tsx`, galleriknappar i `PropertyDetail.tsx` och knapparna i `AIPropertySearch.tsx`.

6. **Ny skanning**
   - Kör en färsk SEO-skanning i slutet och markerar åtgärdade fynd, så resultatet i SEO-fliken speglar dagens kod.

## Utanför denna omgång (säg till om du vill ha med det)

- Google Search Console-koppling och verifiering (kräver att du godkänner en OAuth-anslutning).
- Nytt innehåll/nya landningssidor eller ny sökordsanalys — detta är en teknisk korrekthetsgenomgång.

## Tekniska detaljer

Berörda filer: `src/utils/seoMetaTranslations.ts`, `src/components/SEOHead.tsx`, `src/pages/PropertyDetail.tsx`, `src/lib/propertySeo.functions.ts`, `src/utils/propertySeoSchema.ts`, `src/lib/sitemapData.ts`, `src/routes/sitemap[.]xml.ts`, `src/routes/sitemap.$locale[.]xml.ts`, `public/robots.txt`, `src/components/Navigation.tsx`, `src/pages/AIPropertySearch.tsx`.
