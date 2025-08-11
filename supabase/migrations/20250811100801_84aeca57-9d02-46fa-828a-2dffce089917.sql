-- Enable real-time functionality for properties table
ALTER TABLE public.properties REPLICA IDENTITY FULL;

-- Add the properties table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;