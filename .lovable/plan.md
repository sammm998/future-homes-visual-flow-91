# Komplett CRM för Future Homes + AI-agenter med Composio

Bitrix24 har hundratals funktioner. Admin har redan: leads, kontakter, uppgifter, pipeline, kundinkorg, offerter/fakturor/e-signering, rapporter, dokumentarkiv, kalender, teamchatt, flöde, automationer, e-postkampanjer, presentationer, kontorsverktyg, analys och SEO. Planen fyller resten i fem steg, och varje steg testas inloggad som admin innan nästa börjar.

## Steg 1 – AI-agenter i en gemensam chatt (det viktigaste)
- Ny sida **Agenter** i adminmenyn: en chatt där alla agenter finns.
- **Huvudagent ("Future Homes Assistant")** som kan allt i admin och delar ut uppgifter till specialisterna.
- Specialistagenter, var och en med sitt ansvar:
  - **Marknadsföring** – bloggar, sociala inlägg, kampanjer, annonstexter.
  - **Försäljning & offert** – skapa affärer, offerter, fakturor, signeringslänkar, uppföljning.
  - **Admin & bostäder** – lägga in/ändra bostäder, översättningar, kalender, uppgifter.
  - **Kundservice** – svara i kundinkorgen, kvalificera leads.
  - **Analys** – rapporter, KPI:er, prognoser.
- Välj agent med @namn eller låt huvudagenten välja. Samtal sparas per användare.
- Ändringar som skickar, raderar eller betalar kräver att ni klickar **Godkänn** först.

## Steg 2 – Composio: koppla alla appar per konto
- Varje admin kopplar sina egna appar (Gmail, Google Kalender, Instagram, Facebook, LinkedIn, Slack, Google Drive, HubSpot m.fl.) från en sida **Integrationer**.
- Agenterna använder bara de appar som just den personen har kopplat.
- Varje agent har sina app-kategorier (t.ex. Marknadsföring → sociala medier och annonser; Offert → e-post, Drive, e-signering).
- Ni behöver ett Composio-konto; jag ber om er Composio-nyckel i ett säkert fält när bygget börjar.

## Steg 3 – Saknade Bitrix24-delar i CRM
- **Projekt och uppgifter**: projekt med delmoment, beroenden, Gantt-tidslinje, tidrapportering, checklistor.
- **Kunskapsbank (wiki)**: rutiner och säljmanus som agenterna också kan läsa.
- **Arbetstid och frånvaro**: in-/utstämpling, semester- och ledighetsansökan med godkännande.
- **Företagsstruktur**: avdelningar, kontor (Antalya, Dubai, Strasbourg, Bali), roller och behörighet per säljare.
- **Kontaktcenter**: formulär- och webbchattens leads direkt till rätt säljare med fördelningsregler.
- **Produktkatalog i CRM**: bostäder som produkter i offerter, med enheter och priser.
- **Företag (bolagskunder)** kopplade till kontakter och affärer, dubblettkontroll och sammanslagning.
- **Godkännandeflöden**: rabatter och avtal över en gräns kräver chefens godkännande.
- **Notiser**: klockan i admin + webbläsarnotiser för nya leads, meddelanden och påminnelser.
- **Videomöten**: starta ett videomöte från en affär eller visning (länk via kopplad app, t.ex. Google Meet/Zoom via Composio).
- **Mobilvänlig admin** som kan läggas på hemskärmen (app-ikon).

## Steg 4 – Kanaler
- WhatsApp kopplas när ni godkänner kopplingskortet.
- Instagram och Facebook-meddelanden in i kundinkorgen via Composio.

## Steg 5 – Helhetstest
- Varje funktion körs från början till slut inloggad som admin: skapa, ändra, ladda om, kontrollera, radera testdata.
- Agenterna testas med riktiga uppdrag (t.ex. "skapa offert för REF 1479 till kund X").
- Kort rapport över vad som fungerar och vad som kräver något från er (nycklar, kopplingar, publicering).

## Det som inte går att bygga exakt som Bitrix24
- Egen telefonväxel med inspelade samtal kräver en telefonileverantör (t.ex. Twilio) – kan läggas till senare.
- Webbplatsbyggare och webbutik behövs inte, ni har er egen sajt.

## Tekniska detaljer
- Agenter: server-side via Lovable AI Gateway med verktygsanrop mot befintliga Cloud-tabeller (requireSupabaseAuth, admin-RLS). Destruktiva verktyg kräver bekräftelse i UI.
- Composio Platform: COMPOSIO_API_KEY som secret, sessions per admin-user-id, Connect Links för OAuth, toolkit-filter per agent. Verktygsanrop endast server-side.
- Nya tabeller (admin-RLS + GRANTs): agent_conversations, agent_messages, agent_actions, composio_connections, projects, project_tasks, time_entries, wiki_pages, absences, departments, companies, approvals, notifications, distribution_rules.
- Nya sidor under /admin/agents, /admin/integrations, /admin/projects, /admin/wiki, /admin/time, /admin/company, /admin/approvals.
- Tester för agentbehörighet, fördelningsregler, godkännandegränser och tidrapportering.
