-- First, let's see what duplicate slugs we have and handle them
-- Delete duplicate entries keeping only the most recent one
WITH duplicate_slugs AS (
  SELECT slug, 
         array_agg(id ORDER BY created_at DESC) as ids
  FROM blog_posts 
  WHERE slug IN (
    SELECT slug 
    FROM blog_posts 
    GROUP BY slug 
    HAVING COUNT(*) > 1
  )
  GROUP BY slug
),
ids_to_delete AS (
  SELECT unnest(ids[2:]) as id_to_delete
  FROM duplicate_slugs
)
DELETE FROM blog_posts 
WHERE id IN (SELECT id_to_delete FROM ids_to_delete);

-- Now update the remaining blog posts to remove -tr suffix
UPDATE blog_posts SET slug = REPLACE(slug, '-tr', '') WHERE slug LIKE '%-tr';

-- Add the purchase expenses article
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  published,
  featured_image,
  created_at,
  updated_at
) VALUES (
  'Property Purchase Expenses in Turkey',
  'property-purchase-expenses-turkey',
  'Complete guide to all expenses when buying property in Turkey: title deed tax, translation costs, insurance, and more.',
  '# Property Purchase Expenses in Turkey: Complete Cost Breakdown

When purchasing property in Turkey, it''s essential to understand all the associated costs beyond the property price. This comprehensive guide breaks down every expense you''ll encounter during the property buying process.

## Title Deed Tax (Tapu Harcı) - 4%

The most significant expense after the property price is the **title deed tax**, which is **4% of the property''s declared value**. This tax is split equally between the buyer and seller (2% each), but in practice, buyers often cover the full amount.

**Example:** For a €200,000 property, the total title deed tax would be €8,000 (with buyer typically paying €4,000-€8,000).

## Document Translation and Notarization

All foreign documents must be translated into Turkish by certified translators and notarized:

- **Passport translation:** €30-50
- **Power of attorney translation:** €40-60
- **Marriage certificate (if applicable):** €30-50
- **Apostille and notarization:** €50-100 per document

**Total translation costs:** €150-300

## Legal and Professional Services

### Lawyer Fees
- **Property lawyer:** 1-2% of property value
- **Due diligence and contract review:** €500-1,500
- **Title deed transfer assistance:** €300-800

### Real Estate Agent Commission
- **Buyer''s agent fee:** 2-3% of property value (if using an agent)

## Insurance Requirements

### Mandatory Earthquake Insurance (DASK)
- **Annual premium:** €50-200 depending on property size and location
- **Required for:** All properties in Turkey
- **Coverage:** Natural disasters including earthquakes

### Optional Property Insurance
- **Comprehensive property insurance:** €200-500 annually
- **Contents insurance:** €100-300 annually

## Government Fees and Taxes

### Military Clearance (if applicable)
- **Fee:** €50-100
- **Required for:** Properties in certain strategic areas

### Municipality Registration
- **Registration fee:** €30-100
- **Environmental tax:** €20-50

## Banking and Financial Costs

### Bank Account Opening
- **Account opening fee:** €50-150
- **Minimum deposit requirement:** €500-1,000

### Money Transfer Fees
- **International wire transfer:** €25-100 per transfer
- **Currency exchange fees:** 0.5-2% of transfer amount

### Mortgage Costs (if applicable)
- **Loan application fee:** €200-500
- **Property valuation:** €300-600
- **Mortgage arrangement fee:** 1-2% of loan amount

## Utility Connections and Deposits

### Electricity Connection
- **Connection fee:** €100-300
- **Security deposit:** €200-500

### Water Connection
- **Connection fee:** €50-150
- **Security deposit:** €100-300

### Gas Connection
- **Connection fee:** €150-400
- **Security deposit:** €200-400

### Internet and Telecommunications
- **Installation fee:** €50-150
- **Equipment costs:** €100-300

## Property Management and Maintenance

### Management Company Fees
- **Monthly fee:** €50-200 for apartments/complexes
- **Includes:** Security, maintenance, common area cleaning

### Property Valuation
- **Independent valuation:** €300-800
- **Required for:** Mortgage applications and some legal processes

## Additional Considerations

### Residency Permit Costs
- **Application fee:** €150-300
- **Document preparation:** €200-500
- **Annual renewal:** €100-200

### Tax Number (Vergi Numarası)
- **Application:** Free
- **Required for:** All property purchases

## Total Estimated Costs

For a **€200,000 property purchase**, expect additional costs of:

- **Minimum scenario:** €15,000-20,000 (7.5-10% of property value)
- **Comprehensive scenario:** €25,000-35,000 (12.5-17.5% of property value)

## Cost Breakdown Summary

| Expense Category | Percentage of Property Value | Fixed Costs |
|------------------|----------------------------|-------------|
| Title Deed Tax | 2-4% | - |
| Legal Services | 1-2% | €800-2,300 |
| Insurance | - | €250-700/year |
| Translations | - | €150-300 |
| Banking & Transfers | 0.5-2% | €275-650 |
| Utilities Setup | - | €500-1,350 |
| Government Fees | - | €100-300 |

## Money-Saving Tips

1. **Negotiate tax sharing:** Try to negotiate the 4% title deed tax split with the seller
2. **Compare exchange rates:** Shop around for the best currency exchange rates
3. **Bundle services:** Some law firms offer package deals for multiple services
4. **Time transfers wisely:** Monitor exchange rates for optimal transfer timing
5. **Use recommended professionals:** Work with established, recommended service providers

## Important Notes

- All costs are estimates and can vary based on property location, value, and service providers
- Some fees are one-time costs, while others (like insurance) are recurring
- Always get written quotes from service providers before proceeding
- Budget an additional 5-10% buffer for unexpected costs

## Conclusion

While the additional costs of buying property in Turkey may seem substantial, they are largely predictable and can be planned for in advance. Working with experienced professionals who understand the Turkish property market will help ensure you''re fully prepared for all associated costs.

For personalized cost estimates based on your specific property purchase, consult with a qualified Turkish property lawyer or real estate professional.',
  true,
  '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png',
  NOW(),
  NOW()
);