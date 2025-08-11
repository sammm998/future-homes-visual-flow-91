-- First, let's insert the admin user manually into auth.users table (this needs to be done via SQL)
-- We'll create a function to handle this since we can't directly insert into auth.users

-- Insert website content pages
INSERT INTO public.website_content (page_slug, page_title, meta_description, content_sections) VALUES
('home', 'Future Homes - Premium Real Estate', 'Your trusted partner in finding the perfect property', 
 '[{"type": "hero", "content": "Welcome to Future Homes"}, {"type": "about", "content": "Your premium real estate partner"}]'),
('about', 'About Us - Future Homes', 'Meet our experienced team of real estate professionals', 
 '[{"type": "team", "content": "Our experienced team"}, {"type": "values", "content": "Our values and mission"}]'),
('properties', 'Properties - Future Homes', 'Browse our extensive collection of premium properties', 
 '[{"type": "search", "content": "Search properties"}, {"type": "featured", "content": "Featured properties"}]'),
('contact', 'Contact Us - Future Homes', 'Get in touch with our real estate experts', 
 '[{"type": "form", "content": "Contact form"}, {"type": "info", "content": "Contact information"}]'),
('antalya', 'Antalya Properties - Future Homes', 'Discover luxury properties in Antalya, Turkey', 
 '[{"type": "location", "content": "Antalya properties"}, {"type": "listings", "content": "Property listings"}]'),
('cyprus', 'Cyprus Properties - Future Homes', 'Explore premium properties in Cyprus', 
 '[{"type": "location", "content": "Cyprus properties"}, {"type": "listings", "content": "Property listings"}]'),
('dubai', 'Dubai Properties - Future Homes', 'Luxury real estate opportunities in Dubai', 
 '[{"type": "location", "content": "Dubai properties"}, {"type": "listings", "content": "Property listings"}]'),
('mersin', 'Mersin Properties - Future Homes', 'Quality properties in Mersin, Turkey', 
 '[{"type": "location", "content": "Mersin properties"}, {"type": "listings", "content": "Property listings"}]'),
('france', 'France Properties - Future Homes', 'Elegant properties in France', 
 '[{"type": "location", "content": "France properties"}, {"type": "listings", "content": "Property listings"}]');

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image, published) VALUES
('Your Guide to Buying Property in Turkey', 'guide-buying-property-turkey', 
 'Everything you need to know about purchasing real estate in Turkey', 
 'Comprehensive guide covering legal requirements, financing options, and investment opportunities in Turkish real estate market.',
 '/images/blog/turkey-guide.jpg', true),
('Top 10 Investment Opportunities in Dubai Real Estate', 'top-investment-dubai-real-estate',
 'Discover the best investment opportunities in Dubai''s booming property market',
 'Analysis of the most promising areas and property types for investment in Dubai, including ROI projections and market trends.',
 '/images/blog/dubai-investment.jpg', true),
('Cyprus Property Market Trends 2024', 'cyprus-property-market-trends-2024',
 'Latest trends and insights from the Cyprus real estate market',
 'Detailed analysis of current market conditions, price trends, and future outlook for Cyprus property investments.',
 '/images/blog/cyprus-trends.jpg', true);

-- Note: For the admin user, you'll need to sign up through the Supabase Auth UI first with email: admin@futurehomes.com and password: Alifuture12!
-- The RLS policies are already set to allow admin access to all tables