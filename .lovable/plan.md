# Det som saknas jämfört med Bitrix24 – bygg resten

Jämförelse mot er Bitrix24-meny (Flöde, Meddelanden, E-post, Kalender, Uppgifter, Disk, Anställda, Möten, Videokonferenser, Kommunikationscenter, MCP, CoPilot, Marknadsföra, BI-generator, Dokument, Automatisering, Projekt, Telefon, Aviseringar).

Finns redan: Flöde, Teamchatt (kanaler + direkt), E-post, Kalender, Uppgifter, Projekt, Dokumentarkiv, Automatiseringar, Säljrapporter, Kampanjer, AI-agenter (CoPilot), Composio-appar (motsvarar MCP), Notiser, Kundinkorg, Offerter/avtal, Tid & frånvaro, Kunskapsbank.

## Saknas – byggs nu
1. **Anställda** – personalkatalog: foto, roll, avdelning/kontor (Antalya, Dubai, Strasbourg, Bali), telefon, chef, status (på jobbet / ledig från Tid & frånvaro). Avdelningar och behörighet per säljare (säljare ser bara sina leads/affärer; chef ser allt).
2. **Videokonferenser & möten** – knapp "Starta videomöte" i chatt, på affärer och visningar; skapar en mötesrum-länk (Jitsi, gratis, ingen nyckel) som sparas i kalendern och kan skickas till kunden. Mötessida med kommande möten och anteckningar/protokoll som AI sammanfattar till uppgifter.
3. **Disk** – gemensam fillagring med mappar, uppladdning, delning internt och delningslänk med utgångstid (privat lagring).
4. **Kommunikationscenter / leadfördelning** – regler: nya leads fördelas rundgång eller per land/språk/källa till säljare; svarstidsmätning.
5. **Uppgiftschatt med AI** – varje uppgift får egen kommentarstråd; röstmeddelande eller chattext blir uppgift med beskrivning, checklista, deadline och ansvarig (som i Bitrix "AI-drivna uppgifter").
6. **BI-generator** – välj mått (leads, affärer, intäkt, källa, säljare, land) och period, få diagram + tabell, spara som egen rapport, exportera CSV.
7. **Bostadskatalog i offerter** – välj bostad och rumstyp direkt i offerten, pris fylls i automatiskt.
8. **Telefon** – klick-för-att-ringa och samtalslogg på leads (manuellt loggat samtal + utfall). Riktig molntelefoni kräver en leverantör (t.ex. Twilio) och konto – byggs inte nu.
9. **Mobil admin** – kan läggas till på hemskärmen som app.

## Byggs inte nu
- Instagram/Facebook i kundinkorgen och WhatsApp – väntar på att ni kopplar kontona.
- 3D-visning av bostäder – väntar på ert val av lösning.

## Test
Varje del testas inloggad som Batuhan: skapa, ändra, ladda om, ta bort testdata. Säljare-behörighet testas med ett säljarkonto mot ett chefskonto.

## Technical details
- Nya Cloud-tabeller med admin-RLS: departments, employee_profiles (roll, avdelning, chef, permission scope), drive_folders/drive_files (privat bucket crm-drive, signerade länkar), share_links, meetings (room_url, notes, summary), lead_routing_rules + routing state, task_comments, saved_reports.
- Leadfördelning i DB-trigger på leads insert; säljarbehörighet via SECURITY DEFINER-funktion i RLS på leads/deals.
- Möten: Jitsi meet.jit.si med slumpat rumsnamn, inbäddat i iframe.
- AI-uppgifter och mötessammanfattning via befintliga agent-servern (AI Gateway), röst via befintliga transkribering.
- PWA-manifest begränsat till /admin.
