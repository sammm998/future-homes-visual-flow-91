import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { t as tr2 } from '@/utils/translations';
import { useLocation, useSearchParams } from '@/lib/router-compat';
import { getLocaleFromPathname } from '@/utils/localeRouting';

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface DbTestimonial {
  id: string;
  customer_name: string;
  customer_country?: string | null;
  review_text: string;
  rating?: number | null;
  property_type?: string | null;
  location?: string | null;
  image_url?: string | null;
  designation?: string | null;
  company_name?: string | null;
}

export const useTestimonials = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const language = getLocaleFromPathname(location.pathname) || searchParams.get('lang') || 'en';

  const { data: testimonials = [], isLoading: loading, error } = useQuery({
    queryKey: ['testimonials', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      // Fetch translations if not English
      let translationsMap = new Map<string, { review_text: string; designation: string | null }>();
      if (language && language !== 'en') {
        const { data: translations } = await supabase
          .from('testimonial_translations')
          .select('testimonial_id, review_text, designation')
          .eq('language_code', language)
          .in('testimonial_id', data.map((d: any) => d.id));
        if (translations) {
          translations.forEach((t: any) => {
            translationsMap.set(t.testimonial_id, {
              review_text: t.review_text,
              designation: t.designation,
            });
          });
        }
      }

      const transformed: Testimonial[] = data.map((t: DbTestimonial) => {
        const tr = translationsMap.get(t.id);
        const reviewText = tr?.review_text || t.review_text;
        const designation = tr?.designation || t.designation;
        return {
          text: reviewText,
          image: t.image_url || '/placeholder.svg',
          name: t.customer_name,
          role:
            designation ||
            (t.location ? `${tr2('testimonials.customer', language)} - ${t.location}` : tr2('testimonials.customer', language)),
        };
      });

      return transformed;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    networkMode: 'offlineFirst',
  });

  return {
    testimonials,
    loading,
    error: error?.message,
    refetch: () => {},
  };
};
