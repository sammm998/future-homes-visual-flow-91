-- Add many more real customer testimonials from Google Reviews
UPDATE website_content 
SET 
  content_sections = jsonb_set(
    content_sections::jsonb,
    '{5,testimonials}',
    (content_sections::jsonb->'5'->'testimonials') || '[
      {
        "name": "Olga (Local Guide)",
        "role": "First-time Buyer",
        "text": "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly. Advisor Elena is super knowledgeable, friendly and listened to every need we had. Great customer service, trustworthy company. Highly recommend to anyone looking to buy in Turkey."
      },
      {
        "name": "Cahide Celepli",
        "role": "Property Owner",
        "text": "Thanks for a great cooperation. It has been a pleasure to get to know you at Future Homes. Tolga and Ali have been very service-oriented with good communication. Highly recommend!"
      },
      {
        "name": "Amro",
        "role": "Customer",
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
        "name": "Mithat Tuncay Öcalir", 
        "role": "Property Owner",
        "text": "He was very professional and the company has all the information. He did everything. Thank you so much for everything."
      },
      {
        "name": "Lena (Local Guide)",
        "role": "Property Buyer",
        "text": "I definitely recommend it. I consider myself very lucky that I found this company. I was looking for an apartment in Antalya near the airport. Real estate agents Barish and Tolga did their job quickly and thoroughly."
      },
      {
        "name": "Jens Zierke",
        "role": "German Customer",
        "text": "I felt really good, professional from the beginning and the process was perfect. Buying real estate is a matter of trust, and I found that trust here. As a German, I can recommend this company."
      },
      {
        "name": "Florence Manga",
        "role": "International Buyer",
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
        "role": "Remote Buyer",
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
    ]'::jsonb
  ),
  updated_at = now()
WHERE page_slug = 'homepage';