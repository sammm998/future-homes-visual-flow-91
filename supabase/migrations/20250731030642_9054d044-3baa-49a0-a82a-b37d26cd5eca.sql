-- Insert all required website content pages
INSERT INTO website_content (page_title, page_slug, meta_description, content_sections) VALUES
('Hem - Future Homes Turkey', 'hem', 'Upptäck ditt drömboende i Turkiet med Future Homes Turkey', '[{"type": "hero", "content": "Välkommen till Future Homes Turkey"}, {"type": "content", "content": "Vi hjälper dig hitta det perfekta boendet i Turkiet."}]'),
('Om Oss - Future Homes Turkey', 'om-oss', 'Lär dig mer om Future Homes Turkey och vårt uppdrag', '[{"type": "content", "content": "Future Homes Turkey är din pålitliga partner för fastigheter i Turkiet."}, {"type": "team", "content": "Vårt erfarna team hjälper dig genom hela processen."}]'),
('Fastigheter i Turkiet', 'fastigheter-turkiet', 'Utforska vårt utbud av fastigheter i Turkiet', '[{"type": "hero", "content": "Fastigheter i Turkiet"}, {"type": "properties", "content": "Hitta din drömfastighet i Turkiet."}]'),
('Fastigheter i Cypern', 'fastigheter-cypern', 'Upptäck våra fastigheter på Cypern', '[{"type": "hero", "content": "Fastigheter på Cypern"}, {"type": "properties", "content": "Utforska våra alternativ på Cypern."}]'),
('Fastigheter i Dubai', 'fastigheter-dubai', 'Lyxfastigheter i Dubai', '[{"type": "hero", "content": "Fastigheter i Dubai"}, {"type": "properties", "content": "Upptäck lyxiga alternativ i Dubai."}]'),
('Fastigheter i Frankrike', 'fastigheter-frankrike', 'Franska fastigheter med Future Homes', '[{"type": "hero", "content": "Fastigheter i Frankrike"}, {"type": "properties", "content": "Hitta ditt hem i Frankrike."}]'),
('Fastigheter i Mersin', 'fastigheter-mersin', 'Upptäck Mersin med Future Homes Turkey', '[{"type": "hero", "content": "Fastigheter i Mersin"}, {"type": "properties", "content": "Utforska Mersin-regionen."}]'),
('Kundberättelser', 'kundberattelser', 'Läs vad våra kunder säger om oss', '[{"type": "testimonials", "content": "Våra nöjda kunder berättar"}, {"type": "reviews", "content": "Läs recensioner från riktiga kunder."}]'),
('Information', 'information', 'Viktig information för fastighetsköpare', '[{"type": "info", "content": "Allt du behöver veta om att köpa fastighet utomlands"}, {"type": "guides", "content": "Användbara guider och tips."}]'),
('Kontakt', 'kontakt', 'Kontakta Future Homes Turkey', '[{"type": "contact", "content": "Kom i kontakt med oss"}, {"type": "form", "content": "Kontaktformulär och kontaktuppgifter."}]'),
('Blog', 'blog', 'Läs våra senaste artiklar och nyheter', '[{"type": "blog", "content": "Senaste nyheterna från fastighetsbranschen"}, {"type": "articles", "content": "Artiklar och guider."}]');

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, published) VALUES
('Guide: Köpa fastighet i Turkiet', 'guide-kopa-fastighet-turkiet', 'En komplett guide för att köpa fastighet i Turkiet som utländsk medborgare.', 'Att köpa fastighet i Turkiet som utländsk medborgare kan verka komplicerat, men med rätt vägledning är det en enkel process...', '/placeholder.svg', true),
('De bästa områdena i Istanbul', 'basta-omradena-istanbul', 'Upptäck de mest attraktiva bostadsområdena i Istanbul.', 'Istanbul erbjuder många fantastiska områden för fastighetsinvestering. Här är våra rekommendationer...', '/placeholder.svg', true),
('Skatteregler för utländska fastighetsägare', 'skatteregler-utlandska-agare', 'Vad du behöver veta om skatter när du äger fastighet i Turkiet.', 'Som utländsk fastighetsägare i Turkiet finns det vissa skatteregler du behöver känna till...', '/placeholder.svg', true),
('Antalya vs Istanbul - Var ska du investera?', 'antalya-vs-istanbul-investering', 'En jämförelse mellan två av Turkiets populäraste städer för fastighetsinvestering.', 'Både Antalya och Istanbul erbjuder fantastiska möjligheter för fastighetsinvestering...', '/placeholder.svg', true),
('Nya trender inom turkisk fastighetsmarknad', 'nya-trender-turkisk-fastighetsmarknad', 'De senaste trenderna som påverkar fastighetsmarknaden i Turkiet.', 'Fastighetsmarknaden i Turkiet utvecklas ständigt. Här är de senaste trenderna...', '/placeholder.svg', true);

-- Insert website media
INSERT INTO website_media (filename, url, alt_text, usage_context) VALUES
('hero-image.jpg', '/placeholder.svg', 'Vacker utsikt över Turkiet', 'Homepage hero section'),
('about-team.jpg', '/placeholder.svg', 'Future Homes Turkey team', 'About page team photo'),
('istanbul-skyline.jpg', '/placeholder.svg', 'Istanbul skyline', 'Istanbul properties page'),
('antalya-beach.jpg', '/placeholder.svg', 'Antalya beach view', 'Antalya properties page'),
('cyprus-villa.jpg', '/placeholder.svg', 'Villa på Cypern', 'Cyprus properties page'),
('dubai-towers.jpg', '/placeholder.svg', 'Dubai skyline', 'Dubai properties page'),
('france-chateau.jpg', '/placeholder.svg', 'Fransk villa', 'France properties page'),
('mersin-coast.jpg', '/placeholder.svg', 'Mersin kustlinje', 'Mersin properties page'),
('testimonial-1.jpg', '/placeholder.svg', 'Nöjd kund', 'Customer testimonials'),
('testimonial-2.jpg', '/placeholder.svg', 'Lycklig familj', 'Customer testimonials');