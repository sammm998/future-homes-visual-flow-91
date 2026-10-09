# Investment tools, VIP Club and partner program

Six new features in the Midnight Riviera style, available in all 13 languages and built for mobile. Delivered in three phases so each part can be tested and published on its own.

## Phase 1 – Tools that need no login (fastest value)

**1. Property Investment Calculator** (`/investment-calculator`)
- Visitors choose Antalya, Dubai or Bali, or compare all three side by side.
- Inputs: price, down payment, nights rented per year, nightly rate or monthly rent, management fee, and currency.
- Shows purchase costs per country (taxes, registration, legal fees), yearly fees (service charge, property tax, insurance, management), gross and net rental income, monthly net cash flow, and net yield.
- Three scenarios: careful, base and optimistic (occupancy and rent change, plus a vacancy stress test).
- Every result is labelled as an estimate, with a fixed note: "These are calculations, not promises. Check with an adviser."
- Default costs per country are kept in one table so they are easy to update. I will use publicly known rates (e.g. Turkey title deed fee 4 %, Dubai DLD 4 %, Bali notary/tax) and show the source year. You should confirm these with your team before publishing.
- Button: "Send me this calculation" saves the visitor as a lead.

**2. Where Should I Buy?** (`/where-should-i-buy`)
- A 7-question quiz: budget, goal (live, rent out, citizenship, growth), climate, lifestyle, rental focus, risk tolerance, timeline.
- Scores Turkey, Dubai, Northern Cyprus and Bali and shows a ranked result with a short explanation and matching homes.
- Result is unlocked or emailed after name and email, which creates a lead tagged "quiz".

**3. Viewing Trip Planner** (`/viewing-trip`)
- Visitor picks city, dates, budget, property type and bedrooms.
- Suggests a day-by-day plan with 4–8 matching homes from your listings (grouped by area).
- Booking step: contact details, number of travellers, airport pickup wish. Saved as a lead tagged "viewing-trip" (strong buying signal), with the trip shown in the admin lead.

All three are linked from the menu, the homepage and the property pages.

## Phase 2 – Future Homes VIP Club (free membership)

- Sign up / log in with email (and Google).
- Member area `/vip`: saved favourites (heart button on every property card and page), saved searches, and settings.
- **Smart Property Alerts**: a member saves criteria such as "Apartment in Antalya, max 180 000 €, 2 bedrooms, near the sea". When a new or price-reduced home matches, they get an email. WhatsApp only if they tick a consent box.
- Notices about new projects and price changes on favourites.
- "Early access" section showing pre-launch projects that admin marks as VIP-only.
- Admin: list of members, their favourites and alerts — your own database of buyers with documented interest.

## Phase 3 – Partner program

- Public page `/partners` explaining the program, with an application form.
- Admin approves partners and sets their agreed commission.
- Each partner gets a personal link (`?ref=CODE`). Visitors who arrive through it are tagged to that partner for 90 days in every form.
- Partner portal: their registered introductions, status of each (new, viewing, reserved, sold) and agreed commission.
- Terms text with a note that commission must follow local agent and marketing rules — you supply the final legal text.

## Important prerequisite

Your property database only accepts changes from a logged-in admin, and I cannot create new tables in it from here. Phases 2 and 3 (members, favourites, alerts, partners) need new tables. Two options:
- You give me access to run changes on that database (or run the prepared SQL in its dashboard), or
- We store the new member/partner data in Lovable Cloud while properties stay where they are.

Phase 1 only uses the existing lead storage and can start right away. Alert emails also need your verified email sender (currently Resend with info@futurehomesturkey.com).

## Technical details

- Routes: `src/routes/$locale/{investment-calculator,where-should-i-buy,viewing-trip,partners,vip}.tsx` plus non-locale equivalents, each with its own head() metadata; pages built from PublicEditorial primitives.
- Country cost model in `src/data/investmentCostModel.ts`; pure calculation functions in `src/lib/investmentCalc.ts` with unit tests.
- Quiz scoring in `src/lib/whereToBuy.ts`; trip planner queries active, unsold listings via existing hooks.
- Leads via existing `saveLead` server function, extended with `source` values and a JSON `details` payload.
- Phase 2/3 tables: `vip_profiles`, `favorites`, `saved_searches`, `alert_deliveries`, `partners`, `partner_referrals` with RLS (own rows; admins all). Alerts run from a scheduled server route under `/api/public/` that verifies a secret.
- UI strings added to the translation dictionaries for 13 languages, RTL respected.
