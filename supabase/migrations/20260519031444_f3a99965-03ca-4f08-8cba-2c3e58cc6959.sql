DELETE FROM course_modules WHERE course_id IN (SELECT id FROM courses WHERE country_code IN ('dubai','cyprus','bali','spain','greece'));

-- Reusable per-country context, then a single template insert
CREATE TEMP TABLE _ctx (cc text PRIMARY KEY, currency text, freehold text, tax_intro text, fees text, yield_text text, risk text);
INSERT INTO _ctx VALUES
('dubai','AED (pegged to USD ~3.67)','Foreigners may buy freehold in designated areas (Dubai Marina, Downtown, Palm Jumeirah, JVC, Business Bay, etc.).','Dubai has no annual property tax, no capital-gains tax and no personal income tax on rental income.','DLD transfer fee (4%), Oqood/registration (~AED 4,000), agency (2%) and a 5% VAT on commercial only.','5–9% gross long-term, 8–12% short-term in prime tourist zones.','Off-plan delivery risk and oversupply in some sub-markets.'),
('cyprus','Euro (EUR)','EU buyers have full freedom; non-EU buyers need Council of Ministers approval (usually granted) and may own one residence + land up to 4,014 m².','No inheritance tax; rental income is taxed via personal income tax with a 20% exemption on gross.','Transfer fees 1.5–4% (50% discount on new builds with VAT), VAT 19% (reduced 5% for primary residence under conditions), stamp duty 0.15–0.20%.','4–6% long-term in Limassol and Paphos; higher in tourist-rental zones.','Title-deed delays from developers and Turkish-Cypriot title issues in the north — stick to government-issued title in the Republic.'),
('bali','Indonesian Rupiah (IDR)','Foreigners cannot hold freehold (Hak Milik). Use Hak Pakai (Right to Use, up to 80 years) or Leasehold (Hak Sewa, typically 25–30 years renewable). Nominee structures are illegal and risky.','Rental income for non-residents is taxed at 20% withholding; tourist villas can also be subject to local hotel/restaurant (PB1) tax of 10%.','Notary 1%, BPHTB transfer tax 5% (for leasehold conversions), agent 5%.','10–15% gross for managed short-term villas in Canggu/Uluwatu; 4–6% for long-term residential.','Zoning (green/yellow/red), illegal STR licensing crackdowns, and currency volatility.'),
('spain','Euro (EUR)','Foreigners have full freehold ownership rights. NIE number required before purchase.','Non-resident rental income is taxed at 24% (19% for EU/EEA with deductible expenses). IBI annual property tax 0.4–1.1% of cadastral value.','Transfer tax (ITP) 6–10% on resale, VAT 10% + stamp 1.5% on new builds, notary & registry ~1–2%.','4–7% long-term in Costa del Sol and Valencia; 6–10% short-term where licences are allowed.','Tightening short-term-rental licensing in Barcelona and Mallorca; community fees can be high.'),
('greece','Euro (EUR)','Foreigners have full freehold rights. AFM tax number required. Golden Visa available from €250,000 (€500,000 in prime zones since 2023).','Rental income taxed 15–45% progressive; ENFIA annual property tax based on size and zone.','Transfer tax 3.09%, notary ~1.2%, legal 1–2%, agency 2%.','4–6% long-term in Athens; 7–10% short-term in islands and the Athens Riviera.','Bureaucracy, slow title transfers and new STR registration rules.');

-- Module 1: Market Overview
INSERT INTO course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published)
SELECT c.id, 'market-overview', 'Module 1: Market Overview',
'Why this market — demand drivers, prices and where international buyers focus.',
format($body$<h2>Why this market</h2>
<p>Understanding the macro picture is the first step before signing anything. This module gives you the lay of the land: who is buying, where prices are going, and what makes this market different from your home country.</p>
<h3>Demand drivers</h3>
<ul>
  <li>Tourism volumes and direct flight connectivity</li>
  <li>Residency and visa programmes attracting capital</li>
  <li>Local population growth and urbanisation</li>
  <li>Currency: <strong>%s</strong> and how it affects your purchasing power</li>
</ul>
<h3>Where international buyers focus</h3>
<p>Most foreign capital concentrates in a small number of districts. Liquidity (your ability to resell) is much higher there, even if yields look lower on paper. We will map these hotspots and explain the trade-off between prime, emerging and frontier areas.</p>
<h3>Pricing baseline</h3>
<p>Before viewing properties, anchor yourself to a per-square-metre price in each district. This single number will save you from overpaying.</p>$body$, x.currency),
jsonb_build_array(
  'Map 3–5 districts that match your strategy before viewing.',
  'Anchor every offer to a per-square-metre price.',
  'Currency exposure matters: ' || x.currency || '.',
  'Liquidity beats yield for first-time foreign buyers.',
  'Tourism and visa flows are leading indicators of price.'
),
'[{"q":"What should you anchor every offer to?","options":["Asking price","Per-square-metre district price","Seller refusal","Bank valuation only"],"answer":1,"explanation":"District price per m² is the single most useful sanity check."},{"q":"Why prefer prime districts as a first-time foreign buyer?","options":["Higher yield","Better resale liquidity","Lower taxes","Smaller deposits"],"answer":1,"explanation":"Liquidity reduces the risk of being stuck with a property you cannot exit."},{"q":"Tourism volumes are best treated as:","options":["Noise","A leading indicator of demand","Irrelevant","A reason to avoid the market"],"answer":1,"explanation":"Visitor flows precede rental demand and short-term-rental yields."},{"q":"Per-m² pricing helps you:","options":["Inflate the price","Sanity-check the price","Skip due diligence","Avoid lawyers"],"answer":1,"explanation":"It is the fastest way to spot overpaying."}]'::jsonb,
1, true
FROM courses c JOIN _ctx x ON x.cc = c.country_code
WHERE c.country_code IN ('dubai','cyprus','bali','spain','greece');

-- Module 2: Legal Framework
INSERT INTO course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published)
SELECT c.id, 'legal-ownership', 'Module 2: Legal Framework & Foreign Ownership',
'What foreigners can and cannot own, and how to structure title safely.',
format($body$<h2>Can a foreigner buy here?</h2>
<p>%s</p>
<h3>Title structures</h3>
<ul>
  <li>Personal name vs. company holding</li>
  <li>Joint ownership and inheritance implications</li>
  <li>Power of attorney when buying remotely</li>
</ul>
<h3>Title verification</h3>
<p>Always verify the title is clean: no mortgages, no encumbrances, no pending litigation, and that the seller is the registered owner. An independent lawyer (not the seller''s lawyer, not the agent''s lawyer) should run this check before you transfer any money.</p>
<h3>Red flags</h3>
<p>Walk away if anyone pressures you to skip title checks, pay in cash, or sign documents in a language you cannot read without a sworn translator.</p>$body$, x.freehold),
jsonb_build_array(
  'Use an independent lawyer, never the seller''s.',
  'Verify title is clean before paying any deposit.',
  'Understand restrictions on foreign ownership in this market.',
  'Decide personal vs. company ownership early — it affects tax.',
  'If buying remotely, use a notarised, limited power of attorney.'
),
'[{"q":"Who should run your title check?","options":["The seller lawyer","The agent lawyer","Your own independent lawyer","Nobody"],"answer":2,"explanation":"Independence prevents conflicts of interest."},{"q":"A red flag is:","options":["A signed contract","Pressure to skip title checks","A bank transfer","An itemised invoice"],"answer":1,"explanation":"Legitimate transactions never require shortcuts."},{"q":"Ownership structure (personal vs company) primarily affects:","options":["The colour of the deed","Tax and inheritance treatment","Agent commission","Notary fee"],"answer":1,"explanation":"Structure drives long-term tax outcomes."},{"q":"For a remote purchase use:","options":["A full unlimited POA","A notarised limited POA","No POA","An email"],"answer":1,"explanation":"Always limit a POA to the specific transaction."}]'::jsonb,
2, true
FROM courses c JOIN _ctx x ON x.cc = c.country_code
WHERE c.country_code IN ('dubai','cyprus','bali','spain','greece');

-- Module 3: Taxes & Costs
INSERT INTO course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published)
SELECT c.id, 'taxes-and-costs', 'Module 3: Taxes, Fees & Holding Costs',
'Total cost of ownership: upfront fees, annual taxes and rental-income tax.',
format($body$<h2>Upfront transaction costs</h2>
<p>%s</p>
<h3>Ongoing taxes</h3>
<p>%s</p>
<h3>Holding costs</h3>
<ul>
  <li>Community / HOA fees</li>
  <li>Utilities and maintenance reserves</li>
  <li>Property management (8–20%% of rental income)</li>
  <li>Insurance</li>
</ul>
<h3>Build your true-cost model</h3>
<p>The right way to evaluate a deal is net yield after all costs, not gross yield. Compare any two properties on a like-for-like basis.</p>$body$, x.fees, x.tax_intro),
'["Always quote yield on a NET basis.","Budget 8–12% on top of the price for transaction costs.","Annual property and rental-income taxes vary widely — model them.","Property management eats 8–20% of gross rent.","Insurance and maintenance reserves are not optional."]'::jsonb,
'[{"q":"You should evaluate deals on:","options":["Gross yield","Net yield after all costs","Asking price","Promised yield"],"answer":1,"explanation":"Gross yield ignores the costs that actually determine your return."},{"q":"Typical buffer for transaction costs:","options":["1–2%","8–12%","25%","50%"],"answer":1,"explanation":"Fees, taxes and legal add up fast."},{"q":"Property management usually costs:","options":["0%","8–20% of gross rent","50% of net rent","€100/year flat"],"answer":1,"explanation":"Industry standard for full-service."},{"q":"Maintenance reserves are:","options":["Optional","Mandatory in your model","Paid by the agent","Always tax deductible"],"answer":1,"explanation":"Skipping reserves understates true cost."}]'::jsonb,
3, true
FROM courses c JOIN _ctx x ON x.cc = c.country_code
WHERE c.country_code IN ('dubai','cyprus','bali','spain','greece');

-- Module 4: Financing & Currency
INSERT INTO course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published)
SELECT c.id, 'financing-and-currency', 'Module 4: Financing & Currency Strategy',
'Local mortgages, developer payment plans and how to hedge FX risk.',
format($body$<h2>Can you get a local mortgage?</h2>
<p>Foreign-buyer mortgages exist in most of these markets but come with higher rates, lower loan-to-values (50–70%%) and stricter documentation than domestic loans. Always get a pre-approval before you sign a reservation.</p>
<h3>Developer payment plans</h3>
<p>Off-plan developers often offer staged payment plans (30/40/30, 1%% per month). These are interest-free finance — useful, but only if delivery risk is acceptable.</p>
<h3>Currency strategy</h3>
<p>If your income is in a different currency from <strong>%s</strong>, you carry FX risk on every future payment and on the eventual sale. Use forward contracts or staged conversions for large transfers.</p>
<h3>Cash vs. leverage</h3>
<p>Leverage amplifies both yield and risk. For first-time buyers in a new market, lower leverage reduces stress and exit pressure.</p>$body$, x.currency),
'["Get mortgage pre-approval BEFORE reserving.","Foreign-buyer LTVs are typically 50–70%.","Off-plan payment plans are interest-free leverage — but carry delivery risk.","FX brokers beat retail banks on large transfers.","Lower leverage = lower stress in your first foreign deal."]'::jsonb,
'[{"q":"Typical foreign-buyer LTV is:","options":["95%","80–90%","50–70%","100%"],"answer":2,"explanation":"Foreign buyers get lower LTVs than locals."},{"q":"A developer 30/40/30 plan is:","options":["A scam","Interest-free staged finance","A mortgage","A tax"],"answer":1,"explanation":"It spreads payments over construction."},{"q":"For large FX transfers use:","options":["A retail bank without comparing","An FX broker after comparing","Cash in a suitcase","Crypto only"],"answer":1,"explanation":"FX brokers usually beat bank spreads."},{"q":"Mortgage pre-approval should happen:","options":["After signing","Before reserving","After completion","Never"],"answer":1,"explanation":"Prevents losing your reservation deposit."}]'::jsonb,
4, true
FROM courses c JOIN _ctx x ON x.cc = c.country_code
WHERE c.country_code IN ('dubai','cyprus','bali','spain','greece');

-- Module 5: Buying Process
INSERT INTO course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published)
SELECT c.id, 'buying-process', 'Module 5: The Buying Process Step-by-Step',
'From reservation to title transfer: the exact sequence and what can go wrong.',
$body$<h2>The standard sequence</h2>
<ol>
  <li><strong>Reservation</strong> — small deposit (1–5%) takes the property off market.</li>
  <li><strong>Due diligence</strong> — lawyer checks title, planning and debts.</li>
  <li><strong>Preliminary contract</strong> — 10–30% deposit, terms locked.</li>
  <li><strong>Final deed / completion</strong> — balance paid, title transferred at the notary/land registry.</li>
  <li><strong>Registration</strong> — your name on the official title register.</li>
</ol>
<h3>Timeline</h3>
<p>From reservation to title typically takes 4–12 weeks for resale, and the construction period plus 4–8 weeks for off-plan.</p>
<h3>What can go wrong</h3>
<ul>
  <li>Hidden debts attached to the property</li>
  <li>Wrong square-meterage on the deed</li>
  <li>Developer delays without penalty clauses</li>
  <li>Funds stuck in transfer because of compliance checks</li>
</ul>
<p>Insist on penalty clauses for late delivery, and never release final payment until you hold the registered title.</p>$body$,
'["Reservation → DD → Preliminary → Completion → Registration.","Never release final payment without registered title.","Insist on late-delivery penalty clauses for off-plan.","Verify the deeded m² matches the marketed m².","Allow 4–12 weeks from reservation for resale."]'::jsonb,
'[{"q":"Reservation deposit is typically:","options":["1–5%","30%","50%","100%"],"answer":0,"explanation":"Small deposits take a property off the market."},{"q":"Final payment should only be released:","options":["At reservation","After DD","Against registered title","Before any contract"],"answer":2,"explanation":"Title transfer protects you."},{"q":"For off-plan, insist on:","options":["Verbal promises","Late-delivery penalties","No contract","Cash only"],"answer":1,"explanation":"Penalties align developer incentives with your timeline."},{"q":"Resale title typically transfers within:","options":["1 day","4–12 weeks","2 years","Never"],"answer":1,"explanation":"Normal range across these markets."}]'::jsonb,
5, true
FROM courses c
WHERE c.country_code IN ('dubai','cyprus','bali','spain','greece');

-- Module 6: Yield, Exit & Mistakes
INSERT INTO course_modules (course_id, slug, title, summary, body_html, key_takeaways, quiz, order_index, is_published)
SELECT c.id, 'rental-yield-exit', 'Module 6: Rental Yield, Exit & Common Mistakes',
'What to realistically expect from rent, how to exit, and the mistakes to avoid.',
format($body$<h2>Realistic yields</h2>
<p>%s Gross numbers are easy to inflate — what matters is net yield after management, voids, tax and maintenance.</p>
<h3>Exit strategy</h3>
<p>Plan your exit before you buy. Three viable exits:</p>
<ul>
  <li>Sell to another foreign buyer (needs prime liquidity)</li>
  <li>Sell to a local (needs reasonable local price level)</li>
  <li>Hold and refinance, extracting equity</li>
</ul>
<h3>Common mistakes</h3>
<ol>
  <li>Buying on emotion during a viewing trip</li>
  <li>Skipping the independent lawyer to "save money"</li>
  <li>Believing developer rental guarantees at face value</li>
  <li>Ignoring service charges and maintenance reserves</li>
  <li>Underestimating FX risk on a 10-year hold</li>
</ol>
<h3>Main risk in this market</h3>
<p>%s</p>$body$, x.yield_text, x.risk),
jsonb_build_array(
  'Plan your exit BEFORE you buy.',
  'Net yield, not gross, is the right metric.',
  'Treat developer rental guarantees with scepticism.',
  'Service charges and FX are silent yield killers.',
  'Main local risk to manage: ' || x.risk
),
'[{"q":"You should plan your exit:","options":["Never","After 5 years","Before buying","Only if forced to sell"],"answer":2,"explanation":"Exit planning shapes which property you buy."},{"q":"Developer rental guarantees should be:","options":["Trusted blindly","Treated with scepticism","Always declined","Never offered"],"answer":1,"explanation":"Often baked into an inflated price."},{"q":"The right yield metric is:","options":["Gross yield","Net yield after all costs","Asking yield","Verbal yield"],"answer":1,"explanation":"Only net yield reflects actual return."},{"q":"Silent yield killers include:","options":["Tenants paying on time","Service charges and FX","Low rates","High occupancy"],"answer":1,"explanation":"They erode returns over long holds."}]'::jsonb,
6, true
FROM courses c JOIN _ctx x ON x.cc = c.country_code
WHERE c.country_code IN ('dubai','cyprus','bali','spain','greece');

DROP TABLE _ctx;