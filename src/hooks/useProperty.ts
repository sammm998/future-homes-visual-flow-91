import { useQuery } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery } from '@/lib/supabase-enhanced';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { useLocation } from 'react-router-dom';

// Get the appropriate slug column based on language
const getSlugColumn = (lang: string | null): string => {
  if (!lang || lang === 'en') return 'slug';
  const supportedLangs = ['sv', 'tr', 'ar', 'ru', 'no', 'da', 'fa', 'ur'];
  return supportedLangs.includes(lang) ? `slug_${lang}` : 'slug';
};

export const useProperty = (id: string) => {
  const { isOnline } = useConnectionStatus();
  const location = useLocation();
  
  // Get current language from URL
  const searchParams = new URLSearchParams(location.search);
  const lang = searchParams.get('lang');
  
  const { data: rawProperty, isLoading: loading, error } = useQuery({
    queryKey: ['property', id, lang],
    queryFn: async () => {
      if (!id) {
        throw new Error('Property ID is required');
      }
      
      return await resilientQuery(async () => {
        let dbProperty: any = null;

        // Try to find by language-specific slug first
        const slugColumn = getSlugColumn(lang);
        
        if (slugColumn !== 'slug' && lang) {
          // Try language-specific slug - use raw query to avoid type issues
          const { data: langProperty } = await enhancedSupabase
            .from('properties')
            .select('*')
            .filter(slugColumn, 'eq', id)
            .eq('is_active', true)
            .maybeSingle();
          
          if (langProperty) {
            dbProperty = langProperty;
          }
        }

        // Fall back to English slug
        if (!dbProperty) {
          const { data: slugProperty } = await enhancedSupabase
            .from('properties')
            .select('*')
            .eq('slug', id)
            .eq('is_active', true)
            .maybeSingle();

          if (slugProperty) {
            dbProperty = slugProperty;
          }
        }

        // Try ref_no
        if (!dbProperty) {
          const { data: refProperty } = await enhancedSupabase
            .from('properties')
            .select('*')
            .eq('ref_no', id)
            .eq('is_active', true)
            .maybeSingle();

          if (refProperty) {
            dbProperty = refProperty;
          }
        }

        // Try UUID
        if (!dbProperty) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(id)) {
            const { data: uuidProperty } = await enhancedSupabase
              .from('properties')
              .select('*')
              .eq('id', id)
              .eq('is_active', true)
              .maybeSingle();
            
            dbProperty = uuidProperty;
          }
        }

        if (!dbProperty) {
          return null;
        }

        // Transform the database property to expected format
        let features: string[] = [];
        if (dbProperty.property_facilities && Array.isArray(dbProperty.property_facilities)) {
          features = dbProperty.property_facilities;
        } else if (typeof dbProperty.facilities === 'string') {
          features = dbProperty.facilities.split(',').map((f: string) => f.trim());
        }
        
        features = [...new Set(features.filter((f: string) => f && f.trim()))];

        let images: string[] = [];
        if (dbProperty.property_images && Array.isArray(dbProperty.property_images)) {
          images = dbProperty.property_images;
        }
        if (dbProperty.property_image) {
          images = [dbProperty.property_image, ...images];
        }

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
            // Silent fail for pricing parse
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
      }, 3, 2000);
    },
    enabled: !!id,
    retry: 2,
    retryDelay: 5000,
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000, // Reduced to 5 minutes for faster updates
    gcTime: 15 * 60 * 1000,
  });

  return {
    property: rawProperty,
    loading,
    error: error?.message
  };
};