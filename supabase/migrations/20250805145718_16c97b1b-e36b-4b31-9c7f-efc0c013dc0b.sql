-- Create OpenAI translation function
CREATE OR REPLACE FUNCTION translate_text(
  text_to_translate TEXT,
  target_language TEXT DEFAULT 'sv'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This is a placeholder function that will be enhanced with OpenAI integration
  -- For now, return the original text
  RETURN text_to_translate;
END;
$$;