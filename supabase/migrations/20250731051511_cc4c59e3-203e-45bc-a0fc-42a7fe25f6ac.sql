-- Restore complete homepage content with all testimonials included
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
        },
        {
          "name": "Olga (Local Guide)",
          "role": "First-time International Buyer",
          "text": "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly. Advisor Elena is super knowledgeable, friendly and listened to every need we had. Great customer service, trustworthy company. Highly recommend to anyone looking to buy in Turkey."
        },
        {
          "name": "Cahide Celepli",
          "role": "Property Owner",
          "text": "Thanks for a great cooperation. It has been a pleasure to get to know you at Future Homes. Tolga and Ali have been very service-oriented with good communication. Highly recommend!"
        },
        {
          "name": "Amro",
          "role": "Demanding Customer",
          "text": "I have a confession to make! I am the one who gave those guys the hardest time in their career so far. I asked all kind of questions; I made all sorts of changes to the sale contract, and I disturbed them even on their weekends and holidays. But they were patient and professional throughout. Great service!"
        },
        {
          "name": "Ib Awn",
          "role": "Property Owner", 
          "text": "Best Ali also helped after I bought an apartment from Future homes. I got help with contact with sellers of white goods, furniture, etc. He was available throughout my stay when I was going to furnish the apartment. Once again A BIG THANK YOU TO ALI AT FUTURE HOMES."
        },
        {
          "name": "Sushil Ran",
          "role": "Property Investor",
          "text": "My brother had purchased a property with this company, and due to his experience and service that he had received, he had recommended that I should also purchase as Mr. Karam Ali was very knowledgeable and had guided us throughout the process."
        },
        {
          "name": "Dollyz Martinez",
          "role": "Customer",
          "text": "Tolga was a very professional person who takes good care of every single thing for this matter and myself. I recommend them strongly."
        },
        {
          "name": "Lena (Local Guide)",
          "role": "Airport Area Buyer",
          "text": "I definitely recommend it. I consider myself very lucky that I found this company. I was looking for an apartment in Antalya near the airport. Real estate agents Barish and Tolga did their job quickly and thoroughly."
        },
        {
          "name": "Jens Zierke",
          "role": "German Customer",
          "text": "I felt really good, professional from the beginning and the process was perfect. Buying real estate is a matter of trust, and I found that trust here. As a German, I can recommend this company."
        },
        {
          "name": "Florence Manga",
          "role": "International Remote Buyer",
          "text": "Future Homes is an agency that I warmly recommend! The advisors are very competent! I especially want to thank Selen who accompanied us throughout our project and thanks to whom we were able to get a property even remotely. Had a fantastic experience with Future Homes Antalya."
        },
        {
          "name": "Christian Friessnegg",
          "role": "Norwegian Customer", 
          "text": "We were going to buy an apartment in Turkey and came into contact with Future Homes. There we talked to Ali Karan. We had many questions that needed to be answered before we decided to buy an apartment. Ali followed us all the way and answered all our questions professionally."
        },
        {
          "name": "Belhadef Sofiane",
          "role": "French Customer",
          "text": "Recently we bought an apartment with Future Home, which is an excellent agency that I warmly recommend, especially Mr. Tolga and his colleague Mr. Baris who gave us good advice and helped throughout the process. Thank you so much."
        },
        {
          "name": "Sarkar Hassan",
          "role": "Norwegian Customer",
          "text": "Incredibly good service and very good follow-up. Safe and efficient team! Kim S. and Ali Karan are warmly recommended!"
        },
        {
          "name": "Diane Manga",
          "role": "French Remote Buyer",
          "text": "We recently decided to buy an apartment in Turkey, we contacted Future Homes, so we came into contact with Selen who speaks French, we were able to make our purchase remotely. We are very satisfied, the apartment is magnificent, thanks to the entire Future Homes team."
        },
        {
          "name": "Antoine Pereira",
          "role": "French Customer",
          "text": "After a vacation in Turkey I contacted Future Homes in Antalya. I was taken care of in French by Selen Ayyildiz, a top professional from start to finish, always smiling and passionate about her job. I highly recommend!"
        },
        {
          "name": "Rayana",
          "role": "German Customer",
          "text": "Top service! I can recommend Ali Karan to you with a clear conscience. He is very serious, honest and helpful."
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