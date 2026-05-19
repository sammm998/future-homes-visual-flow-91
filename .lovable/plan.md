# Courses-sektion: Fastighetsinvestering per land

En ny pedagogisk del av sajten där besökare kan gå kurser om att investera i fastigheter i varje land vi täcker (Turkiet, Dubai, Cypern, Bali, Indonesien, Sverige-perspektiv). Varje kurs är uppdelad i moduler (lektioner) med text + bild, följt av quiz som måste klaras innan nästa modul låses upp. Framsteg sparas lokalt (localStorage) så ingen inloggning krävs i v1.

## Sidor & navigation

- Ny länk **"Courses"** i huvudmenyn (Header) bredvid Information.
- `/courses` — översikt: en kort intro + 6 landskort (flagga, titel, antal moduler, svårighetsgrad, "Starta kurs").
- `/courses/:country` — kursöversikt för ett land: beskrivning, modul-lista med låsta/upplåsta steg, total progress-bar, ev. slutcertifikat.
- `/courses/:country/:moduleSlug` — själva lektionen: innehåll, bild, "Markera som läst" → quiz → resultat → "Nästa modul".

## Innehållsstruktur (per land)

Varje kurs har ~6 moduler i en pedagogisk ordning:
1. Marknadsöversikt & varför just det här landet
2. Juridik & ägande för utlänningar
3. Skatter, avgifter & löpande kostnader
4. Finansiering & valuta
5. Köpprocess steg-för-steg
6. Hyresavkastning, exit & vanliga misstag

Varje modul innehåller:
- 400–800 ord pedagogisk text (HTML)
- 1 illustrationsbild (genereras med imagegen)
- "Viktigt att komma ihåg"-box (3–5 punkter)
- Quiz med 3–5 flervalsfrågor, godkänd vid ≥70%

## Datalagring

Kursinnehållet sparas i en ny tabell `courses_content` i Supabase så det blir översättningsbart i framtiden och kan editeras utan deploy. Schema:

```
courses (id, country_code, slug, title, description, order_index, language_code)
course_modules (id, course_id, slug, title, body_html, image_url, order_index, key_takeaways jsonb)
course_quizzes (id, module_id, questions jsonb)  -- questions: [{q, options[], correctIndex, explanation}]
```

Publik läsåtkomst (RLS: SELECT true), endast admin skriver.

User-progress sparas i `localStorage` under nyckeln `fh_course_progress` som `{ [country]: { completedModules: string[], quizScores: {moduleSlug: number} } }`. Ingen DB-skrivning i v1 — håller det enkelt och snabbt.

## UI/komponenter

Återanvänder befintligt designsystem (semantic tokens, shadcn). Nya komponenter:
- `CountryCourseCard` (översikt)
- `ModuleListItem` (med lås-ikon + checkmark)
- `LessonReader` (prose-stilad text + bild + key takeaways)
- `Quiz` (en fråga i taget, direkt feedback, slutresultat)
- `ProgressBar` (återanvänd shadcn Progress)
- `CourseCompleteBadge` (visas när alla moduler klarade)

## Översättning

V1 levereras på engelska för kursinnehåll (samma fallback-strategi som artiklarna: visa EN om översättning saknas). UI-strängar ("Start course", "Next module", "Pass quiz" osv.) läggs i `translations.ts` för alla 13 språk. Översättning av kursinnehållet kan göras senare via samma Gemini-pipeline som blog_posts.

## Teknisk plan (steg)

1. **Migration**: skapa tabellerna ovan + RLS-policies + seed-data för Turkiet som första komplett exempel (6 moduler × ~5 quizfrågor).
2. **Imagegen**: generera 6 illustrationer för Turkiet-kursen (modul-hero), spara under `public/courses/turkey/`.
3. **Routing**: lägg till de 3 nya routes i `App.tsx`.
4. **Hooks**: `useCourses()`, `useCourse(country)`, `useCourseProgress(country)`.
5. **Sidor**: `CoursesIndex.tsx`, `CourseOverview.tsx`, `CourseLesson.tsx`.
6. **Komponenter**: enligt listan ovan i `src/components/courses/`.
7. **Header**: lägg till "Courses"-länk i `Header.tsx` (desktop + mobil) + översättningsnyckel.
8. **Innehåll för övriga länder**: seedas i samma migration som platshållare (intro + 2 moduler), med "Coming soon" på låsta moduler — så funktionen ser komplett ut direkt utan att vi skriver 36 moduler i en omgång.

## Vad jag levererar i denna runda

För att hålla scope hanterbart föreslår jag att första leveransen innehåller:
- Komplett funktionalitet (DB, routing, sidor, komponenter, progress, quiz, certifikat-badge, meny)
- **Turkiet-kursen helt klar** (6 moduler + quiz + bilder) som referensimplementation
- Övriga 5 länder synliga i översikten med "Coming soon"-status

Sedan kan jag i nästa runda fylla på Dubai, Cypern, Bali osv. ett land i taget. Säger du till så kör jag igång.