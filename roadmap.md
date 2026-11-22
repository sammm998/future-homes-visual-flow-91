# Roadmap – CRM + AI agents

## Done
- [x] Agents chat (assistant + marketing, sales, admin, service, analytics) with approvals
- [x] Composio integrations page, per-admin connections, agent app categories
- [x] Projects (tasks, dependencies, checklist, timeline, time tracking)
- [x] Knowledge base, time & absence, companies (duplicates/merge), approvals, notifications bell

- [x] Employees, Drive, task chats with AI, BI builder, call log

## Open
- [x] Lead distribution rules (contact center)
- [x] Property catalogue picker inside quotes
- [x] Departments/offices structure and per-seller permissions
- [x] Video meeting button on deals/viewings
- [x] Installable mobile admin (home-screen icon)
- [ ] Instagram/Facebook messages into the customer inbox
- [ ] WhatsApp — waits on the user approving the WhatsApp connection
- [x] 3D view of properties — AI photo analysis + real facade photos on the model (see 3D-vy below)

## SEO och hastighet (alla 13 språk)
- [x] SEO-granskning av 34 publika sidor × 13 språk: rättade canonical som pekade på engelska (12 språkversioner av landningssidorna), saknade canonical/hreflang på 10 sidor, dubbla titlar/beskrivningar, saknade H1, felaktig domän i strukturerad data, sidor som server-renderade bara "Loading…", react-helmet-taggar som Google aldrig såg och artiklar utan hreflang. Översatta titlar/beskrivningar för 12 sidor på alla språk, hreflang mellan svenska/norska/danska landningssidor, stads-landningssidor kanoniska på engelska, saknade sidor i sitemap, noindex på tacksidor. Lokal kontroll: 0 fel kvar (titel, beskrivning, canonical, 14 hreflang, en H1, rätt lang). Sidor vars text kommer från databasen kunde inte kontrolleras här.
- [x] Hastighet: Supabase-SDK (~56 kB gzip) och alla språks SEO-texter/sidtexter borta från första laddningen, AVIF-herobilder (t.ex. 158 kB → 9–22 kB), lata bilder längre ned, egna typsnitt i stället för Google Fonts. Lokal mobilmätning (4× CPU, långsam 4G): /property-for-sale-in-turkey LCP 5,8 → 1,4 s, /sv/antalya 2,8 → 1,4 s, startsidan 1,8 → 1,5 s. Live-effekt (PageSpeed/Search Console) kräver publicering.
- [x] Hastighet del 2: listbilder storleksanpassas i /api/public/media (?w=), bostadssidan visar riktig förhandsvisning direkt från servern (tidsgräns 2,5 s mot databasen), bekvämlighetsöversättningar/sid-meta per språk, toasters och områdesanalys laddas senare, portal- och stadslandningsdata ur första laddningen. Lokal mobilmätning: initial JS startsida 236 → 199 kB gzip, bostadssida 263 → 210 kB, TBT startsida 353 → ~170 ms, LCP ~1,2–1,4 s på testade sidor. Bildstorleksanpassningen kunde inte provas mot Storage härifrån.
- [x] 3D-vy: rikare AI-beskrivning (typ, form, podium, material, fönster, räcken, tak, miljö) och riktiga fasadfoton uträtade på modellen; ny renderare med himmel, skuggor, glas, balkonger, pergola, pool, palmer och omgivning; massgenerering i bostadslistan. Visuellt testad med projektbilder; AI-genereringen kräver publicering (AI Gateway) och körs från admin.
