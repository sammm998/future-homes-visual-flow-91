export interface CityLandingConfig {
  /** URL slug, e.g. "alanya-property-for-sale" */
  slug: string;
  /** Matches the start of a property's `location` field */
  locationMatch: string[];
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  highlights: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
  /** Related internal links (slug + label) for internal linking */
  related: { to: string; label: string }[];
  country: string;
}

export const cityLandingPages: CityLandingConfig[] = [
  {
    slug: 'alanya-property-for-sale',
    locationMatch: ['alanya'],
    country: 'Turkey',
    title: 'Property for Sale in Alanya, Turkey',
    metaDescription:
      'Apartments and villas for sale in Alanya, Turkey. Browse current listings from Future Homes International with prices, floor plans and local buying guidance.',
    h1: 'Property for Sale in Alanya',
    intro:
      'Alanya sits on Turkey\u2019s Mediterranean coast, about two hours east of Antalya airport. It is one of the most established markets for international buyers in Turkey, with a mix of beachfront apartment complexes, city-centre resale flats and hillside villas. Below are the Alanya properties currently listed with Future Homes International.',
    keywords: [
      'property for sale in alanya',
      'alanya apartments for sale',
      'alanya villas for sale',
      'buy property alanya turkey',
    ],
    highlights: [
      {
        heading: 'Popular districts',
        body: 'Mahmutlar, Oba, Kestel, Cikcilli, Tosmur and Kargicak are the areas most often chosen by international buyers, each with a different balance of price, beach distance and local amenities.',
      },
      {
        heading: 'What buyers get',
        body: 'Most new Alanya complexes are built with shared pools, fitness rooms, sauna and 24/7 security, and are sold fully finished with fitted kitchens.',
      },
      {
        heading: 'Buying process',
        body: 'Foreign buyers can own property freehold in Alanya. The purchase runs through a title deed (TAPU) transfer at the land registry, and requires a valuation report and a Turkish tax number.',
      },
    ],
    faq: [
      {
        question: 'Can foreigners buy property in Alanya?',
        answer:
          'Yes. Foreign nationals can buy freehold property in Alanya, subject to standard Turkish restrictions on military zones and total area limits. Our team handles the title deed process on your behalf.',
      },
      {
        question: 'Which Alanya district should I choose?',
        answer:
          'Mahmutlar and Kestel are popular for value and beach access, Oba and Cikcilli for proximity to the city centre and hospitals, and Kargicak for sea-view villas. Our advisors will match districts to your budget and intended use.',
      },
      {
        question: 'Do properties in Alanya come furnished?',
        answer:
          'It varies by listing. New-build apartments are usually delivered with a fitted kitchen and bathrooms; furniture packages are optional. Each listing page states what is included.',
      },
    ],
    related: [
      { to: '/antalya', label: 'Property in Antalya' },
      { to: '/property-for-sale-in-turkey', label: 'All property for sale in Turkey' },
      { to: '/turkish-citizenship-by-investment', label: 'Turkish citizenship by investment' },
    ],
  },
  {
    slug: 'belek-property-for-sale',
    locationMatch: ['belek'],
    country: 'Turkey',
    title: 'Property for Sale in Belek, Turkey',
    metaDescription:
      'Golf resort apartments and villas for sale in Belek, Antalya. See current Belek listings, prices and buying advice from Future Homes International.',
    h1: 'Property for Sale in Belek',
    intro:
      'Belek is Antalya\u2019s golf and resort district, roughly 30 minutes from Antalya airport. Demand here is driven by championship golf courses, five-star hotels and long sandy beaches, which supports short-term rental use alongside holiday ownership.',
    keywords: ['property for sale in belek', 'belek villas for sale', 'belek golf property', 'antalya belek real estate'],
    highlights: [
      { heading: 'Why Belek', body: 'A concentration of golf courses, resort infrastructure and protected pine forest and beach make Belek one of Antalya\u2019s premium addresses.' },
      { heading: 'Property types', body: 'Detached golf villas, low-rise resort apartments and branded residences dominate the Belek market.' },
      { heading: 'Rental use', body: 'Belek\u2019s tourism season is long, which makes short-term rental a common strategy for owners who do not live in Turkey full time.' },
    ],
    faq: [
      { question: 'Is Belek good for rental income?', answer: 'Belek has a long tourist season driven by golf and resort travel, so many owners let their property short-term when they are not using it. Achievable rates depend on the property, season and management arrangement.' },
      { question: 'How far is Belek from Antalya airport?', answer: 'Belek is approximately 30-40 minutes by car from Antalya airport.' },
    ],
    related: [
      { to: '/antalya', label: 'Property in Antalya' },
      { to: '/luxury-villas-in-turkey', label: 'Luxury villas in Turkey' },
      { to: '/property-for-sale-in-turkey', label: 'All property for sale in Turkey' },
    ],
  },
  {
    slug: 'kalkan-property-for-sale',
    locationMatch: ['kalkan'],
    country: 'Turkey',
    title: 'Property for Sale in Kalkan, Turkey',
    metaDescription:
      'Sea-view villas and apartments for sale in Kalkan on the Turkish Riviera. Current Kalkan listings and local buying guidance from Future Homes International.',
    h1: 'Property for Sale in Kalkan',
    intro:
      'Kalkan is a small hillside town on the Lycian coast, known for infinity-pool villas overlooking the bay and a low-rise, boutique building style. It attracts buyers looking for privacy and views rather than large resort complexes.',
    keywords: ['property for sale in kalkan', 'kalkan villas for sale', 'kalkan sea view villa', 'turkish riviera property'],
    highlights: [
      { heading: 'Villa-led market', body: 'Kalkan is dominated by private villas with pools and sea views rather than high-rise apartment blocks.' },
      { heading: 'Building character', body: 'Local planning keeps developments low-rise, which preserves views across the bay.' },
      { heading: 'Season', body: 'Kalkan is a seasonal resort town, busiest from spring to autumn.' },
    ],
    faq: [
      { question: 'What kind of property is available in Kalkan?', answer: 'Mostly detached and semi-detached villas with private pools and sea views, plus a smaller number of apartments and duplexes.' },
      { question: 'Which airport serves Kalkan?', answer: 'Dalaman is the closest major airport, with Antalya airport as the second option.' },
    ],
    related: [
      { to: '/luxury-villas-in-turkey', label: 'Luxury villas in Turkey' },
      { to: '/property-for-sale-in-turkey', label: 'All property for sale in Turkey' },
    ],
  },
  {
    slug: 'dubai-off-plan-property',
    locationMatch: ['dubai'],
    country: 'United Arab Emirates',
    title: 'Off-Plan Property for Sale in Dubai',
    metaDescription:
      'Off-plan apartments and villas in Dubai with developer payment plans. Browse current Dubai projects and get buying guidance from Future Homes International.',
    h1: 'Off-Plan Property in Dubai',
    intro:
      'Off-plan means buying directly from the developer before or during construction, normally against a staged payment plan. In Dubai these purchases are registered with the Dubai Land Department and buyer funds go into a project escrow account.',
    keywords: ['off plan property dubai', 'dubai off plan apartments', 'buy property dubai', 'dubai payment plan property'],
    highlights: [
      { heading: 'Payment plans', body: 'Developers typically split the price across construction milestones, with a balance due on handover. Terms vary by project.' },
      { heading: 'Escrow protection', body: 'Off-plan buyer payments in Dubai are paid into a regulated project escrow account overseen by the Dubai Land Department.' },
      { heading: 'Freehold areas', body: 'Foreign buyers can own freehold in Dubai\u2019s designated freehold areas, including Dubai Marina, Downtown, Business Bay and Jumeirah Village Circle.' },
    ],
    faq: [
      { question: 'Can foreigners buy off-plan property in Dubai?', answer: 'Yes, in designated freehold areas foreign nationals can buy off-plan property in their own name and register it with the Dubai Land Department.' },
      { question: 'What deposit is needed for off-plan in Dubai?', answer: 'Initial down payments commonly start around 10-20% of the price, followed by staged construction payments. Exact terms are set by each developer and stated in the project payment plan.' },
    ],
    related: [
      { to: '/dubai', label: 'All Dubai property' },
      { to: '/off-plan-property-turkey', label: 'Off-plan property in Turkey' },
    ],
  },
  {
    slug: 'bali-villas-for-sale',
    locationMatch: ['bali', 'canggu', 'ubud', 'seminyak', 'uluwatu'],
    country: 'Indonesia',
    title: 'Villas for Sale in Bali, Indonesia',
    metaDescription:
      'Villas and investment property for sale in Bali. Browse current Canggu, Ubud, Seminyak and Uluwatu listings with guidance from Future Homes International.',
    h1: 'Villas for Sale in Bali',
    intro:
      'Bali attracts buyers looking for rental-focused villas in areas such as Canggu, Seminyak, Ubud and Uluwatu. Ownership in Indonesia works differently from Turkey or the UAE, so structure matters as much as the property itself.',
    keywords: ['villas for sale bali', 'property for sale bali', 'canggu villa for sale', 'bali investment property'],
    highlights: [
      { heading: 'Ownership structures', body: 'Foreign buyers typically hold Bali property through leasehold (Hak Sewa) or a right-to-use/right-to-build structure rather than outright freehold. We explain the structure for each listing.' },
      { heading: 'Popular areas', body: 'Canggu and Seminyak for lifestyle and rental demand, Ubud for inland nature, Uluwatu for clifftop and surf locations.' },
      { heading: 'Local office', body: 'Future Homes International has an office in Bali, so viewings and paperwork are handled on the ground.' },
    ],
    faq: [
      { question: 'Can foreigners own property in Bali?', answer: 'Foreign nationals generally cannot hold freehold (Hak Milik) land in Indonesia. Purchases are usually structured as leasehold or right-to-use, and we set out the exact structure and term for each property.' },
      { question: 'Do you have an office in Bali?', answer: 'Yes. Our Bali office handles viewings, due diligence and after-sales support locally.' },
    ],
    related: [
      { to: '/bali', label: 'All Bali property' },
      { to: '/contact-us', label: 'Talk to our Bali office' },
    ],
  },
];

export const getCityLandingConfig = (slug: string) =>
  cityLandingPages.find((c) => c.slug === slug);
