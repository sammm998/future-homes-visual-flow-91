# Kundportal "Mitt Future Homes"

En inloggad portal för köpare och investerare på `/portal` (alla 13 språk). Kunderna loggar in med samma konto som i VIP Club (e-post eller Google). Teamet svarar och hanterar allt från admin/CRM.

## Funktioner för kunden

1. **Översikt** – Status för köpet (t.ex. Visning → Reservation → Avtal → Betalning → Tillträde), nästa steg, kommande visning och kontaktuppgifter till den ansvariga säljaren.
2. **Ärenden** – Skapa ett ärende (fråga, visning, dokument, betalning, after sales, annat) och följ status: öppet, pågår eller löst.
3. **Meddelanden** – Chatta direkt med säljaren. Meddelandena hamnar i CRM-inkorgen.
4. **Mina avtal och dokument** – Se och ladda ner avtal, offerter, fakturor och dokument som teamet har delat. Signera via det befintliga e-signeringsflödet.
5. **Betalningar** – Fakturor och delbetalningar med status, förfallodatum och vad som återstår.
6. **Sparade bostäder och bevakningar** – Sparade bostäder (finns redan i VIP), jämförelse sida vid sida och Smart Property Alerts.
7. **AI-investeringsanalys** – Välj en sparad eller köpt bostad. AI:n räknar hyresavkastning, kostnader, avkastning över 5–10 år, risker och jämförelse med området, med hjälp av investeringskalkylatorns marknadsdata. Analysen sparas.
8. **AI-assistent** – Kunden kan fråga om sina egna bostäder, avtal, köpprocessen, medborgarskap och avgifter. Assistenten kan skapa ärenden åt kunden och svarar på kundens språk.
9. **Visningar** – Boka en visning eller ett videomöte och se de bokningar som finns.
10. **Profil** – Kontaktuppgifter, språk, budget och önskemål. Detta fylls automatiskt i kundkortet i CRM.

## I admin

- Ny sida "Kundportal": ärenden med status och ansvarig, svar på meddelanden och en knapp för att dela dokument eller fakturor med en kund.
- På kundkortet syns portalstatus, så man ser om kunden har konto och när den senast loggade in.
- Notiser och mejl till säljaren vid nytt ärende eller meddelande. Kunden får mejl när teamet svarar.

## Säkerhet

- Kunden ser bara sitt eget. Dokument och fakturor visas bara när teamet har delat dem. Kopplingen till kunden sker via kontots verifierade e-post, som måste matcha kundkortet.
- Filer öppnas bara via tillfälliga länkar.
- AI:n körs på servern och ser bara den inloggade kundens data.

## Tekniska detaljer

- Routes: `src/routes/portal/*` under en klientskyddad layout och `/$locale/portal`. Texterna ligger i `src/content/portalCopy.ts` plus en i18n-JSON-fil.
- Nya tabeller med RLS `auth.uid() = user_id`: `customer_accounts` (user_id, lead_id, verifierad e-post), `support_tickets`, `ticket_messages`, `portal_messages`, `investment_analyses`, `shared_items` (document/quote/invoice/signature → user). `documents`, `invoices`, `quotes` och `signature_requests` får kund-SELECT-policyer via `shared_items`. Admin behåller sina policyer.
- Kontolänk: en security definer-funktion kopplar `auth.users.email` till `leads.email` vid första inloggningen. Länken skapas alltid på servern och aldrig från klientdata.
- AI: server functions med `requireSupabaseAuth` och AI Gateway (Claude Sonnet för analys och assistent). Verktygen är bara läs-verktyg för den egna datan plus "skapa ärende". Analysen använder `MARKETS` i `investmentCalc.ts`.
- Meddelanden speglas till CRM-inkorgen via en trigger. Mejl går via den befintliga workspace-jobs-hooken.
- Tester: RLS-isolering mellan två kunder, kontolänk via e-post och avkastningsberäkning.
