import { useQuery } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery } from '@/lib/supabase-enhanced';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

export const useProperty = (id: string) => {
  const { isOnline } = useConnectionStatus();
  
  const { data: rawProperty, isLoading: loading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Property ID is required');
      }
      
      return await resilientQuery(async () => {
        let dbProperty: any = null;
        let dbError: any = null;

        // Try to find by ref_no first
        const { data: refProperty, error: refError } = await enhancedSupabase
          .from('properties')
          .select('*')
          .eq('ref_no', id)
          .eq('is_active', true)
          .maybeSingle();

        if (!refError && refProperty) {
          dbProperty = refProperty;
        } else {
          // If not found by ref_no, try by UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(id)) {
            const { data: uuidProperty, error: uuidError } = await enhancedSupabase
              .from('properties')
              .select('*')
              .eq('id', id)
              .eq('is_active', true)
              .maybeSingle();
            
            dbProperty = uuidProperty;
            dbError = uuidError;
          }
        }

        if (dbError) {
          throw dbError;
        }

        if (!dbProperty) {
          return null;
        }

      // Transform the database property to expected format
      // Parse the facilities array and convert to clean format
      let features: string[] = [];
      if (dbProperty.property_facilities && Array.isArray(dbProperty.property_facilities)) {
        features = dbProperty.property_facilities;
      } else if (typeof dbProperty.facilities === 'string') {
        features = dbProperty.facilities.split(',').map((f: string) => f.trim());
      }
      
      // Clean up features - remove duplicates and empty values
      features = [...new Set(features.filter((f: string) => f && f.trim()))];

      // Parse property images
      let images: string[] = [];
      if (dbProperty.property_images && Array.isArray(dbProperty.property_images)) {
        images = dbProperty.property_images;
      }
      if (dbProperty.property_image) {
        images = [dbProperty.property_image, ...images];
      }

      // Parse pricing from apartment_types (prioritized)
      let pricing: any[] = [];
      if (dbProperty.apartment_types) {
        try {
          const apartmentTypes = typeof dbProperty.apartment_types === 'string' 
            ? JSON.parse(dbProperty.apartment_types)
            : dbProperty.apartment_types;
          
          if (Array.isArray(apartmentTypes) && apartmentTypes.length > 0) {
            pricing = apartmentTypes.map((apt: any) => ({
              type: apt.type ? `${apt.type} Apartment` : 'Apartment',
              size: apt.size ? `${apt.size}m²` : '',
              price: apt.price ? `€${apt.price.toLocaleString('en-US')}` : ''
            }));
          }
        } catch (error) {
          console.warn('Failed to parse apartment_types:', error);
        }
      }

      return {
        ...dbProperty,
        images,
        features,
        pricing,
        refNo: dbProperty.ref_no,
        buildingComplete: dbProperty.building_complete_date,
        area: dbProperty.sizes_m2,
        distanceToAirport: dbProperty.distance_to_airport_km,
        distanceToBeach: dbProperty.distance_to_beach_km,
        agent: {
          name: dbProperty.agent_name,
          phone: dbProperty.agent_phone_number,
          id: dbProperty.agent_id
        },
        image: images[0] || dbProperty.property_image
      };
      }, 3, 2000); // 3 retries with 2s base delay
    },
    enabled: !!id,
    retry: 2, // Reduced since resilientQuery handles retries
    retryDelay: 5000,
    networkMode: 'offlineFirst',
    staleTime: 15 * 60 * 1000, // Increased to 15 minutes for UAE users
    gcTime: 30 * 60 * 1000, // Increased to 30 minutes
  });

  return {
    property: rawProperty,
    loading,
    error: error?.message
  };
};