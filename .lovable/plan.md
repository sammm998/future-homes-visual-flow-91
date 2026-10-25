# Flytta allt till den nya databasen

## Vad som flyttas
Jag kan läsa och kopiera allt publikt innehåll från den gamla databasen:
- 294 bostäder med alla fält, priser och bildlänkar, plus 3 446 översättningar
- 1 602 bloggartiklar, 68 kundomdömen med 806 översättningar, 10 teammedlemmar
- Innehåll för Om oss och startsidan, sidtexter, kurser (Academy) och media

Bilderna kopieras till den nya bildlagringen så att inget ligger kvar i den gamla.

## Det som inte går att kopiera automatiskt
- **Leads, kontakter, uppgifter och CRM-anteckningar** är skyddade. Jag ser dem som tomma, så de måste exporteras från den gamla adminpanelen (CSV) och laddas upp här. Annars börjar CRM:et om från noll.
- **Admin-inloggningar** kan inte flyttas, eftersom lösenord inte kan kopieras. Du och teamet skapar nya konton och jag ger dem adminbehörighet.

## Steg
1. Skapa tabeller för bostäder, översättningar, blogg, omdömen, team och sidinnehåll. Besökare får läsa, och bara admins får ändra.
2. Kopiera all data och alla bilder och kontrollera sedan antalen: 294 bostäder, 3 446 + 282 översättningar osv.
3. Låt sajten (bostadssidor, sök, karta, AI-sök, blogg, Om oss, sitemaps) läsa från den nya databasen.
4. Låt adminpanelen (lägga upp och redigera bostäder, översättningar, team, blogg) spara i den nya databasen med ny inloggning. Översättning till alla språk sker automatiskt vid sparning.
5. Formulär och leads sparas i den nya databasen och visas i admin.
6. Testa: se en bostad på flera språk, lägg upp en testbostad, skicka ett formulär och kontrollera att det dyker upp i admin.

## Risker
- Det här är ett stort arbete (cirka 100 filer berörs) och görs i flera omgångar.
- Under tiden fortsätter den gamla adminpanelen att fungera. Bostäder som läggs upp där efter kopieringen måste kopieras igen innan bytet, så det bästa är att inte lägga upp nya bostäder under flytten.
- Inget ändras på den riktiga sajten förrän du publicerar.

## Teknisk sammanfattning
- Nya public-tabeller med GRANT och RLS: läsning för anon, skrivning via has_role(admin). Behåll gamla ID:n och ref_no så att alla länkar och URL:er fungerar som förut.
- Engångsskript för kopieringen (sidvis läsning från den gamla databasen, insert via databasverktygen). Bilderna går till en publik storage-bucket och URL:erna skrivs om.
- Byt src/integrations/legacy/client.ts-anrop mot Cloud-klienten, modul för modul. Den gamla klienten behålls bara tills allt är verifierat.
- Uppdatera AGENTS.md-regeln om databasägarskap.
