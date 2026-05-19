
-- Courses tables
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  estimated_minutes INTEGER NOT NULL DEFAULT 30,
  language_code VARCHAR NOT NULL DEFAULT 'en',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body_html TEXT NOT NULL,
  image_url TEXT,
  key_takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
  quiz JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, slug)
);

CREATE INDEX idx_courses_country ON public.courses(country_code);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id, order_index);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone"
  ON public.courses FOR SELECT USING (is_published = true);

CREATE POLICY "Only admins can manage courses"
  ON public.courses FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Course modules are viewable by everyone"
  ON public.course_modules FOR SELECT USING (is_published = true);

CREATE POLICY "Only admins can manage course modules"
  ON public.course_modules FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: 6 courses (one per country), Turkey fully populated; others with intro + 2 placeholder modules
DO $$
DECLARE
  turkey_id UUID := gen_random_uuid();
  dubai_id UUID := gen_random_uuid();
  cyprus_id UUID := gen_random_uuid();
  bali_id UUID := gen_random_uuid();
  spain_id UUID := gen_random_uuid();
  greece_id UUID := gen_random_uuid();
BEGIN
  -- Courses
  INSERT INTO public.courses (id, country_code, slug, title, description, difficulty, estimated_minutes, order_index, hero_image) VALUES
    (turkey_id, 'turkey', 'invest-in-turkey', 'Investing in Turkish Real Estate',
      'A complete, step-by-step pedagogical course on buying property in Turkey: market dynamics, foreign ownership rules, taxes, the purchase process, citizenship by investment, and rental yields.',
      'Beginner', 75, 1, '/courses/turkey/hero.jpg'),
    (dubai_id, 'dubai', 'invest-in-dubai', 'Investing in Dubai Real Estate',
      'Master Dubai property investment: freehold zones, Golden Visa, off-plan vs ready, service charges, and the highest-yielding neighborhoods.',
      'Intermediate', 70, 2, '/courses/dubai/hero.jpg'),
    (cyprus_id, 'cyprus', 'invest-in-cyprus', 'Investing in Cyprus Real Estate',
      'Everything you need to invest in Northern and Southern Cyprus: residency through real estate, title deeds, and coastal hotspots.',
      'Beginner', 60, 3, '/courses/cyprus/hero.jpg'),
    (bali_id, 'bali', 'invest-in-bali', 'Investing in Bali Real Estate',
      'Understand Indonesian land law (Hak Pakai, leasehold, PT PMA), villa returns, and the most investable Bali areas.',
      'Intermediate', 65, 4, '/courses/bali/hero.jpg'),
    (spain_id, 'spain', 'invest-in-spain', 'Investing in Spanish Real Estate',
      'Costa del Sol, Costa Blanca and Balearics: NIE, taxes, mortgages for non-residents and the new Digital Nomad Visa.',
      'Beginner', 60, 5, '/courses/spain/hero.jpg'),
    (greece_id, 'greece', 'invest-in-greece', 'Investing in Greek Real Estate',
      'Greek Golden Visa, island vs mainland, ENFIA tax and short-term rental rules.',
      'Beginner', 55, 6, '/courses/greece/hero.jpg');

  -- Turkey modules (6 full modules with quiz)
  INSERT INTO public.course_modules (course_id, slug, title, summary, body_html, image_url, key_takeaways, quiz, order_index) VALUES
  (turkey_id, 'market-overview',
    'Module 1: The Turkish Property Market',
    'Why Turkey has become one of Europe''s most active real estate destinations.',
    '<p>Turkey sits at the crossroads of Europe and Asia, and its real estate market reflects that strategic position. Over the last decade, Turkey has consistently ranked among the world''s top countries for foreign property sales, with cities like Antalya, Istanbul, and Mersin attracting buyers from over 100 nationalities.</p><h3>Why Turkey?</h3><p>Three structural drivers make Turkey attractive: a young, growing population (median age ~33), the lowest entry price per square metre of any Mediterranean coastline, and consistent currency-driven discounts for foreign buyers holding EUR, USD or GBP. A modern apartment in Antalya costs roughly 1/3 of an equivalent unit on the Spanish Costa del Sol.</p><h3>Where the demand sits</h3><p>Foreign demand concentrates in four areas: <strong>Antalya</strong> (lifestyle and rental yield), <strong>Istanbul</strong> (capital growth and business), <strong>Mersin</strong> (affordability and citizenship), and <strong>Northern Cyprus</strong> (managed by Turkish-Cypriot developers). Each has very different price points, buyer profiles and rental dynamics.</p><h3>Risks to understand</h3><p>Turkey''s lira has historically been volatile, but because foreign buyers transact in hard currency and sell in hard currency, FX risk is largely neutralised at the asset level. The bigger risks are buying in the wrong micro-location and overpaying through unverified agents.</p>',
    '/courses/turkey/module-1.jpg',
    '["Turkey is consistently a global top-5 destination for foreign buyers","Antalya, Istanbul, Mersin dominate foreign demand","Coastal property is among the cheapest in the Mediterranean","FX risk is neutralised when buying and selling in EUR/USD","Micro-location matters more than country-level news"]'::jsonb,
    '[{"q":"Which three Turkish cities attract the most foreign property buyers?","options":["Ankara, Bursa, Konya","Antalya, Istanbul, Mersin","Izmir, Adana, Gaziantep","Trabzon, Samsun, Eskişehir"],"correctIndex":1,"explanation":"Antalya, Istanbul and Mersin together account for the large majority of foreign property sales."},{"q":"What is the main reason FX volatility is largely neutralised for foreign buyers?","options":["The Turkish government fixes the exchange rate for foreigners","Foreigners transact in and exit in hard currency","Property prices are denominated in gold","Banks hedge the lira for free"],"correctIndex":1,"explanation":"Because both the purchase and the eventual sale happen in EUR/USD/GBP, the lira''s movement has limited direct impact on the investor."},{"q":"Compared to the Spanish Costa del Sol, Antalya prices per m² are roughly:","options":["About the same","Around 3x more expensive","About one third","Around 10x more expensive"],"correctIndex":2,"explanation":"Antalya is roughly one third of comparable Spanish coastal pricing."},{"q":"What is typically the biggest practical risk for a foreign buyer?","options":["Turkey''s GDP growth rate","Buying in the wrong micro-location or via an unverified agent","Earthquakes in the Black Sea region","Border tariffs"],"correctIndex":1,"explanation":"Macro fears are usually overstated; the real risks are local — wrong street, wrong developer, wrong agent."}]'::jsonb,
    1),

  (turkey_id, 'legal-ownership',
    'Module 2: Legal Framework & Foreign Ownership',
    'What foreigners can and cannot own, and how title deeds (TAPU) actually work.',
    '<p>Foreigners from over 180 countries can buy property in Turkey under the principle of <em>reciprocity</em>. Ownership is registered through the <strong>TAPU</strong> — the official Turkish title deed issued by the Land Registry (Tapu ve Kadastro).</p><h3>The TAPU is everything</h3><p>The TAPU is the only legally binding proof of ownership. A signed sales contract, a payment receipt, or a developer''s brochure are <strong>not</strong> ownership. Until your name is on the TAPU, you do not own the property. Always insist on TAPU transfer at completion.</p><h3>What you cannot buy</h3><p>Foreigners cannot purchase property in designated military or security zones — but those are clearly mapped and never include any zone where international developers operate. Total foreign ownership in a single district is capped at 10% of the area, which is almost never reached.</p><h3>Power of Attorney (Vekaletname)</h3><p>You don''t need to be physically present to buy. A notarised Power of Attorney lets your lawyer complete the TAPU transfer on your behalf. Use a Turkish lawyer that is independent from the seller.</p><h3>Mandatory checks before TAPU</h3><ul><li>DASK earthquake insurance (mandatory)</li><li>Independent property valuation report (mandatory since 2019)</li><li>Tax number for the buyer (free, takes 30 minutes)</li></ul>',
    '/courses/turkey/module-2.jpg',
    '["TAPU is the only legal proof of ownership","Foreign ownership is allowed under reciprocity from 180+ countries","A signed contract is not the same as a TAPU","Always use a lawyer independent of the seller","DASK insurance and a valuation report are mandatory"]'::jsonb,
    '[{"q":"What is the TAPU?","options":["A type of mortgage","The official Turkish title deed","A property tax","A real-estate brokerage"],"correctIndex":1,"explanation":"The TAPU is the official land-registry title deed, the only legal proof of ownership."},{"q":"What document is mandatory since 2019 before a TAPU transfer?","options":["A bank guarantee","An independent property valuation report","A 10-year warranty","A residence permit"],"correctIndex":1,"explanation":"An independent valuation report is required to prevent over- or under-pricing for tax purposes."},{"q":"If you cannot travel to Turkey for completion, what is the standard solution?","options":["The deal cannot proceed","Use a notarised Power of Attorney for your lawyer","Sign by email","Wait for the consulate to host you"],"correctIndex":1,"explanation":"A notarised vekaletname allows your lawyer to complete the transfer on your behalf."},{"q":"What is DASK?","options":["A bank account type","Mandatory earthquake insurance","A tax exemption","A residence permit"],"correctIndex":1,"explanation":"DASK is the compulsory earthquake insurance for all registered properties."}]'::jsonb,
    2),

  (turkey_id, 'taxes-and-costs',
    'Module 3: Taxes, Fees & Holding Costs',
    'Every cost you will encounter — at purchase, while holding, and on exit.',
    '<p>Foreign buyers consistently underestimate transaction and holding costs. Plan for roughly <strong>6–8% on top of the purchase price</strong> as one-off costs.</p><h3>One-off costs at purchase</h3><ul><li><strong>Title deed fee:</strong> 4% of declared value (often split 2%+2% between buyer and seller, but in practice usually paid in full by the buyer)</li><li><strong>VAT:</strong> 1%, 8% or 18% depending on size & type. Many new-build foreign buyers qualify for <strong>full VAT exemption</strong> (see Module 5)</li><li><strong>Notary, translator, valuation, DASK:</strong> ~€500–€1,200 total</li><li><strong>Lawyer:</strong> typically €1,000–€2,500</li></ul><h3>Annual holding costs</h3><ul><li><strong>Property tax:</strong> 0.1%–0.6% of registered value (residential property in cities is 0.2%)</li><li><strong>Aidat (HOA / site fee):</strong> €30–€150/month depending on amenities</li><li><strong>Utilities subscription fees</strong> at first connection: ~€300</li></ul><h3>On exit</h3><p>Capital gains tax applies only if you sell within <strong>5 years</strong> of purchase, on the gain above an annually indexed allowance. After 5 years, capital gains are <strong>0%</strong>. This is one of the most generous regimes in the Mediterranean.</p>',
    '/courses/turkey/module-3.jpg',
    '["Budget 6–8% on top of the purchase price for transaction costs","New-build foreign buyers often qualify for full VAT exemption","Annual property tax is typically 0.2% of registered value","Capital gains tax drops to 0% after 5 years of ownership","Aidat (HOA) is the single biggest recurring cost"]'::jsonb,
    '[{"q":"Roughly how much should you budget for total one-off transaction costs?","options":["1–2% of price","6–8% of price","15–20% of price","Nothing"],"correctIndex":1,"explanation":"6–8% covers title-deed fee, legal, notary, DASK, valuation and utility connections."},{"q":"After how many years of ownership is capital gains tax 0%?","options":["1 year","3 years","5 years","Never"],"correctIndex":2,"explanation":"After 5 years of ownership, capital gains on resale are exempt from tax."},{"q":"What is the typical annual property tax for a residential city apartment?","options":["0.2%","2%","5%","10%"],"correctIndex":0,"explanation":"Urban residential property is taxed at 0.2% of the registered (not market) value."},{"q":"Which buyers most often qualify for full VAT exemption on new builds?","options":["Turkish citizens","Foreign buyers who hold the property for at least 1 year","Anyone over 65","No one"],"correctIndex":1,"explanation":"Foreign buyers can claim full VAT exemption on a new-build first sale if they hold for at least 1 year and bring foreign currency in."}]'::jsonb,
    3),

  (turkey_id, 'financing-and-currency',
    'Module 4: Financing & Currency Strategy',
    'Cash vs mortgage, FX timing, and how to legally transfer funds.',
    '<p>The Turkish real estate market is dominated by cash buyers, but mortgages for foreigners do exist and have become more competitive.</p><h3>Mortgages for foreigners</h3><p>Several Turkish banks (Garanti BBVA, Yapı Kredi, DenizBank, ICBC) offer EUR or USD mortgages to non-residents. Typical terms:</p><ul><li>LTV: 50% of bank valuation (not purchase price)</li><li>Term: 5–10 years (sometimes 15)</li><li>Rate: 7–9% in EUR (2026 levels)</li><li>Min loan: usually €50,000</li></ul><h3>Bringing money in legally</h3><p>For VAT exemption and Turkish citizenship by investment, you must prove the funds came from abroad. The mechanism is a <strong>Döviz Alım Belgesi (DAB)</strong> — a foreign currency purchase certificate issued by your Turkish bank when you convert the incoming wire to TRY at the time of payment. Without DABs, you lose VAT exemption and CBI eligibility.</p><h3>Currency timing</h3><p>Because you''ll pay the seller in TRY, the exchange rate at the moment of conversion matters. Most experienced buyers split the conversion across 2–3 tranches over a few weeks rather than converting the full amount on one day.</p>',
    '/courses/turkey/module-4.jpg',
    '["Foreigners can get EUR/USD mortgages at 50% LTV","Always obtain DAB certificates for each incoming wire","DABs are required for VAT exemption and citizenship","Split currency conversions to reduce timing risk","Cash purchases are still the norm"]'::jsonb,
    '[{"q":"What does a DAB certificate prove?","options":["You paid your taxes","Foreign currency was brought in and converted to TRY","Your earthquake insurance is valid","Your TAPU is registered"],"correctIndex":1,"explanation":"The Döviz Alım Belgesi proves the funds originated abroad — required for VAT exemption and CBI."},{"q":"What is the typical maximum loan-to-value for non-resident mortgages?","options":["20%","50%","80%","100%"],"correctIndex":1,"explanation":"50% of the bank''s valuation is standard. Banks lend on valuation, not on purchase price."},{"q":"Why do experienced buyers split currency conversions?","options":["To pay less tax","To reduce timing risk on the exchange rate","Because banks require it","Because TAPU offices demand it"],"correctIndex":1,"explanation":"Splitting tranches averages out short-term FX volatility."},{"q":"Without DABs, what do you lose?","options":["Only the right to vote","VAT exemption and Citizenship by Investment eligibility","The right to own a car","Nothing important"],"correctIndex":1,"explanation":"DABs are the audit trail; without them, the major foreign-buyer incentives don''t apply."}]'::jsonb,
    4),

  (turkey_id, 'buying-process',
    'Module 5: The Buying Process Step-by-Step',
    'From first viewing to TAPU collection — and Turkish citizenship by investment.',
    '<p>A typical foreign property purchase in Turkey takes <strong>2–6 weeks</strong> from offer to TAPU, depending on whether you''re paying cash or financing.</p><h3>The standard 9 steps</h3><ol><li>Property selection & inspection (in person or virtual tour)</li><li>Reservation deposit (€2,000–€5,000, refundable subject to contract)</li><li>Get Turkish tax number (free, 30 minutes at the tax office)</li><li>Open a Turkish bank account</li><li>Sign sales contract (in Turkish + your language)</li><li>Wire funds, obtain DAB certificate</li><li>Independent valuation report ordered</li><li>Apply for TAPU at the Land Registry</li><li>Collect TAPU — you are now the owner</li></ol><h3>Turkish Citizenship by Investment</h3><p>Buy property worth <strong>$400,000 or more</strong> and hold it for at least <strong>3 years</strong> → you and your family (spouse + children under 18) qualify for Turkish citizenship and a Turkish passport. The passport gives visa-free or visa-on-arrival access to ~110 countries.</p><h3>What can go wrong</h3><p>The single most common problem is buying off-plan from an unlicensed developer. Always verify the developer''s <em>iskan</em> (occupancy permit) track record on past projects and only release final payment against TAPU transfer.</p>',
    '/courses/turkey/module-5.jpg',
    '["The full process takes 2–6 weeks for a cash buyer","Tax number and Turkish bank account are mandatory","$400k investment held 3 years = Turkish citizenship for the family","Always verify a developer''s past iskan record","Never release the full price before TAPU transfer"]'::jsonb,
    '[{"q":"What is the minimum property investment for Turkish Citizenship by Investment?","options":["$100,000","$250,000","$400,000","$1,000,000"],"correctIndex":2,"explanation":"$400,000 is the current threshold and the property must be held for at least 3 years."},{"q":"How long must you hold the property to keep your CBI passport?","options":["1 year","3 years","5 years","Forever"],"correctIndex":1,"explanation":"You must hold the property for 3 years from the TAPU date."},{"q":"Roughly how many countries does a Turkish passport allow visa-free or visa-on-arrival entry to?","options":["~30","~60","~110","~190"],"correctIndex":2,"explanation":"Around 110 countries depending on the year and bilateral agreements."},{"q":"What is the safest payment milestone to release the final purchase amount?","options":["At signing the preliminary contract","Against TAPU transfer","When the building is 50% complete","On reservation"],"correctIndex":1,"explanation":"Never release the final amount before your name is on the TAPU."}]'::jsonb,
    5),

  (turkey_id, 'rental-yield-exit',
    'Module 6: Rental Yield, Exit & Common Mistakes',
    'Realistic income expectations, exit strategy, and the mistakes that cost foreign buyers the most.',
    '<p>Foreign investors typically over-estimate gross rental yield and under-estimate vacancy. Here are realistic, market-tested numbers for 2026.</p><h3>Realistic gross yields</h3><ul><li><strong>Antalya long-term:</strong> 5–7%</li><li><strong>Antalya short-term (Konyaaltı, Lara):</strong> 8–11% gross, 4–6% net after management & vacancy</li><li><strong>Istanbul long-term:</strong> 4–6%</li><li><strong>Mersin:</strong> 6–9%</li></ul><h3>Short-term vs long-term</h3><p>Short-term holiday lets earn more per night but require active management, deeper furniture spend (€8k–€15k for a 2-bed) and pay 18% VAT on rental income. Long-term tenants pay less but bring stability and almost zero management cost.</p><h3>Exiting the property</h3><p>Resale to other foreigners is liquid in Antalya and Istanbul, slower in Mersin. Work with the same agent network that sells to foreign buyers — listing only on Turkish-language portals will not reach international buyers.</p><h3>The 5 most common mistakes</h3><ol><li>Trusting verbal commitments instead of TAPU</li><li>Paying full price before TAPU transfer</li><li>Skipping the independent lawyer</li><li>Ignoring aidat (HOA) costs in yield calculations</li><li>Underestimating exit time — plan 6–12 months for resale</li></ol>',
    '/courses/turkey/module-6.jpg',
    '["Realistic gross long-term yield in Antalya is 5–7%","Short-term gross yields are higher but net yields are similar","Furniture for a short-let 2-bed is €8k–€15k","Sell through agencies that already reach foreign buyers","Plan 6–12 months for a clean resale exit"]'::jsonb,
    '[{"q":"What is a realistic gross long-term rental yield in Antalya?","options":["1–2%","5–7%","12–15%","20%+"],"correctIndex":1,"explanation":"5–7% gross is realistic; advertised 10%+ figures usually ignore vacancy and management."},{"q":"Which cost do investors most often forget when calculating net yield?","options":["Electricity","Aidat (HOA / site fee)","Internet","Window cleaning"],"correctIndex":1,"explanation":"Aidat can quietly take 10–20% off net yield and is frequently omitted from sales-side projections."},{"q":"What is a realistic timeline to plan for a resale exit?","options":["1 week","1 month","6–12 months","5 years"],"correctIndex":2,"explanation":"Even in Antalya and Istanbul, a clean foreign-buyer resale typically takes 6–12 months."},{"q":"Why list with foreign-buyer agencies rather than only Turkish portals?","options":["Turkish portals charge more","International demand drives premium pricing and faster sales","It''s a legal requirement","Local buyers are not allowed to buy resales"],"correctIndex":1,"explanation":"Foreign buyers pay premiums and are reached only through agencies that market internationally."}]'::jsonb,
    6);

  -- Placeholder intro modules for the other 5 countries
  INSERT INTO public.course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published) VALUES
    (dubai_id, 'coming-soon', 'Coming Soon', 'Full Dubai course launching shortly.',
      '<p>Our complete Dubai investment course is being finalised. In the meantime, contact our team for personalised guidance on Dubai property investment.</p>',
      '[]'::jsonb, '[]'::jsonb, 1, true),
    (cyprus_id, 'coming-soon', 'Coming Soon', 'Full Cyprus course launching shortly.',
      '<p>Our complete Cyprus investment course is being finalised. In the meantime, contact our team for personalised guidance.</p>',
      '[]'::jsonb, '[]'::jsonb, 1, true),
    (bali_id, 'coming-soon', 'Coming Soon', 'Full Bali course launching shortly.',
      '<p>Our complete Bali investment course is being finalised. In the meantime, contact our team for personalised guidance on Indonesian property law.</p>',
      '[]'::jsonb, '[]'::jsonb, 1, true),
    (spain_id, 'coming-soon', 'Coming Soon', 'Full Spain course launching shortly.',
      '<p>Our complete Spain investment course is being finalised. In the meantime, contact our team for personalised guidance.</p>',
      '[]'::jsonb, '[]'::jsonb, 1, true),
    (greece_id, 'coming-soon', 'Coming Soon', 'Full Greece course launching shortly.',
      '<p>Our complete Greece investment course is being finalised. In the meantime, contact our team for personalised guidance on the Greek Golden Visa.</p>',
      '[]'::jsonb, '[]'::jsonb, 1, true);
END $$;
