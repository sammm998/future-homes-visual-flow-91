# Roadmap – CRM + AI agents

## Done
- [x] Agents chat (assistant + marketing, sales, admin, service, analytics) with approvals
- [x] Composio integrations page, per-admin connections, agent app categories
- [x] Projects (tasks, dependencies, checklist, timeline, time tracking)
- [x] Knowledge base, time & absence, companies (duplicates/merge), approvals, notifications bell

## SEO och hastighet (alla 13 språk)
- [x] SEO-granskning av 34 publika sidor × 13 språk: rättade canonical som pekade på engelska (12 språkversioner av landningssidorna), saknade canonical/hreflang på 10 sidor, dubbla titlar/beskrivningar, saknade H1, felaktig domän i strukturerad data, sidor som server-renderade bara "Loading…", react-helmet-taggar som Google aldrig såg och artiklar utan hreflang. Översatta titlar/beskrivningar för 12 sidor på alla språk, hreflang mellan svenska/norska/danska landningssidor, stads-landningssidor kanoniska på engelska, saknade sidor i sitemap, noindex på tacksidor. Lokal kontroll: 0 fel kvar (titel, beskrivning, canonical, 14 hreflang, en H1, rätt lang). Sidor vars text kommer från databasen kunde inte kontrolleras här.
- [x] Hastighet: Supabase-SDK (~56 kB gzip) och alla språks SEO-texter/sidtexter borta från första laddningen, AVIF-herobilder (t.ex. 158 kB → 9–22 kB), lata bilder längre ned, egna typsnitt i stället för Google Fonts. Lokal mobilmätning (4× CPU, långsam 4G): /property-for-sale-in-turkey LCP 5,8 → 1,4 s, /sv/antalya 2,8 → 1,4 s, startsidan 1,8 → 1,5 s. Live-effekt (PageSpeed/Search Console) kräver publicering.

- [x] Employees, Drive, task chats with AI, BI builder, call log

## Open
- [x] Lead distribution rules (contact center)
- [x] Property catalogue picker inside quotes
- [x] Departments/offices structure and per-seller permissions
- [x] Video meeting button on deals/viewings
- [x] Installable mobile admin (home-screen icon)
- [ ] Instagram/Facebook messages into the customer inbox
- [ ] WhatsApp — waits on the user approving the WhatsApp connection
- [ ] 3D view of properties — waits on the user's choice of approach
