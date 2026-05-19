ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS final_quiz jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS final_pass_threshold integer NOT NULL DEFAULT 70;