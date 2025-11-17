-- Update homepage title from "Turkey" to "International"
UPDATE website_content 
SET 
  page_title = 'Home - Future Homes International',
  meta_description = 'Discover your dream home with Future Homes International'
WHERE page_slug = '';