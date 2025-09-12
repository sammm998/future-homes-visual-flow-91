import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface DbTestimonial {
  id: string;
  customer_name: string;
  customer_country?: string;
  review_text: string;
  rating?: number;
  property_type?: string;
  location?: string;
  image_url?: string;
  designation?: string;
  company_name?: string;
}

export const useTestimonials = () => {
  const { data: testimonials = [], isLoading: loading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('🔍 useTestimonials: Making API call to fetch testimonials');
      
      // Create timeout for better connection handling (Dubai users)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout
      
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        
        clearTimeout(timeoutId);

        if (error) {
          console.error('❌ useTestimonials: Database error:', error);
          throw error;
        }

        if (data) {
          console.log('✅ useTestimonials: Successfully fetched', data.length, 'testimonials');
          // Transform database testimonials to the format expected by components
          const transformedTestimonials: Testimonial[] = data.map((testimonial: DbTestimonial) => ({
            text: testimonial.review_text,
            image: testimonial.image_url || '/placeholder.svg',
            name: testimonial.customer_name,
            role: testimonial.designation || 
                  (testimonial.location ? `Customer - ${testimonial.location}` : 'Customer')
          }));

          return transformedTestimonials;
        }
        
        return [];
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timeout - please check your internet connection');
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on timeout or abort errors after 3 attempts
      if (error?.message?.includes('timeout') || error?.message?.includes('AbortError')) {
        return failureCount < 3;
      }
      // Don't retry on 4xx client errors
      if (error?.message?.includes('400') || error?.message?.includes('404')) {
        return false;
      }
      // Retry up to 5 times for network errors (good for Dubai users)
      return failureCount < 5;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 2s, 4s, 8s, 16s, 30s max
      return Math.min(2000 * Math.pow(2, attemptIndex), 30000);
    },
    networkMode: 'offlineFirst',
  });

  return { 
    testimonials, 
    loading, 
    error: error?.message,
    refetch: () => {} // For backward compatibility
  };
};