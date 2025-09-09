-- Phase 1: Remove duplicate prevention triggers
DROP TRIGGER IF EXISTS prevent_property_duplicates_trigger ON public.properties;
DROP TRIGGER IF EXISTS prevent_bulk_property_inserts_trigger ON public.properties;  
DROP TRIGGER IF EXISTS monitor_bulk_updates_trigger ON public.properties;

-- Phase 2: Remove duplicate prevention functions
DROP FUNCTION IF EXISTS public.prevent_property_duplicates();
DROP FUNCTION IF EXISTS public.prevent_bulk_property_inserts();

-- Log the cleanup for verification
DO $$
BEGIN
  RAISE LOG 'Duplicate prevention system removed - triggers and functions dropped successfully';
END
$$;