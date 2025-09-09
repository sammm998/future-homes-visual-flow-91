-- Phase 1: Remove all duplicate prevention triggers first
DROP TRIGGER IF EXISTS prevent_property_duplicates_trigger ON public.properties;
DROP TRIGGER IF EXISTS prevent_bulk_property_inserts_trigger ON public.properties;  
DROP TRIGGER IF EXISTS prevent_bulk_property_inserts ON public.properties;  -- Alternative name
DROP TRIGGER IF EXISTS monitor_bulk_updates_trigger ON public.properties;

-- Phase 2: Remove duplicate prevention functions with CASCADE to handle any remaining dependencies
DROP FUNCTION IF EXISTS public.prevent_property_duplicates() CASCADE;
DROP FUNCTION IF EXISTS public.prevent_bulk_property_inserts() CASCADE;

-- Log the cleanup for verification
DO $$
BEGIN
  RAISE LOG 'Duplicate prevention system removed - all triggers and functions dropped successfully';
END
$$;