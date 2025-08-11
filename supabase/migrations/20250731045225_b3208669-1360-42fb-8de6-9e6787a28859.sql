-- Update homepage content with real Future Homes website content
UPDATE website_content 
SET 
  page_title = 'Future Homes - Your Future in Real Estate',
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
  meta_description = 'Find your dream property in Turkey, Dubai, Cyprus and France with Future Homes - Your trusted partner for international real estate investment',
  updated_at = now()
WHERE page_slug = 'homepage';

-- Update about page with real company information
UPDATE website_content 
SET 
  page_title = 'About Future Homes Turkey - Your Trusted Real Estate Partner',
  content_sections = '[
    {
      "type": "hero",
      "title": "About Future Homes",
      "subtitle": "Your trusted partner for international property investment"
    },
    {
      "type": "company_info",
      "title": "Who We Are",
      "description": "Future Homes Turkey is a leading real estate company specializing in premium properties across Turkey, Dubai, Cyprus, and France. With years of experience and a commitment to excellence, we help our clients find their perfect home or investment opportunity."
    },
    {
      "type": "team_highlight",
      "title": "Meet Our Team",
      "description": "Led by Ali Karan and our dedicated team including Tolga and Bariş, we provide professional service and support throughout your property journey."
    },
    {
      "type": "locations",
      "title": "Our Locations",
      "offices": [
        {"name": "Antalya Office", "location": "Turkey"},
        {"name": "Mersin Office", "location": "Turkey"}, 
        {"name": "Dubai Office", "location": "UAE"},
        {"name": "France Office", "location": "France"},
        {"name": "Cyprus Office", "location": "Cyprus"}
      ]
    }
  ]'::jsonb,
  meta_description = 'Learn about Future Homes Turkey - your trusted real estate partner for properties in Turkey, Dubai, Cyprus and France',
  updated_at = now()
WHERE page_slug = 'about';

-- Add blog posts from the website content
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, published) VALUES
('Turkish Citizenship Through Property Investment', 'turkish-citizenship-property-investment', 
'Complete guide to obtaining Turkish citizenship through real estate investment. Learn about the requirements, process, and benefits of becoming a Turkish citizen through property purchase.',
'Complete guide to obtaining Turkish citizenship through real estate investment',
'/placeholder.svg', true),

('The Healthcare System in Turkey', 'healthcare-system-turkey',
'Understanding Turkey''s modern healthcare system and medical facilities for residents and property owners. Comprehensive overview of medical services available.',
'Understanding Turkey''s modern healthcare system and medical facilities for residents and property owners',
'/placeholder.svg', true),

('Complete Guide to Property Purchase Expenses in Turkey', 'property-purchase-expenses-turkey',
'Detailed breakdown of all costs associated with purchasing property in Turkey. From taxes to legal fees, understand all expenses involved.',
'Detailed breakdown of all costs associated with purchasing property in Turkey',
'/placeholder.svg', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  updated_at = now();