import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContentSection {
  type: string;
  content?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  [key: string]: any;
}

interface WebsiteContent {
  pageTitle: string;
  metaDescription: string;
  contentSections: ContentSection[];
  heroTitle?: string;
  heroSubtitle?: string;
}

interface UseWebsiteContentResult extends WebsiteContent {
  isLoading: boolean;
  error: string | null;
}

const getPageSlugFromPath = (pathname: string): string => {
  const pathToSlugMap: Record<string, string> = {
    '/': '', // Homepage has empty slug
    '/about-us': 'about-us',
    '/contact-us': 'contact-us',
    '/antalya': 'fastigheter-turkiet',
    '/dubai': 'fastigheter-dubai',
    '/cyprus': 'fastigheter-cypern',
    '/mersin': 'fastigheter-mersin',
    '/testimonials': 'kundberattelser',
    '/information': 'information',
    '/articles': 'blog',
  };

  return pathToSlugMap[pathname] || pathname.replace('/', '');
};

export const useWebsiteContent = (customSlug?: string): UseWebsiteContentResult => {
  const slug = customSlug || getPageSlugFromPath(window.location.pathname);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['website_content', slug],
    queryFn: async () => {
      console.log('🔍 useWebsiteContent: Making API call to fetch content for slug:', slug);
      
      // Create timeout for better connection handling (Dubai users)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout
      
      try {
        const { data, error: fetchError } = await supabase
          .from('website_content')
          .select('*')
          .eq('page_slug', slug)
          .single();
        
        clearTimeout(timeoutId);

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            console.log('📝 useWebsiteContent: No data found for slug:', slug);
            // No data found, return empty content
            return {
              pageTitle: '',
              metaDescription: '',
              contentSections: [],
              heroTitle: '',
              heroSubtitle: ''
            };
          } else {
            throw fetchError;
          }
        }

        if (data) {
          console.log('✅ useWebsiteContent: Successfully fetched content for slug:', slug);
          const allSections = Array.isArray(data.content_sections) ? data.content_sections as ContentSection[] : [];
          
          // Extract hero section data
          const heroSection = allSections.find(section => section.type === 'hero');
          const heroTitle = heroSection?.title || '';
          const heroSubtitle = heroSection?.subtitle || heroSection?.content || '';
          
          // Filter out hero sections from contentSections to prevent duplication
          const nonHeroSections = allSections.filter(section => section.type !== 'hero');
          
          return {
            pageTitle: data.page_title || '',
            metaDescription: data.meta_description || '',
            contentSections: nonHeroSections,
            heroTitle,
            heroSubtitle
          };
        }
        
        return {
          pageTitle: '',
          metaDescription: '',
          contentSections: [],
          heroTitle: '',
          heroSubtitle: ''
        };
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

  const content = data || {
    pageTitle: '',
    metaDescription: '',
    contentSections: [],
    heroTitle: '',
    heroSubtitle: ''
  };

  return {
    ...content,
    isLoading,
    error: error?.message || null
  };
};