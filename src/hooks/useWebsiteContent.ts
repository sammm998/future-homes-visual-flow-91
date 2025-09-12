import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create a simple supabase client to avoid type recursion issues
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

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
  const [content, setContent] = useState<WebsiteContent>({
    pageTitle: '',
    metaDescription: '',
    contentSections: [],
    heroTitle: '',
    heroSubtitle: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const slug = customSlug || getPageSlugFromPath(window.location.pathname);
        
        // Get current language from URL - default to English if no lang param
        const urlParams = new URLSearchParams(window.location.search);
        const currentLanguage = urlParams.get('lang') || 'en';
        
        // Function to process content data
        const processContentData = (contentData: any) => {
          if (!contentData || !contentData.content_sections) {
            return {
              pageTitle: contentData?.page_title || '',
              metaDescription: contentData?.meta_description || '',
              contentSections: [],
              heroTitle: '',
              heroSubtitle: ''
            };
          }

          const allSections = Array.isArray(contentData.content_sections) 
            ? contentData.content_sections as ContentSection[] 
            : [];
          
          // Extract hero section data
          const heroSection = allSections.find(section => section.type === 'hero');
          const heroTitle = heroSection?.title || '';
          const heroSubtitle = heroSection?.subtitle || heroSection?.content || '';
          
          // Filter out hero sections from contentSections to prevent duplication
          const nonHeroSections = allSections.filter(section => section.type !== 'hero');
          
          return {
            pageTitle: contentData.page_title || '',
            metaDescription: contentData.meta_description || '',
            contentSections: nonHeroSections,
            heroTitle,
            heroSubtitle
          };
        };

        // First try to get content for the current language
        const { data, error: fetchError } = await supabaseClient
          .from('website_content')
          .select('*')
          .eq('page_slug', slug)
          .eq('language', currentLanguage);

        if (fetchError) {
          throw fetchError;
        }

        if (data && data.length > 0) {
          // Content found for current language
          setContent(processContentData(data[0]));
        } else if (currentLanguage !== 'en') {
          // No content found for current language, try English fallback
          const { data: fallbackData, error: fallbackError } = await supabaseClient
            .from('website_content')
            .select('*')
            .eq('page_slug', slug)
            .eq('language', 'en');

          if (fallbackError) {
            throw fallbackError;
          }

          if (fallbackData && fallbackData.length > 0) {
            setContent(processContentData(fallbackData[0]));
          } else {
            // No content found even in English fallback
            setContent({
              pageTitle: '',
              metaDescription: '',
              contentSections: [],
              heroTitle: '',
              heroSubtitle: ''
            });
          }
        } else {
          // No content found for English (default language)
          setContent({
            pageTitle: '',
            metaDescription: '',
            contentSections: [],
            heroTitle: '',
            heroSubtitle: ''
          });
        }
      } catch (err) {
        console.error('Error fetching website content:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
        // Set empty content on error
        setContent({
          pageTitle: '',
          metaDescription: '',
          contentSections: [],
          heroTitle: '',
          heroSubtitle: ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [customSlug]);

  return {
    ...content,
    isLoading,
    error
  };
};