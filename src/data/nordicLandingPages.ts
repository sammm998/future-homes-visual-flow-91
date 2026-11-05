/**
 * Dedicated Nordic (sv/no/da) keyword landing pages.
 * Built from Semrush keyword research: low difficulty (KD 0-13), buyer intent.
 * Each page targets one primary keyword and 2-4 secondary keywords.
 */

export interface NordicFaq {
  question: string;
  answer: string;
}

export interface NordicLandingPage {
  /** Locale prefix this page exists under (sv | no | da) */
  locale: "sv" | "no" | "da";
  /** URL slug without locale prefix */
  slug: string;
  /** Location keyword used to pick related listings */
  locationFilter: string;
  primaryKeyword: string;
  keywords: string[];
  title: string;
  description: string;
  h1: string;
  heroSubtitle: string;
  intro: string[];
  highlights: { title: string; text: string }[];
  sections: { heading: string; body: string }[];
  faq: NordicFaq[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  listingsTitle: string;
  listingsCta: string;
  /** Locale-free path of the main listing page for this destination */
  listingsPath: string;
  relatedLabel: string;
}

export const NORDIC_LANDING_PAGES: NordicLandingPage[] = [
  /* ---------------------------------- SV ---------------------------------- */
  {
    locale: "sv",
    slug: "kopa-lagenhet-turkiet",
    locationFilter: "turkey",
    primaryKeyword: "köpa lägenhet i turkiet",
    keywords: [
      "köpa lägenhet i turkiet",
      "lägenhet till salu turkiet",
      "hus till salu turkiet",
      "bostad turkiet pris",
      "köpa hus i turkiet som svensk",
    ],
    title: "Köpa Lägenhet i Turkiet 2026 | Priser & Guide",
    description:
      "Köpa lägenhet i Turkiet från 75 000 €. Svensktalande mäklare, trygg process, uppehållstillstånd och hyresavkastning på 6–8 % i Alanya och Antalya.",
    h1: "Köpa lägenhet i Turkiet – priser, process och trygg affär",
    heroSubtitle:
      "Nybyggda lägenheter vid Medelhavet med svensk rådgivning från start till lagfart.",
    intro: [
      "Att köpa lägenhet i Turkiet är fortfarande ett av Europas mest prisvärda sätt att skaffa en bostad vid havet. Priserna startar runt 75 000 € för en modern tvårumslägenhet i Alanya, medan ett strandnära treursbygge i Antalya oftast landar mellan 150 000 och 250 000 €. Jämfört med Spanien och Portugal får du 30–50 procent mer boyta för samma pengar, plus lägre driftskostnader och fastighetsskatt.",
      "Future Homes International har hjälpt nordiska köpare sedan 2004 och har egna kontor i Antalya, Alanya, Mersin, Dubai och Bali. Du får svensktalande rådgivning genom hela affären: urval, visningsresa, förhandling, juridisk kontroll av lagfarten (TAPU), skatteregistrering, bankkonto och överlämning med möbelpaket.",
      "Turkiska bostadsköp går snabbt. Från handpenning till registrerad TAPU tar det normalt två till sex veckor, och du behöver aldrig vara bosatt i landet. Ett köp över 200 000 US-dollar ger dessutom rätt att ansöka om uppehållstillstånd, och 400 000 US-dollar ger rätt att ansöka om turkiskt medborgarskap för hela familjen.",
    ],
    highlights: [
      { title: "Från 75 000 €", text: "Nybyggda lägenheter med pool, gym och 24/7-säkerhet." },
      { title: "6–8 % avkastning", text: "Korttidsuthyrning i Alanya och Antalya året runt." },
      { title: "2–6 veckor", text: "Normal tid från reservation till registrerad lagfart (TAPU)." },
      { title: "Svensk rådgivning", text: "Egen personal på plats som talar svenska och engelska." },
    ],
    sections: [
      {
        heading: "Vad kostar en lägenhet i Turkiet?",
        body: "Prisbilden styrs främst av avstånd till havet och byggår. I Alanyas centrala delar kostar en etta 75 000–95 000 €, en tvåa 95 000–140 000 € och en trea med havsutsikt 150 000–220 000 €. Antalya (Konyaaltı och Lara) ligger 15–25 procent högre, medan Mersin är billigast med tvåor från 65 000 €. Till köpeskillingen tillkommer cirka 4 procents lagfartsavgift, 1 500–2 500 € i juridiska kostnader samt en årlig fastighetsskatt på bara 0,1–0,2 procent av taxeringsvärdet.",
      },
      {
        heading: "Så går köpprocessen till som svensk",
        body: "Steg ett är en visningsresa där vi visar fem till åtta objekt som matchar din budget. Därefter reserveras bostaden med 2 000–5 000 € och kontrakt skrivs på svenska och turkiska. Vi ansöker om ditt turkiska skattenummer, öppnar bankkonto, beställer den obligatoriska värderingsrapporten och kontrollerar att objektet är fritt från inteckningar. Slutbetalning sker mot registrering av TAPU hos fastighetsmyndigheten – du behöver inte vara på plats om du utfärdar fullmakt.",
      },
      {
        heading: "Uthyrning och avkastning",
        body: "Turkiet hade över 55 miljoner besökare 2025 och säsongen i Antalyaregionen sträcker sig från april till november. En välbelägen tvåa hyrs ut för 55–90 € per natt under högsäsong, vilket ger 6–8 procents bruttoavkastning. Vi erbjuder full förvaltning med städning, nyckelhantering, marknadsföring och skatteredovisning så att du kan äga bostaden helt passivt.",
      },
    ],
    faq: [
      {
        question: "Kan svenskar köpa lägenhet i Turkiet?",
        answer:
          "Ja. Svenska medborgare får äga fastighet i Turkiet i eget namn. Det enda undantaget är mark i militära skyddszoner, vilket kontrolleras automatiskt innan lagfarten registreras.",
      },
      {
        question: "Vad kostar det totalt att köpa lägenhet i Turkiet?",
        answer:
          "Räkna med köpeskillingen plus cirka 6 procent i omkostnader: 4 procent lagfartsavgift, värderingsrapport, översättning och notarie samt anslutningsavgifter för el och vatten.",
      },
      {
        question: "Får jag uppehållstillstånd om jag köper bostad?",
        answer:
          "Ett köp från 200 000 US-dollar ger rätt att ansöka om uppehållstillstånd för dig och din familj. Från 400 000 US-dollar kan du ansöka om turkiskt medborgarskap.",
      },
      {
        question: "Hur mycket kostar det att äga bostaden per år?",
        answer:
          "Driftskostnaden för en normal lägenhet i ett komplex ligger på 40–80 € i månaden (aidat) plus fastighetsskatt på 0,1–0,2 procent och obligatorisk jordbävningsförsäkring på cirka 60 € per år.",
      },
    ],
    ctaTitle: "Vill du se lägenheterna på plats?",
    ctaText:
      "Boka en kostnadsfri visningsresa med svensktalande rådgivare i Antalya eller Alanya.",
    ctaButton: "Kontakta oss",
    listingsTitle: "Lägenheter till salu i Turkiet",
    listingsCta: "Se alla bostäder i Turkiet",
    listingsPath: "/property-for-sale-in-turkey",
    relatedLabel: "Läs mer",
  },
  {
    locale: "sv",
    slug: "lagenhet-alanya",
    locationFilter: "alanya",
    primaryKeyword: "lägenhet alanya",
    keywords: [
      "lägenhet alanya",
      "lägenhet till salu alanya",
      "köpa lägenhet alanya",
      "bostad alanya pris",
    ],
    title: "Lägenhet Alanya Till Salu | Priser från 75 000 €",
    description:
      "Lägenhet i Alanya till salu från 75 000 €. Nybyggt vid stranden i Mahmutlar, Oba och Cleopatra – svensk rådgivning, TAPU på 2–6 veckor.",
    h1: "Lägenhet i Alanya till salu – nybyggt vid Medelhavet",
    heroSubtitle:
      "Strandnära bostäder i Mahmutlar, Oba, Kestel och Cleopatra med pool, gym och havsutsikt.",
    intro: [
      "Alanya är den mest köpta destinationen bland svenskar i Turkiet – 300 soldagar per år, direktflyg till Gazipaşa och Antalya samt en etablerad skandinavisk community. En nybyggd lägenhet i Alanya kostar från 75 000 € för en etta och 95 000–160 000 € för en tvåa nära stranden.",
      "Vi har ett eget kontor i Alanya med rådgivare som talar svenska. Det gör att du kan gå igenom allt från budget och områdesval till uthyrning och förvaltning på ditt eget språk, och att någon alltid finns på plats efter köpet.",
      "De populäraste områdena är Mahmutlar (prisvärt, promenadavstånd till havet), Oba (nybyggt och nära sjukhus och köpcentrum), Kestel (lugnt och strandnära) samt Cleopatra och centrum för dig som vill ha stadsliv och den bästa stranden.",
    ],
    highlights: [
      { title: "300 soldagar", text: "Behaglig säsong från mars till november." },
      { title: "Från 75 000 €", text: "Nybyggda ettor och tvåor i moderna komplex." },
      { title: "Svenskt kontor", text: "Rådgivare på plats i Alanya året runt." },
      { title: "Full förvaltning", text: "Uthyrning, städning och skatt sköts åt dig." },
    ],
    sections: [
      {
        heading: "Priser per område i Alanya",
        body: "Mahmutlar är fortsatt bäst i test för budgetköpare: ettor från 75 000 € och tvåor kring 95 000–120 000 €. I Oba, som byggts ut kraftigt de senaste åren, ligger tvåor på 110 000–150 000 € och treor upp mot 200 000 €. Cleopatra och centrala Alanya är dyrast med 2 500–3 500 € per kvadratmeter, medan Kestel och Kargıcak ger mest boyta för pengarna med havsutsikt från kullarna.",
      },
      {
        heading: "Vad ingår i ett modernt Alanya-komplex?",
        body: "Nybyggda projekt levereras normalt med utomhuspool och ofta inomhuspool, gym, bastu och turkiskt bad, barnlekplats, generator, 24-timmarsbevakning och underjordiskt garage. Kök, garderober, luftkonditionering och badrum är ofta färdiginstallerade, och möbelpaket kan beställas så att bostaden är inflyttningsklar när du landar.",
      },
      {
        heading: "Uthyrning i Alanya",
        body: "Efterfrågan på korttidsuthyrning är hög från maj till oktober, och allt fler nordbor hyr långtid under vintern. En strandnära tvåa ger typiskt 6–8 procents bruttoavkastning. Vi hanterar registrering för turistuthyrning, annonsering, gästmottagning och redovisning.",
      },
    ],
    faq: [
      {
        question: "Vad kostar en lägenhet i Alanya?",
        answer:
          "En nybyggd etta börjar runt 75 000 €, en tvåa kostar 95 000–160 000 € och en trea med havsutsikt 160 000–250 000 € beroende på område och avstånd till stranden.",
      },
      {
        question: "Vilket område i Alanya är bäst för svenskar?",
        answer:
          "Mahmutlar och Oba är populärast tack vare prisnivå, service och närhet till havet. Cleopatra passar dig som vill bo centralt vid stadens bästa strand.",
      },
      {
        question: "Kan jag hyra ut min lägenhet i Alanya?",
        answer:
          "Ja, med turistuthyrningstillstånd. Vi ordnar tillståndet och sköter uthyrning, städning och skatteredovisning genom vårt lokala förvaltningsteam.",
      },
      {
        question: "Hur lång tid tar köpet?",
        answer:
          "Normalt två till sex veckor från reservation till registrerad TAPU. Du kan sköta hela affären via fullmakt om du inte kan vara på plats.",
      },
    ],
    ctaTitle: "Vill du se lägenheter i Alanya?",
    ctaText: "Vårt Alanyakontor ordnar visningsresa, flygplatstransfer och boende.",
    ctaButton: "Boka visning",
    listingsTitle: "Lägenheter till salu i Alanya",
    listingsCta: "Se alla bostäder i Alanya",
    listingsPath: "/antalya",
    relatedLabel: "Läs mer",
  },
  {
    locale: "sv",
    slug: "lagenhet-dubai",
    locationFilter: "dubai",
    primaryKeyword: "lägenhet dubai",
    keywords: [
      "lägenhet dubai",
      "köpa lägenhet i dubai",
      "lägenhet till salu dubai",
      "investera i dubai fastigheter",
    ],
    title: "Lägenhet Dubai Till Salu | Köpa Bostad Skattefritt",
    description:
      "Köp lägenhet i Dubai från 190 000 €. 0 % fastighetsskatt, 6–9 % hyresavkastning, betalplaner och golden visa – svensk rådgivning på plats.",
    h1: "Lägenhet i Dubai till salu – skattefri avkastning",
    heroSubtitle:
      "Nyproduktion i Dubai Marina, Business Bay, JVC och Dubai Creek Harbour med betalplan.",
    intro: [
      "Dubai är världens mest lönsamma storstadsmarknad för bostadsinvesterare: ingen fastighetsskatt, ingen skatt på hyresintäkter och en hyresavkastning på 6–9 procent. En lägenhet i Dubai kostar från cirka 190 000 € för en studio i JVC, medan en tvåa i Dubai Marina eller Business Bay ligger på 380 000–650 000 €.",
      "Nyproduktion säljs oftast med betalplan: 20 procent i handpenning, resterande under byggtiden och 30–40 procent vid tillträde. Det gör att du kan komma in på marknaden med relativt lite eget kapital och ändå ta del av värdeökningen.",
      "En investering från 2 miljoner AED (cirka 500 000 €) ger rätt att ansöka om Golden Visa – tio års förnybart uppehållstillstånd för dig och familjen.",
    ],
    highlights: [
      { title: "0 % skatt", text: "Ingen fastighetsskatt och ingen skatt på hyresintäkter." },
      { title: "6–9 % avkastning", text: "Bland de högsta i världen för storstadsbostäder." },
      { title: "Betalplan", text: "Från 20 % handpenning och resten under byggtiden." },
      { title: "Golden Visa", text: "Tio års uppehållstillstånd från 2 miljoner AED." },
    ],
    sections: [
      {
        heading: "Priser och områden i Dubai",
        body: "JVC och Dubai Sports City är instegsmarknaden med studios från 190 000 € och tvåor kring 280 000 €. Business Bay och Dubai Creek Harbour ligger i mellanskiktet med tvåor på 380 000–550 000 €, medan Dubai Marina, Downtown och Palm Jumeirah är premiumsegmentet där kvadratmeterpriset når 5 000–12 000 €. Högst hyresavkastning finns i JVC, Arjan och Dubai South.",
      },
      {
        heading: "Så köper du som utländsk medborgare",
        body: "Utlänningar får äga fastigheter med full äganderätt (freehold) i utpekade områden, vilket omfattar i princip all nyproduktion som säljs internationellt. Köpet registreras hos Dubai Land Department mot en avgift på 4 procent plus administrativa avgifter. Handläggningen tar bara några dagar för färdiga bostäder, och vi hanterar hela processen inklusive bankkonto och Golden Visa-ansökan.",
      },
      {
        heading: "Uthyrning och förvaltning",
        body: "Dubai har en enorm hyresmarknad av utländska yrkesverksamma och en stark turistsektor. Korttidsuthyrning ger högst intäkt men kräver licens, medan årsvis uthyrning ger stabil och passiv avkastning. Vår partner i Dubai sköter kontrakt, hyresgäster, underhåll och redovisning.",
      },
    ],
    faq: [
      {
        question: "Kan svenskar äga lägenhet i Dubai?",
        answer:
          "Ja. I freehold-områden får utländska medborgare äga bostaden med full äganderätt utan lokal partner.",
      },
      {
        question: "Vad kostar en lägenhet i Dubai?",
        answer:
          "Studios börjar runt 190 000 € i JVC, tvåor i Business Bay kostar 380 000–550 000 € och Marina/Downtown ligger högre beroende på våning och utsikt.",
      },
      {
        question: "Betalar jag skatt på hyresintäkterna?",
        answer:
          "Dubai tar inte ut skatt på hyresintäkter eller fastighetsinnehav. Du kan däremot vara skattskyldig i Sverige – vi rekommenderar att du stämmer av med din rådgivare.",
      },
      {
        question: "Hur fungerar Golden Visa?",
        answer:
          "En fastighetsinvestering från 2 miljoner AED ger rätt att ansöka om tio års förnybart uppehållstillstånd som även omfattar make/maka och barn.",
      },
    ],
    ctaTitle: "Vill du investera i Dubai?",
    ctaText: "Få en aktuell projektlista med betalplaner och förväntad avkastning.",
    ctaButton: "Kontakta oss",
    listingsTitle: "Lägenheter till salu i Dubai",
    listingsCta: "Se alla bostäder i Dubai",
    listingsPath: "/dubai",
    relatedLabel: "Läs mer",
  },
  {
    locale: "sv",
    slug: "villa-bali",
    locationFilter: "bali",
    primaryKeyword: "villa bali",
    keywords: ["villa bali", "köpa villa på bali", "hus till salu bali", "investera på bali"],
    title: "Villa Bali Till Salu | Köpa Villa med Pool på Bali",
    description:
      "Villa på Bali till salu från 180 000 €. Poolvillor i Canggu, Ubud och Uluwatu med 10–15 % avkastning och full uthyrningsförvaltning.",
    h1: "Villa på Bali till salu – poolvillor med hög avkastning",
    heroSubtitle: "Nybyggda villor i Canggu, Seminyak, Ubud och Uluwatu med förvaltning.",
    intro: [
      "Bali är den nya favoritmarknaden för nordiska investerare. En nybyggd tvårumsvilla med privat pool kostar från cirka 180 000 €, och en fyrarumsvilla i Canggu eller Uluwatu ligger på 350 000–600 000 €. Hyresavkastningen är exceptionell: 10–15 procent brutto på korttidsuthyrning tack vare över sex miljoner internationella besökare per år.",
      "Vårt kontor i Bali hanterar hela affären: juridisk kontroll av marken, notarie (PPAT), bygglov, byggövervakning och uthyrningsförvaltning efter tillträdet.",
      "Utländska köpare äger normalt genom leasehold på 25–30 år med förlängningsrätt, eller genom Hak Pakai/PT PMA för dig som vill ha ett långsiktigt eller bolagsägt innehav. Vi går igenom vilken struktur som passar just ditt syfte.",
    ],
    highlights: [
      { title: "10–15 % avkastning", text: "Korttidsuthyrning året runt till internationella gäster." },
      { title: "Från 180 000 €", text: "Nybyggd poolvilla med två sovrum." },
      { title: "Eget kontor", text: "Future Homes finns på plats i Bali." },
      { title: "Nyckelfärdigt", text: "Design, bygge, möblering och uthyrning i ett paket." },
    ],
    sections: [
      {
        heading: "Områden och priser på Bali",
        body: "Canggu och Berawa är hetast med högst uthyrningsgrad och priser på 300 000–600 000 € för en villa med tre till fyra sovrum. Uluwatu och Bingin ger havsutsikt och lite lägre pris per kvadratmeter, medan Ubud passar den som vill ha grönska och wellnessgäster med villor från 180 000 €. Sanur och Nusa Dua är lugnare familjeområden med stabil långtidsuthyrning.",
      },
      {
        heading: "Ägandeformer för utländska köpare",
        body: "Leasehold är vanligast och innebär att du hyr marken i 25–30 år med avtalad förlängning – enkelt, snabbt och likvidt vid försäljning. Hak Pakai ger nyttjanderätt för utlänningar med uppehållstillstånd. Vill du driva uthyrning kommersiellt bildas ett indonesiskt bolag (PT PMA) som kan äga byggrätt. Alla alternativ granskas av vår notarie innan handpenning betalas.",
      },
      {
        heading: "Avkastning och förvaltning",
        body: "En välbelägen tvårumsvilla i Canggu hyrs ut för 150–250 € per natt med 70–85 procents beläggning. Efter förvaltningsavgift och driftskostnader ger det normalt 10–15 procents nettoavkastning på investerat kapital. Vi sköter marknadsföring på Airbnb och Booking, gästmottagning, städning, pool och underhåll.",
      },
    ],
    faq: [
      {
        question: "Kan utlänningar köpa villa på Bali?",
        answer:
          "Ja, men inte i form av indonesisk full äganderätt. De vanligaste strukturerna är leasehold på 25–30 år med förlängning, Hak Pakai eller ägande via ett indonesiskt bolag (PT PMA).",
      },
      {
        question: "Vad kostar en villa på Bali?",
        answer:
          "En nybyggd villa med två sovrum och pool börjar runt 180 000 €, medan tre till fyra sovrum i Canggu och Uluwatu kostar 300 000–600 000 €.",
      },
      {
        question: "Hur hög är avkastningen?",
        answer:
          "Korttidsuthyrning i Canggu ger typiskt 10–15 procents årlig avkastning efter förvaltningskostnader, beroende på läge, storlek och beläggningsgrad.",
      },
      {
        question: "Sköter ni uthyrningen?",
        answer:
          "Ja. Vårt Balikontor erbjuder full förvaltning med annonsering, gästmottagning, städning, underhåll och månadsvis redovisning.",
      },
    ],
    ctaTitle: "Vill du äga en villa på Bali?",
    ctaText: "Få vår aktuella villalista med pris, avkastning och ägandeform.",
    ctaButton: "Kontakta oss",
    listingsTitle: "Villor till salu på Bali",
    listingsCta: "Se alla bostäder på Bali",
    listingsPath: "/bali",
    relatedLabel: "Läs mer",
  },

  /* ---------------------------------- NO ---------------------------------- */
  {
    locale: "no",
    slug: "kjope-leilighet-tyrkia",
    locationFilter: "turkey",
    primaryKeyword: "kjøpe leilighet i tyrkia",
    keywords: [
      "kjøpe leilighet i tyrkia",
      "leilighet til salgs tyrkia",
      "bolig i tyrkia",
      "hus til salgs tyrkia",
    ],
    title: "Kjøpe Leilighet i Tyrkia 2026 | Priser & Guide",
    description:
      "Kjøpe leilighet i Tyrkia fra 75 000 €. Norsktalende rådgivning, trygg TAPU-prosess, oppholdstillatelse og 6–8 % leieavkastning i Alanya og Antalya.",
    h1: "Kjøpe leilighet i Tyrkia – priser, prosess og trygg handel",
    heroSubtitle: "Nybygde leiligheter ved Middelhavet med skandinavisk rådgivning hele veien.",
    intro: [
      "Å kjøpe leilighet i Tyrkia er fortsatt en av Europas rimeligste måter å skaffe seg bolig ved sjøen. Prisene starter rundt 75 000 € for en moderne toroms i Alanya, mens en strandnær treroms i Antalya som regel koster mellom 150 000 og 250 000 €. Sammenlignet med Spania får du 30–50 prosent mer boareal for samme beløp, med lavere driftskostnader og eiendomsskatt.",
      "Future Homes International har hjulpet nordiske kjøpere siden 2004 og har egne kontorer i Antalya, Alanya, Mersin, Dubai og Bali. Du får rådgivning på skandinavisk gjennom hele prosessen: utvalg, visningstur, forhandling, juridisk kontroll av skjøtet (TAPU), skatteregistrering, bankkonto og overlevering.",
      "Prosessen går raskt. Fra håndpenger til registrert TAPU tar det normalt to til seks uker, og du trenger ikke å bo i landet. Kjøp over 200 000 amerikanske dollar gir rett til å søke oppholdstillatelse, og 400 000 dollar gir rett til å søke tyrkisk statsborgerskap for hele familien.",
    ],
    highlights: [
      { title: "Fra 75 000 €", text: "Nybygde leiligheter med basseng, gym og døgnvakt." },
      { title: "6–8 % avkastning", text: "Korttidsutleie i Alanya og Antalya store deler av året." },
      { title: "2–6 uker", text: "Normal tid fra reservasjon til registrert skjøte." },
      { title: "Skandinavisk hjelp", text: "Egne ansatte på stedet som snakker norsk og engelsk." },
    ],
    sections: [
      {
        heading: "Hva koster en leilighet i Tyrkia?",
        body: "Prisen styres først og fremst av avstand til sjøen og byggeår. Sentralt i Alanya koster en ettroms 75 000–95 000 €, en toroms 95 000–140 000 € og en treroms med sjøutsikt 150 000–220 000 €. Antalya (Konyaaltı og Lara) ligger 15–25 prosent høyere, mens Mersin er rimeligst med toroms fra 65 000 €. I tillegg kommer cirka 4 prosent tinglysingsgebyr, 1 500–2 500 € i juridiske kostnader og en årlig eiendomsskatt på bare 0,1–0,2 prosent.",
      },
      {
        heading: "Slik foregår kjøpet for nordmenn",
        body: "Først en visningstur der vi viser fem til åtte objekter innenfor budsjettet. Deretter reserveres boligen med 2 000–5 000 €, og kontrakt signeres på engelsk og tyrkisk. Vi søker om tyrkisk skattenummer, åpner bankkonto, bestiller den obligatoriske takstrapporten og kontrollerer at eiendommen er heftelsesfri. Sluttoppgjør skjer mot registrering av TAPU – du kan bruke fullmakt hvis du ikke kan være til stede.",
      },
      {
        heading: "Utleie og avkastning",
        body: "Tyrkia hadde over 55 millioner besøkende i 2025, og sesongen i Antalya-regionen varer fra april til november. En godt plassert toroms leies ut for 55–90 € per natt i høysesong, som gir 6–8 prosent bruttoavkastning. Vi tilbyr full forvaltning med renhold, nøkkelhåndtering, markedsføring og skatterapportering.",
      },
    ],
    faq: [
      {
        question: "Kan nordmenn kjøpe leilighet i Tyrkia?",
        answer:
          "Ja. Norske statsborgere kan eie eiendom i Tyrkia i eget navn. Eneste unntak er tomter i militære sikkerhetssoner, noe som kontrolleres automatisk før tinglysing.",
      },
      {
        question: "Hva koster kjøpet totalt?",
        answer:
          "Regn med kjøpesummen pluss cirka 6 prosent i omkostninger: 4 prosent tinglysingsgebyr, takst, oversettelse og notarius, samt tilkobling av strøm og vann.",
      },
      {
        question: "Får jeg oppholdstillatelse ved boligkjøp?",
        answer:
          "Kjøp fra 200 000 amerikanske dollar gir rett til å søke oppholdstillatelse for deg og familien. Fra 400 000 dollar kan du søke tyrkisk statsborgerskap.",
      },
      {
        question: "Hva koster det å eie boligen årlig?",
        answer:
          "Fellesutgifter i et boligkompleks ligger på 40–80 € i måneden, i tillegg til eiendomsskatt på 0,1–0,2 prosent og obligatorisk jordskjelvforsikring på rundt 60 € i året.",
      },
    ],
    ctaTitle: "Vil du se leilighetene på stedet?",
    ctaText: "Book en gratis visningstur med skandinavisk rådgiver i Antalya eller Alanya.",
    ctaButton: "Kontakt oss",
    listingsTitle: "Leiligheter til salgs i Tyrkia",
    listingsCta: "Se alle boliger i Tyrkia",
    listingsPath: "/property-for-sale-in-turkey",
    relatedLabel: "Les mer",
  },
  {
    locale: "no",
    slug: "leilighet-alanya",
    locationFilter: "alanya",
    primaryKeyword: "leilighet alanya",
    keywords: ["leilighet alanya", "leilighet til salgs alanya", "bolig alanya", "kjøpe leilighet alanya"],
    title: "Leilighet Alanya Til Salgs | Priser fra 75 000 €",
    description:
      "Leilighet i Alanya til salgs fra 75 000 €. Nybygg ved stranden i Mahmutlar, Oba og Cleopatra – skandinavisk rådgivning og TAPU på 2–6 uker.",
    h1: "Leilighet i Alanya til salgs – nybygg ved Middelhavet",
    heroSubtitle: "Strandnære boliger i Mahmutlar, Oba, Kestel og Cleopatra med basseng og gym.",
    intro: [
      "Alanya er den mest populære destinasjonen blant nordmenn i Tyrkia – 300 soldager i året, direktefly til Gazipaşa og Antalya og et etablert skandinavisk miljø. En nybygd leilighet i Alanya koster fra 75 000 € for en ettroms og 95 000–160 000 € for en toroms nær stranden.",
      "Vi har eget kontor i Alanya med skandinaviske rådgivere. Det betyr at du kan gå gjennom alt fra budsjett og områdevalg til utleie og forvaltning på et språk du er trygg på, og at noen alltid er tilgjengelig etter kjøpet.",
      "De mest populære områdene er Mahmutlar (rimelig, gangavstand til sjøen), Oba (nybygg nær sykehus og kjøpesenter), Kestel (rolig og strandnært) samt Cleopatra og sentrum for deg som vil ha byliv og den beste stranden.",
    ],
    highlights: [
      { title: "300 soldager", text: "Behagelig sesong fra mars til november." },
      { title: "Fra 75 000 €", text: "Nybygde ett- og toromsleiligheter i moderne komplekser." },
      { title: "Kontor i Alanya", text: "Rådgivere på stedet hele året." },
      { title: "Full forvaltning", text: "Utleie, renhold og skatt håndteres for deg." },
    ],
    sections: [
      {
        heading: "Priser per område i Alanya",
        body: "Mahmutlar er best for budsjettkjøpere: ettroms fra 75 000 € og toroms rundt 95 000–120 000 €. I Oba koster toroms 110 000–150 000 € og treroms opptil 200 000 €. Cleopatra og Alanya sentrum er dyrest med 2 500–3 500 € per kvadratmeter, mens Kestel og Kargıcak gir mest areal for pengene med sjøutsikt fra åssidene.",
      },
      {
        heading: "Hva følger med i et moderne kompleks?",
        body: "Nybygg leveres normalt med utendørsbasseng og ofte innendørsbasseng, gym, badstue og tyrkisk bad, lekeplass, generator, døgnvakt og garasjeanlegg. Kjøkken, skap, klimaanlegg og bad er ofte ferdig installert, og møbelpakker kan bestilles slik at boligen er innflytningsklar.",
      },
      {
        heading: "Utleie i Alanya",
        body: "Etterspørselen etter korttidsutleie er høy fra mai til oktober, og stadig flere nordboere leier langtid om vinteren. En strandnær toroms gir typisk 6–8 prosent bruttoavkastning. Vi ordner turistutleietillatelse, annonsering, gjestemottak og regnskap.",
      },
    ],
    faq: [
      {
        question: "Hva koster en leilighet i Alanya?",
        answer:
          "En nybygd ettroms starter rundt 75 000 €, toroms koster 95 000–160 000 € og treroms med sjøutsikt 160 000–250 000 € avhengig av område.",
      },
      {
        question: "Hvilket område i Alanya passer best for nordmenn?",
        answer:
          "Mahmutlar og Oba er mest populære på grunn av pris, service og nærhet til sjøen. Cleopatra passer deg som vil bo sentralt ved byens beste strand.",
      },
      {
        question: "Kan jeg leie ut leiligheten?",
        answer:
          "Ja, med turistutleietillatelse. Vi ordner tillatelsen og håndterer utleie, renhold og skatterapportering gjennom vårt lokale team.",
      },
      {
        question: "Hvor lang tid tar kjøpet?",
        answer:
          "Normalt to til seks uker fra reservasjon til registrert TAPU. Hele handelen kan gjennomføres med fullmakt.",
      },
    ],
    ctaTitle: "Vil du se leiligheter i Alanya?",
    ctaText: "Kontoret vårt i Alanya ordner visningstur, flyplasstransport og opphold.",
    ctaButton: "Book visning",
    listingsTitle: "Leiligheter til salgs i Alanya",
    listingsCta: "Se alle boliger i Alanya",
    listingsPath: "/antalya",
    relatedLabel: "Les mer",
  },
  {
    locale: "no",
    slug: "villa-bali",
    locationFilter: "bali",
    primaryKeyword: "villa bali",
    keywords: ["villa bali", "kjøpe villa på bali", "hus til salgs bali", "investere på bali"],
    title: "Villa Bali Til Salgs | Kjøpe Villa med Basseng",
    description:
      "Villa på Bali til salgs fra 180 000 €. Bassengvillaer i Canggu, Ubud og Uluwatu med 10–15 % avkastning og full utleieforvaltning.",
    h1: "Villa på Bali til salgs – bassengvillaer med høy avkastning",
    heroSubtitle: "Nybygde villaer i Canggu, Seminyak, Ubud og Uluwatu med forvaltning inkludert.",
    intro: [
      "Bali er det nye favorittmarkedet for nordiske investorer. En nybygd villa med to soverom og privat basseng koster fra rundt 180 000 €, mens en villa med fire soverom i Canggu eller Uluwatu ligger på 350 000–600 000 €. Leieavkastningen er eksepsjonell: 10–15 prosent brutto på korttidsutleie med over seks millioner internasjonale besøkende i året.",
      "Kontoret vårt på Bali håndterer hele prosessen: juridisk kontroll av tomten, notarius (PPAT), byggetillatelse, byggeoppfølging og utleieforvaltning etter overtakelse.",
      "Utenlandske kjøpere eier normalt gjennom leasehold på 25–30 år med forlengelsesrett, eller gjennom Hak Pakai/PT PMA for langsiktig eller selskapseid eierskap. Vi går gjennom hvilken struktur som passer ditt formål.",
    ],
    highlights: [
      { title: "10–15 % avkastning", text: "Korttidsutleie hele året til internasjonale gjester." },
      { title: "Fra 180 000 €", text: "Nybygd bassengvilla med to soverom." },
      { title: "Eget kontor", text: "Future Homes er til stede på Bali." },
      { title: "Nøkkelferdig", text: "Design, bygging, møblering og utleie i én pakke." },
    ],
    sections: [
      {
        heading: "Områder og priser på Bali",
        body: "Canggu og Berawa har høyest utleiegrad, med priser på 300 000–600 000 € for villaer med tre til fire soverom. Uluwatu og Bingin gir havutsikt til lavere kvadratmeterpris, mens Ubud passer for grønne omgivelser og wellnessgjester med villaer fra 180 000 €. Sanur og Nusa Dua er roligere familieområder med stabil langtidsutleie.",
      },
      {
        heading: "Eierformer for utlendinger",
        body: "Leasehold er vanligst: du leier tomten i 25–30 år med avtalt forlengelse – enkelt, raskt og lett omsettelig. Hak Pakai gir bruksrett for utlendinger med oppholdstillatelse. Skal du drive kommersiell utleie, opprettes et indonesisk selskap (PT PMA). Alle alternativer gjennomgås av vår notarius før håndpenger betales.",
      },
      {
        heading: "Avkastning og forvaltning",
        body: "En godt plassert villa med to soverom i Canggu leies ut for 150–250 € per natt med 70–85 prosent belegg. Etter forvaltningshonorar og driftskostnader gir det normalt 10–15 prosent netto avkastning. Vi håndterer markedsføring på Airbnb og Booking, gjestemottak, renhold, basseng og vedlikehold.",
      },
    ],
    faq: [
      {
        question: "Kan utlendinger kjøpe villa på Bali?",
        answer:
          "Ja, men ikke som indonesisk full eiendomsrett. De vanligste strukturene er leasehold på 25–30 år med forlengelse, Hak Pakai eller eierskap via et indonesisk selskap (PT PMA).",
      },
      {
        question: "Hva koster en villa på Bali?",
        answer:
          "En nybygd villa med to soverom og basseng starter rundt 180 000 €, mens tre til fire soverom i Canggu og Uluwatu koster 300 000–600 000 €.",
      },
      {
        question: "Hvor høy er avkastningen?",
        answer:
          "Korttidsutleie i Canggu gir typisk 10–15 prosent årlig avkastning etter forvaltningskostnader, avhengig av beliggenhet, størrelse og belegg.",
      },
      {
        question: "Håndterer dere utleien?",
        answer:
          "Ja. Bali-kontoret vårt tilbyr full forvaltning med annonsering, gjestemottak, renhold, vedlikehold og månedlig rapportering.",
      },
    ],
    ctaTitle: "Vil du eie en villa på Bali?",
    ctaText: "Få vår oppdaterte villaliste med pris, avkastning og eierform.",
    ctaButton: "Kontakt oss",
    listingsTitle: "Villaer til salgs på Bali",
    listingsCta: "Se alle boliger på Bali",
    listingsPath: "/bali",
    relatedLabel: "Les mer",
  },
  {
    locale: "no",
    slug: "leilighet-dubai",
    locationFilter: "dubai",
    primaryKeyword: "leilighet dubai",
    keywords: ["leilighet dubai", "kjøpe leilighet i dubai", "bolig dubai", "investere i dubai eiendom"],
    title: "Leilighet Dubai Til Salgs | Kjøpe Bolig Skattefritt",
    description:
      "Kjøp leilighet i Dubai fra 190 000 €. 0 % eiendomsskatt, 6–9 % leieavkastning, betalingsplan og golden visa – skandinavisk rådgivning.",
    h1: "Leilighet i Dubai til salgs – skattefri avkastning",
    heroSubtitle: "Nybygg i Dubai Marina, Business Bay, JVC og Dubai Creek Harbour med betalingsplan.",
    intro: [
      "Dubai er verdens mest lønnsomme storbymarked for boliginvestorer: ingen eiendomsskatt, ingen skatt på leieinntekter og en leieavkastning på 6–9 prosent. En leilighet i Dubai koster fra cirka 190 000 € for en studio i JVC, mens en toroms i Dubai Marina eller Business Bay ligger på 380 000–650 000 €.",
      "Nybygg selges som regel med betalingsplan: 20 prosent i håndpenger, resten i byggeperioden og 30–40 prosent ved overtakelse. Dermed kommer du inn på markedet med relativt lite egenkapital.",
      "En investering fra 2 millioner AED (cirka 500 000 €) gir rett til å søke Golden Visa – ti års fornybar oppholdstillatelse for deg og familien.",
    ],
    highlights: [
      { title: "0 % skatt", text: "Ingen eiendomsskatt og ingen skatt på leieinntekter." },
      { title: "6–9 % avkastning", text: "Blant verdens høyeste for storbyboliger." },
      { title: "Betalingsplan", text: "Fra 20 % håndpenger og resten i byggeperioden." },
      { title: "Golden Visa", text: "Ti års oppholdstillatelse fra 2 millioner AED." },
    ],
    sections: [
      {
        heading: "Priser og områder i Dubai",
        body: "JVC og Dubai Sports City er inngangsmarkedet med studioer fra 190 000 € og toroms rundt 280 000 €. Business Bay og Dubai Creek Harbour ligger i mellomsjiktet med toroms på 380 000–550 000 €, mens Dubai Marina, Downtown og Palm Jumeirah er premiumsegmentet med 5 000–12 000 € per kvadratmeter. Høyest leieavkastning finnes i JVC, Arjan og Dubai South.",
      },
      {
        heading: "Slik kjøper du som utenlandsk statsborger",
        body: "Utlendinger kan eie eiendom med full eiendomsrett (freehold) i utpekte områder, som omfatter nesten all nybygging som selges internasjonalt. Kjøpet registreres hos Dubai Land Department mot 4 prosent gebyr. Ferdige boliger overføres på noen få dager, og vi håndterer hele prosessen inkludert bankkonto og Golden Visa.",
      },
      {
        heading: "Utleie og forvaltning",
        body: "Dubai har et stort leiemarked av utenlandske arbeidstakere og en sterk turistsektor. Korttidsutleie gir høyest inntekt, men krever lisens, mens årlig utleie gir stabil og passiv avkastning. Vår partner i Dubai håndterer kontrakter, leietakere, vedlikehold og rapportering.",
      },
    ],
    faq: [
      {
        question: "Kan nordmenn eie leilighet i Dubai?",
        answer: "Ja. I freehold-områder kan utenlandske statsborgere eie boligen fullt ut uten lokal partner.",
      },
      {
        question: "Hva koster en leilighet i Dubai?",
        answer:
          "Studioer starter rundt 190 000 € i JVC, toroms i Business Bay koster 380 000–550 000 €, og Marina/Downtown ligger høyere avhengig av etasje og utsikt.",
      },
      {
        question: "Betaler jeg skatt på leieinntektene?",
        answer:
          "Dubai har ingen skatt på leieinntekter eller eiendom. Du kan likevel være skattepliktig i Norge – avklar med din rådgiver.",
      },
      {
        question: "Hvordan fungerer Golden Visa?",
        answer:
          "En eiendomsinvestering fra 2 millioner AED gir rett til å søke ti års fornybar oppholdstillatelse som også omfatter ektefelle og barn.",
      },
    ],
    ctaTitle: "Vil du investere i Dubai?",
    ctaText: "Få en oppdatert prosjektliste med betalingsplaner og forventet avkastning.",
    ctaButton: "Kontakt oss",
    listingsTitle: "Leiligheter til salgs i Dubai",
    listingsCta: "Se alle boliger i Dubai",
    listingsPath: "/dubai",
    relatedLabel: "Les mer",
  },

  /* ---------------------------------- DA ---------------------------------- */
  {
    locale: "da",
    slug: "kobe-lejlighed-tyrkiet",
    locationFilter: "turkey",
    primaryKeyword: "købe lejlighed i tyrkiet",
    keywords: [
      "købe lejlighed i tyrkiet",
      "lejlighed til salg tyrkiet",
      "bolig i tyrkiet",
      "hus til salg tyrkiet",
    ],
    title: "Købe Lejlighed i Tyrkiet 2026 | Priser & Guide",
    description:
      "Køb lejlighed i Tyrkiet fra 75.000 €. Skandinavisk rådgivning, tryg TAPU-proces, opholdstilladelse og 6–8 % lejeafkast i Alanya og Antalya.",
    h1: "Købe lejlighed i Tyrkiet – priser, proces og tryg handel",
    heroSubtitle: "Nybyggede lejligheder ved Middelhavet med skandinavisk rådgivning hele vejen.",
    intro: [
      "At købe lejlighed i Tyrkiet er stadig en af Europas billigste måder at få bolig ved havet på. Priserne starter omkring 75.000 € for en moderne toværelses i Alanya, mens en strandnær treværelses i Antalya typisk koster mellem 150.000 og 250.000 €. Sammenlignet med Spanien får du 30–50 procent mere boligareal for de samme penge, med lavere driftsomkostninger og ejendomsskat.",
      "Future Homes International har hjulpet nordiske købere siden 2004 og har egne kontorer i Antalya, Alanya, Mersin, Dubai og Bali. Du får skandinavisk rådgivning gennem hele handlen: udvalg, fremvisningstur, forhandling, juridisk kontrol af skødet (TAPU), skatteregistrering, bankkonto og aflevering.",
      "Processen er hurtig. Fra depositum til registreret TAPU går der normalt to til seks uger, og du behøver ikke bo i landet. Et køb over 200.000 amerikanske dollar giver ret til at søge opholdstilladelse, og 400.000 dollar giver ret til at søge tyrkisk statsborgerskab for hele familien.",
    ],
    highlights: [
      { title: "Fra 75.000 €", text: "Nybyggede lejligheder med pool, fitness og døgnvagt." },
      { title: "6–8 % afkast", text: "Korttidsudlejning i Alanya og Antalya det meste af året." },
      { title: "2–6 uger", text: "Normal tid fra reservation til registreret skøde." },
      { title: "Skandinavisk hjælp", text: "Egne medarbejdere på stedet, der taler skandinavisk." },
    ],
    sections: [
      {
        heading: "Hvad koster en lejlighed i Tyrkiet?",
        body: "Prisen afhænger primært af afstanden til havet og byggeåret. Centralt i Alanya koster en etværelses 75.000–95.000 €, en toværelses 95.000–140.000 € og en treværelses med havudsigt 150.000–220.000 €. Antalya (Konyaaltı og Lara) ligger 15–25 procent højere, mens Mersin er billigst med toværelses fra 65.000 €. Dertil kommer cirka 4 procent i tinglysningsgebyr, 1.500–2.500 € i juridiske omkostninger og en årlig ejendomsskat på kun 0,1–0,2 procent.",
      },
      {
        heading: "Sådan foregår købet som dansker",
        body: "Først en fremvisningstur, hvor vi viser fem til otte boliger inden for dit budget. Derefter reserveres boligen med 2.000–5.000 €, og kontrakten underskrives på engelsk og tyrkisk. Vi søger dit tyrkiske skattenummer, åbner bankkonto, bestiller den obligatoriske vurderingsrapport og kontrollerer, at boligen er fri for hæftelser. Slutbetaling sker mod registrering af TAPU – du kan bruge fuldmagt, hvis du ikke kan være til stede.",
      },
      {
        heading: "Udlejning og afkast",
        body: "Tyrkiet havde over 55 millioner besøgende i 2025, og sæsonen i Antalya-regionen løber fra april til november. En velbeliggende toværelses udlejes for 55–90 € pr. nat i højsæsonen, hvilket giver 6–8 procent i bruttoafkast. Vi tilbyder fuld administration med rengøring, nøglehåndtering, markedsføring og skatteindberetning.",
      },
    ],
    faq: [
      {
        question: "Kan danskere købe lejlighed i Tyrkiet?",
        answer:
          "Ja. Danske statsborgere må eje fast ejendom i Tyrkiet i eget navn. Eneste undtagelse er grunde i militære sikkerhedszoner, hvilket kontrolleres automatisk før tinglysning.",
      },
      {
        question: "Hvad koster købet i alt?",
        answer:
          "Regn med købesummen plus cirka 6 procent i omkostninger: 4 procent tinglysning, vurderingsrapport, oversættelse og notar samt tilslutning af el og vand.",
      },
      {
        question: "Får jeg opholdstilladelse ved boligkøb?",
        answer:
          "Et køb fra 200.000 amerikanske dollar giver ret til at søge opholdstilladelse for dig og familien. Fra 400.000 dollar kan du søge tyrkisk statsborgerskab.",
      },
      {
        question: "Hvad koster det at eje boligen årligt?",
        answer:
          "Fællesudgifter i et boligkompleks ligger på 40–80 € om måneden, plus ejendomsskat på 0,1–0,2 procent og lovpligtig jordskælvsforsikring på cirka 60 € om året.",
      },
    ],
    ctaTitle: "Vil du se lejlighederne på stedet?",
    ctaText: "Book en gratis fremvisningstur med skandinavisk rådgiver i Antalya eller Alanya.",
    ctaButton: "Kontakt os",
    listingsTitle: "Lejligheder til salg i Tyrkiet",
    listingsCta: "Se alle boliger i Tyrkiet",
    listingsPath: "/property-for-sale-in-turkey",
    relatedLabel: "Læs mere",
  },
  {
    locale: "da",
    slug: "lejlighed-alanya",
    locationFilter: "alanya",
    primaryKeyword: "lejlighed alanya",
    keywords: ["lejlighed alanya", "lejlighed til salg alanya", "bolig alanya", "købe lejlighed alanya"],
    title: "Lejlighed Alanya Til Salg | Priser fra 75.000 €",
    description:
      "Lejlighed i Alanya til salg fra 75.000 €. Nybyggeri ved stranden i Mahmutlar, Oba og Cleopatra – skandinavisk rådgivning og TAPU på 2–6 uger.",
    h1: "Lejlighed i Alanya til salg – nybyggeri ved Middelhavet",
    heroSubtitle: "Strandnære boliger i Mahmutlar, Oba, Kestel og Cleopatra med pool og fitness.",
    intro: [
      "Alanya er den mest populære destination blandt danskere i Tyrkiet – 300 soldage om året, direkte fly til Gazipaşa og Antalya og et etableret skandinavisk miljø. En nybygget lejlighed i Alanya koster fra 75.000 € for en etværelses og 95.000–160.000 € for en toværelses tæt på stranden.",
      "Vi har eget kontor i Alanya med skandinaviske rådgivere. Det betyder, at du kan gennemgå alt fra budget og områdevalg til udlejning og administration på et sprog, du er tryg ved, og at der altid er nogen til stede efter købet.",
      "De mest populære områder er Mahmutlar (billigt, gåafstand til havet), Oba (nybyggeri nær hospital og storcenter), Kestel (roligt og strandnært) samt Cleopatra og centrum for dig, der vil have byliv og byens bedste strand.",
    ],
    highlights: [
      { title: "300 soldage", text: "Behagelig sæson fra marts til november." },
      { title: "Fra 75.000 €", text: "Nybyggede et- og toværelses i moderne komplekser." },
      { title: "Kontor i Alanya", text: "Rådgivere på stedet hele året." },
      { title: "Fuld administration", text: "Udlejning, rengøring og skat klares for dig." },
    ],
    sections: [
      {
        heading: "Priser pr. område i Alanya",
        body: "Mahmutlar er bedst for budgetkøbere: etværelses fra 75.000 € og toværelses omkring 95.000–120.000 €. I Oba koster toværelses 110.000–150.000 € og treværelses op til 200.000 €. Cleopatra og Alanya centrum er dyrest med 2.500–3.500 € pr. kvadratmeter, mens Kestel og Kargıcak giver mest areal for pengene med havudsigt fra bakkerne.",
      },
      {
        heading: "Hvad følger med i et moderne kompleks?",
        body: "Nybyggeri leveres normalt med udendørspool og ofte indendørspool, fitness, sauna og tyrkisk bad, legeplads, generator, døgnvagt og parkeringskælder. Køkken, skabe, aircondition og bad er ofte færdiginstalleret, og møbelpakker kan bestilles, så boligen er indflytningsklar.",
      },
      {
        heading: "Udlejning i Alanya",
        body: "Efterspørgslen på korttidsudlejning er høj fra maj til oktober, og flere og flere nordboere lejer langtid om vinteren. En strandnær toværelses giver typisk 6–8 procent i bruttoafkast. Vi ordner turistudlejningstilladelse, annoncering, gæstemodtagelse og regnskab.",
      },
    ],
    faq: [
      {
        question: "Hvad koster en lejlighed i Alanya?",
        answer:
          "En nybygget etværelses starter omkring 75.000 €, toværelses koster 95.000–160.000 €, og treværelses med havudsigt 160.000–250.000 € afhængigt af område.",
      },
      {
        question: "Hvilket område i Alanya passer bedst til danskere?",
        answer:
          "Mahmutlar og Oba er mest populære på grund af pris, service og nærhed til havet. Cleopatra passer til dig, der vil bo centralt ved byens bedste strand.",
      },
      {
        question: "Kan jeg leje min lejlighed ud?",
        answer:
          "Ja, med turistudlejningstilladelse. Vi skaffer tilladelsen og håndterer udlejning, rengøring og skatteindberetning via vores lokale team.",
      },
      {
        question: "Hvor lang tid tager købet?",
        answer:
          "Normalt to til seks uger fra reservation til registreret TAPU. Hele handlen kan gennemføres med fuldmagt.",
      },
    ],
    ctaTitle: "Vil du se lejligheder i Alanya?",
    ctaText: "Vores kontor i Alanya arrangerer fremvisningstur, lufthavnstransport og ophold.",
    ctaButton: "Book fremvisning",
    listingsTitle: "Lejligheder til salg i Alanya",
    listingsCta: "Se alle boliger i Alanya",
    listingsPath: "/antalya",
    relatedLabel: "Læs mere",
  },
  {
    locale: "da",
    slug: "villa-bali",
    locationFilter: "bali",
    primaryKeyword: "villa bali",
    keywords: ["villa bali", "købe villa på bali", "hus til salg bali", "investere på bali"],
    title: "Villa Bali Til Salg | Køb Villa med Pool på Bali",
    description:
      "Villa på Bali til salg fra 180.000 €. Poolvillaer i Canggu, Ubud og Uluwatu med 10–15 % afkast og fuld udlejningsadministration.",
    h1: "Villa på Bali til salg – poolvillaer med højt afkast",
    heroSubtitle: "Nybyggede villaer i Canggu, Seminyak, Ubud og Uluwatu med administration.",
    intro: [
      "Bali er det nye yndlingsmarked for nordiske investorer. En nybygget villa med to soveværelser og privat pool koster fra cirka 180.000 €, mens en villa med fire soveværelser i Canggu eller Uluwatu ligger på 350.000–600.000 €. Lejeafkastet er exceptionelt: 10–15 procent brutto på korttidsudlejning med over seks millioner internationale besøgende om året.",
      "Vores kontor på Bali håndterer hele handlen: juridisk kontrol af grunden, notar (PPAT), byggetilladelse, byggetilsyn og udlejningsadministration efter overtagelsen.",
      "Udenlandske købere ejer normalt via leasehold på 25–30 år med forlængelsesret eller via Hak Pakai/PT PMA til langsigtet eller selskabsejet ejerskab. Vi gennemgår, hvilken struktur der passer til dit formål.",
    ],
    highlights: [
      { title: "10–15 % afkast", text: "Korttidsudlejning året rundt til internationale gæster." },
      { title: "Fra 180.000 €", text: "Nybygget poolvilla med to soveværelser." },
      { title: "Eget kontor", text: "Future Homes er til stede på Bali." },
      { title: "Nøglefærdigt", text: "Design, byggeri, møblering og udlejning i én pakke." },
    ],
    sections: [
      {
        heading: "Områder og priser på Bali",
        body: "Canggu og Berawa har den højeste udlejningsgrad med priser på 300.000–600.000 € for villaer med tre til fire soveværelser. Uluwatu og Bingin giver havudsigt til lavere kvadratmeterpris, mens Ubud passer til grønne omgivelser og wellnessgæster med villaer fra 180.000 €. Sanur og Nusa Dua er roligere familieområder med stabil langtidsudlejning.",
      },
      {
        heading: "Ejerformer for udlændinge",
        body: "Leasehold er mest udbredt: du lejer grunden i 25–30 år med aftalt forlængelse – enkelt, hurtigt og let at videresælge. Hak Pakai giver brugsret til udlændinge med opholdstilladelse. Vil du drive kommerciel udlejning, oprettes et indonesisk selskab (PT PMA). Alle muligheder gennemgås af vores notar, før depositum betales.",
      },
      {
        heading: "Afkast og administration",
        body: "En velbeliggende villa med to soveværelser i Canggu udlejes for 150–250 € pr. nat med 70–85 procents belægning. Efter administrationshonorar og driftsomkostninger giver det typisk 10–15 procent i nettoafkast. Vi håndterer markedsføring på Airbnb og Booking, gæstemodtagelse, rengøring, pool og vedligehold.",
      },
    ],
    faq: [
      {
        question: "Kan udlændinge købe villa på Bali?",
        answer:
          "Ja, men ikke som indonesisk fuld ejendomsret. De mest almindelige strukturer er leasehold på 25–30 år med forlængelse, Hak Pakai eller ejerskab via et indonesisk selskab (PT PMA).",
      },
      {
        question: "Hvad koster en villa på Bali?",
        answer:
          "En nybygget villa med to soveværelser og pool starter omkring 180.000 €, mens tre til fire soveværelser i Canggu og Uluwatu koster 300.000–600.000 €.",
      },
      {
        question: "Hvor højt er afkastet?",
        answer:
          "Korttidsudlejning i Canggu giver typisk 10–15 procent i årligt afkast efter administrationsomkostninger, afhængigt af beliggenhed, størrelse og belægning.",
      },
      {
        question: "Står I for udlejningen?",
        answer:
          "Ja. Vores Bali-kontor tilbyder fuld administration med annoncering, gæstemodtagelse, rengøring, vedligehold og månedlig rapportering.",
      },
    ],
    ctaTitle: "Vil du eje en villa på Bali?",
    ctaText: "Få vores aktuelle villaliste med pris, afkast og ejerform.",
    ctaButton: "Kontakt os",
    listingsTitle: "Villaer til salg på Bali",
    listingsCta: "Se alle boliger på Bali",
    listingsPath: "/bali",
    relatedLabel: "Læs mere",
  },
  {
    locale: "da",
    slug: "lejlighed-dubai",
    locationFilter: "dubai",
    primaryKeyword: "lejlighed dubai",
    keywords: ["lejlighed dubai", "købe lejlighed i dubai", "bolig dubai", "investere i dubai ejendom"],
    title: "Lejlighed Dubai Til Salg | Køb Bolig Skattefrit",
    description:
      "Køb lejlighed i Dubai fra 190.000 €. 0 % ejendomsskat, 6–9 % lejeafkast, betalingsplan og golden visa – skandinavisk rådgivning på stedet.",
    h1: "Lejlighed i Dubai til salg – skattefrit afkast",
    heroSubtitle: "Nybyggeri i Dubai Marina, Business Bay, JVC og Dubai Creek Harbour med betalingsplan.",
    intro: [
      "Dubai er verdens mest rentable storbymarked for boliginvestorer: ingen ejendomsskat, ingen skat på lejeindtægter og et lejeafkast på 6–9 procent. En lejlighed i Dubai koster fra cirka 190.000 € for en studio i JVC, mens en toværelses i Dubai Marina eller Business Bay ligger på 380.000–650.000 €.",
      "Nybyggeri sælges oftest med betalingsplan: 20 procent i depositum, resten under byggeriet og 30–40 procent ved overtagelse. Dermed kommer du ind på markedet med relativt lidt egenkapital.",
      "En investering fra 2 millioner AED (cirka 500.000 €) giver ret til at søge Golden Visa – ti års fornybar opholdstilladelse for dig og familien.",
    ],
    highlights: [
      { title: "0 % skat", text: "Ingen ejendomsskat og ingen skat på lejeindtægter." },
      { title: "6–9 % afkast", text: "Blandt verdens højeste for storbyboliger." },
      { title: "Betalingsplan", text: "Fra 20 % depositum og resten under byggeriet." },
      { title: "Golden Visa", text: "Ti års opholdstilladelse fra 2 millioner AED." },
    ],
    sections: [
      {
        heading: "Priser og områder i Dubai",
        body: "JVC og Dubai Sports City er indgangsmarkedet med studios fra 190.000 € og toværelses omkring 280.000 €. Business Bay og Dubai Creek Harbour ligger i mellemsegmentet med toværelses på 380.000–550.000 €, mens Dubai Marina, Downtown og Palm Jumeirah er premium med 5.000–12.000 € pr. kvadratmeter. Det højeste lejeafkast findes i JVC, Arjan og Dubai South.",
      },
      {
        heading: "Sådan køber du som udenlandsk statsborger",
        body: "Udlændinge kan eje fast ejendom med fuld ejendomsret (freehold) i udpegede områder, hvilket omfatter stort set alt nybyggeri, der sælges internationalt. Købet registreres hos Dubai Land Department mod 4 procent i gebyr. Færdige boliger overdrages på få dage, og vi håndterer hele processen inklusive bankkonto og Golden Visa.",
      },
      {
        heading: "Udlejning og administration",
        body: "Dubai har et stort lejemarked af udenlandske medarbejdere og en stærk turistsektor. Korttidsudlejning giver den højeste indtægt, men kræver licens, mens årlig udlejning giver stabilt og passivt afkast. Vores partner i Dubai håndterer kontrakter, lejere, vedligehold og rapportering.",
      },
    ],
    faq: [
      {
        question: "Kan danskere eje lejlighed i Dubai?",
        answer: "Ja. I freehold-områder kan udenlandske statsborgere eje boligen fuldt ud uden lokal partner.",
      },
      {
        question: "Hvad koster en lejlighed i Dubai?",
        answer:
          "Studios starter omkring 190.000 € i JVC, toværelses i Business Bay koster 380.000–550.000 €, og Marina/Downtown ligger højere afhængigt af etage og udsigt.",
      },
      {
        question: "Betaler jeg skat af lejeindtægterne?",
        answer:
          "Dubai opkræver ikke skat af lejeindtægter eller ejendom. Du kan dog være skattepligtig i Danmark – afklar det med din rådgiver.",
      },
      {
        question: "Hvordan fungerer Golden Visa?",
        answer:
          "En ejendomsinvestering fra 2 millioner AED giver ret til at søge ti års fornybar opholdstilladelse, som også omfatter ægtefælle og børn.",
      },
    ],
    ctaTitle: "Vil du investere i Dubai?",
    ctaText: "Få en aktuel projektliste med betalingsplaner og forventet afkast.",
    ctaButton: "Kontakt os",
    listingsTitle: "Lejligheder til salg i Dubai",
    listingsCta: "Se alle boliger i Dubai",
    listingsPath: "/dubai",
    relatedLabel: "Læs mere",
  },
];

export const getNordicPage = (locale: string, slug: string) =>
  NORDIC_LANDING_PAGES.find((p) => p.locale === locale && p.slug === slug);

/** Locale-prefixed paths, used by the sitemap. */
export const nordicLandingPaths = () =>
  NORDIC_LANDING_PAGES.map((p) => `/${p.locale}/${p.slug}`);


export { nordicAlternates } from "./nordicLandingIndex";
