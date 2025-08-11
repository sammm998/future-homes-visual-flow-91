-- Create code_snippets table for custom code injection
CREATE TABLE public.code_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code_type TEXT NOT NULL CHECK (code_type IN ('javascript', 'html', 'css', 'php')),
  code_content TEXT NOT NULL,
  injection_location TEXT NOT NULL CHECK (injection_location IN ('header', 'body_start', 'body_end')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Only admins can manage code snippets" 
ON public.code_snippets 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'samanthamoore55@gmail.com'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_code_snippets_updated_at
  BEFORE UPDATE ON public.code_snippets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();