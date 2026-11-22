# Fyra nya admindelar (Bitrix24, steg 2)

## 1. Samlad kundinkorg (/admin/inbox)
- En lista med alla konversationer, och ett meddelandefönster bredvid.
- Varje konversation kopplas till en lead. Okända avsändare blir automatiskt en ny lead med källa "WhatsApp" eller "E-post".
- Ni kan svara direkt från admin, tilldela en säljare, markera som klar och se olästa.
- **WhatsApp:** kopplas via WhatsApp Business-anslutningen. Ni godkänner kopplingen med ett kort i chatten. Inkommande och utgående meddelanden sparas, med leveransstatus.
- **E-post:** utgående svar skickas från info@futurehomesturkey.com. Inkommande mejl kräver att en vidarebefordringsadress sätts upp och byggs i ett senare steg.
- **Instagram och Facebook:** det finns ingen färdig koppling i dag. Ytorna förbereds så att de kan läggas till senare.

## 2. Offerter och avtal (/admin/quotes)
- Skapa en offert från en affär. Bostad (REF), lägenhetstyp, pris, rabatt, betalplan och giltighetstid fylls i.
- Snygg pdf i Midnight Riviera-stil. Den kan laddas ner eller mejlas till kunden.
- Fakturor med nummerserie, status (utkast, skickad, betald, förfallen) och delbetalningar.
- **E-signering:** kunden får en säker länk till avtalet (till exempel ett reservationsavtal). Där skriver kunden sitt namn och ritar sin signatur. Tidpunkt och IP-adress loggas, och den signerade pdf:en sparas på affären. Det är en enkel elektronisk signatur, inte BankID.

## 3. Säljrapporter och KPI:er (/admin/reports)
- Försäljning och pipelinevärde per säljare, land och månad.
- Konvertering mellan pipeline-stegen, svarstid på nya leads och antal visningar per säljare.
- Prognos som väger öppna affärer efter steg.
- Filter för datumintervall och säljare, plus export till CSV.

## 4. Dokumentarkiv (/admin/documents)
- Privata mappar per kund (lead/affär) och per bostad (REF), till exempel för kontrakt, pass och planritningar.
- Ladda upp genom att dra och släppa, förhandsgranska, byta namn, ta bort och lägga till taggar.
- Dokumenten syns också direkt på lead-, affärs- och bostadssidan.
- Bara admin kommer åt filerna.

## Tekniska detaljer
- Nya tabeller: inbox_conversations, inbox_messages, whatsapp_webhook_events, quotes, quote_items, invoices, invoice_payments, signature_requests, documents. Alla får behörighet för enbart admin via has_role och GRANTs. Undantaget är en signeringstoken som läses via en server-route.
- WhatsApp: mottagaren ligger på POST /api/public/whatsapp/webhook, verifieras med @lovable.dev/webhooks-js och använder en varaktig inkorg. Utskick sker via connector gateway från server-funktioner.
- Pdf skapas i webbläsaren med pdf-lib, i Worker-kompatibel kod.
- Lagring sker i en privat bucket "crm-documents". Filer visas via signerade URL:er.
- Signeringssidan /sign/$token sparar via /api/public/sign, som validerar token och utgångstid.
- Rapporterna räknas i SQL-funktioner med security definer och admin-kontroll.
- Menyposter läggs till i AdminSidebar och texter på turkiska och indonesiska. Tester skrivs för offertsummor, fakturanummer, prognosvikter och token-giltighet.
