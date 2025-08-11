-- First restore the complete content_sections structure with all testimonials
UPDATE website_content 
SET 
  content_sections = '[
    {
      "type": "hero",
      "title": "Future Homes",
      "subtitle": "Your Future in Real Estate",
      "cta_text": "Search Property",
      "cta_link": "/properties",
      "background_image": "/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png"
    },
    {
      "type": "search_form",
      "title": "Find Your Perfect Property",
      "description": "Search our extensive database of premium properties"
    },
    {
      "type": "before_after",
      "title": "Before & After",
      "description": "See the transformation of our premium properties",
      "before_image": "https://futurehomesturkey.com/lovable-uploads/670d6b8d-5bd7-4807-9c91-6546e0ff5219.png",
      "after_image": "https://futurehomesturkey.com/lovable-uploads/9537b0b1-89b0-4c63-ae02-494c98caab5d.png"
    },
    {
      "type": "destinations",
      "title": "Explore Destinations",
      "description": "Discover premium properties in the world''s most desirable locations",
      "destinations": [
        {
          "name": "Antalya",
          "description": "Turkish Riviera Paradise",
          "property_count": "45+ Properties",
          "link": "/antalya"
        },
        {
          "name": "Dubai", 
          "description": "Modern Metropolis",
          "property_count": "38+ Properties",
          "link": "/dubai"
        },
        {
          "name": "Mersin",
          "description": "Mediterranean Coastal", 
          "property_count": "25+ Properties",
          "link": "/mersin"
        },
        {
          "name": "Cyprus",
          "description": "Island Paradise",
          "property_count": "32+ Properties", 
          "link": "/cyprus"
        }
      ]
    },
    {
      "type": "premium_properties",
      "title": "Premium Properties",
      "subtitle": "Discover your dream home from our exclusive collection",
      "description": "Explore our handpicked selection of luxury properties across Turkey, Dubai, Cyprus, and France. Each property offers unique features and exceptional value for your investment."
    },
    {
      "type": "testimonials",
      "title": "What Our Clients Say",
      "description": "Hear from satisfied property owners worldwide",
      "testimonials": [
        {
          "name": "Maher Mare",
          "role": "Property Owner",
          "text": "I am very happy with Ali Karan and Future Homes for the sales I did in Antalya. Definitely recommend this company."
        },
        {
          "name": "Elham Ahmadi Farsangi", 
          "role": "Multiple Property Owner",
          "text": "I have bought 3 apartments from Ali Karan and Future Homes, I am very satisfied with their professional service and the help I got even after the sale was done. I have received my 3 title deeds and I am a happy customer."
        },
        {
          "name": "Pro Fast",
          "role": "Real Estate Investor", 
          "text": "Very professional approach. A young company with great ambitions that works hard to ensure that the customer goes through a secure real estate transaction. They focus on long-term relationships."
        },
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
      ]
    },
    {
      "type": "contact_info",
      "title": "Get in Touch",
      "phone": "+90 552 303 27 50",
      "email": "info@futurehomesturkey.com",
      "description": "Your trusted partner for international property investment"
    }
  ]'::jsonb,
  updated_at = now()
WHERE page_slug = 'homepage';