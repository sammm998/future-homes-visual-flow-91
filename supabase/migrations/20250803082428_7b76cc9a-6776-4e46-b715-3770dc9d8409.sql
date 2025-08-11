-- Set all image_url to null so placeholder images are used instead of broken external URLs
UPDATE testimonials SET image_url = NULL WHERE image_url LIKE 'https://futurehomesturkey.com%';