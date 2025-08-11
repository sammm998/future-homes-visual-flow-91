-- Add 8 more real testimonials to the existing testimonials array
UPDATE website_content 
SET 
  content_sections = jsonb_set(
    content_sections,
    '{5,testimonials}',
    content_sections->'5'->'testimonials' || '[
      {
        "name": "Muhammad Umar",
        "role": "Property Investor",
        "text": "Ali Karan is a man of his words! The energy he has for work and the dedication he gives to his clients is amazing. We are always amazed by his efforts! Definitely recommended to everyone."
      },
      {
        "name": "Olga Aldabbagh", 
        "role": "First-time Buyer",
        "text": "We bought an apartment through Future Homes. Wonderful service. Big thanks to everyone in the team, very satisfied! Highly recommended."
      },
      {
        "name": "Zaid Mohanad",
        "role": "Property Owner", 
        "text": "I bought an apartment in Avsallar through Ali. A very nice and helpful guy who can obviously fix everything! Highly recommended."
      },
      {
        "name": "Amir Salman",
        "role": "Customer",
        "text": "Very skilled and kind realtor, bought apartment through them. If you want to buy an apartment, contact Ali Karan at Future Homes."
      },
      {
        "name": "Hanie Aghdasi",
        "role": "Property Owner",
        "text": "I bought apartment from Future Homes and I thank all of the team and especially Ali Karan who was with me before and after the sale. I recommend this company."
      },
      {
        "name": "Cuneyt",
        "role": "Property Investor", 
        "text": "I would like to thank Future Homes from here, they helped me a lot, especially the owner (Mr Ali) and his team Tolga and Bariş, they were always there for me, thank you."
      },
      {
        "name": "Hanan Aldalawi",
        "role": "Customer - Dubai",
        "text": "I bought an apartment through Future Homes with the help of the best Ali. I received wonderful service. Thank you Ali for excellent service and patience. I can warmly recommend buying from Future Homes through Ali."
      },
      {
        "name": "Milan Mitic",
        "role": "Local Guide - Serbia", 
        "text": "I wanted to buy a property in Konyaalti when I accidentally came to Future homes and was delighted with their professionalism. I think this property is just the beginning."
      }
    ]'::jsonb
  ),
  updated_at = now()
WHERE page_slug = 'homepage';