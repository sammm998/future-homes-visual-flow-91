# Bitrix24-funktioner i admin

Fyra nya delar i adminpanelen, byggda på samma leads, uppgifter och team som redan finns. Allt syns bara för inloggade admins.

## 1. Säljtratt för affärer (CRM → Pipeline)
- Kanban-tavla med steg: Ny → Kontaktad → Visning bokad → Förhandling → Reservation → Vunnen / Förlorad.
- Varje kort: kund, bostad (REF), värde i EUR, ansvarig säljare, förväntat avslut.
- Dra kort mellan steg. Varje flytt sparas i historiken.
- Summering per steg (antal + totalvärde), filter på säljare och land.
- Skapa affär direkt från en lead.

## 2. Teamchatt och flöde
- Kanaler (t.ex. Allmänt, Antalya, Dubai) och direktmeddelanden, uppdateras direkt.
- Nyhetsflöde: inlägg med kommentarer och gilla; automatiska inlägg vid vunnen affär och ny lead.
- Kommentarer på affärer och leads.
- Olästa-markering i adminmenyn.

## 3. Kalender och visningar
- Delad kalender (månad/vecka/dag) med visningar, möten och samtal.
- Koppla till lead, affär och bostad; välj ansvarig.
- Filter per säljare, färg per typ.
- E-postpåminnelse till ansvarig (t.ex. 1 timme innan) och valfritt till kunden.

## 4. Automatiska regler
- Enkel regelbyggare: "När X händer → gör Y".
- Händelser: ny lead, affär byter steg, visning bokad, affär stilla i N dagar.
- Åtgärder: skapa uppgift, tilldela säljare, skicka e-post (mall), inlägg i flödet, flytta affär.
- Färdiga förval, t.ex. ny lead → uppgift "Ring inom 1 timme" till Batuhan + välkomstmejl.
- Logg över körda regler.

## Tekniska detaljer
- Nya tabeller: deals, deal_stage_history, chat_channels, chat_messages, feed_posts, feed_comments, calendar_events, automation_rules, automation_runs. Admin-only RLS via has_role, GRANTs.
- Realtime för chat_messages och feed_posts.
- Påminnelser och "stilla affär"-regler: en server route under /api/public/hooks/ körd var 15:e minut via managed schedule (96 körningar/dygn). Övriga regler körs direkt vid händelsen.
- E-post via befintlig Resend från info@futurehomesturkey.com.
- Nya sidor under /admin/crm/pipeline, /admin/chat, /admin/feed, /admin/calendar, /admin/automations + menyposter.
- Tester för stegordning och regelmatchning.

## Ingår inte nu
Videosamtal, telefoni, dokumentlagring, HR – kan läggas till senare.
