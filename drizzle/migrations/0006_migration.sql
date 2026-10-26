CREATE INDEX IF NOT EXISTS property_translations_lang_idx ON public.property_translations (language_code, property_id);
CREATE INDEX IF NOT EXISTS properties_active_created_idx ON public.properties (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_list_idx ON public.blog_posts (language_code, published, created_at DESC) WHERE parent_post_id IS NULL;
CREATE INDEX IF NOT EXISTS property_text_translations_lang_idx ON public.property_text_translations (language_code, property_id);
ANALYZE public.property_translations;
ANALYZE public.properties;
ANALYZE public.blog_posts;