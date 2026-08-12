import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { getCurrentLanguage } from '@/utils/seoUtils';

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
  const location = useLocation();
  const slug = customSlug || getPageSlugFromPath(window.location.pathname);
  const lang = getCurrentLanguage();

  const aboutCompanyInfo: Record<string, { title: string; description: string }> = {
    en: { title: 'Who We Are', description: 'Future Homes International is a leading real estate company specializing in premium properties across Turkey, Dubai, Cyprus, Bali, and France. With years of experience and a commitment to excellence, we help our clients find their perfect home or investment opportunity.' },
    sv: { title: 'Vilka Vi Är', description: 'Future Homes International är ett ledande fastighetsbolag specialiserat på premiumfastigheter i Turkiet, Dubai, Cypern, Bali och Frankrike. Med många års erfarenhet och ett starkt engagemang för kvalitet hjälper vi våra kunder att hitta sitt perfekta hem eller sin investeringsmöjlighet.' },
    no: { title: 'Hvem Vi Er', description: 'Future Homes International er et ledende eiendomsselskap spesialisert på premiumeiendommer i Tyrkia, Dubai, Kypros, Bali og Frankrike. Med mange års erfaring og et sterkt fokus på kvalitet hjelper vi kundene våre med å finne sitt perfekte hjem eller sin investeringsmulighet.' },
    da: { title: 'Hvem Vi Er', description: 'Future Homes International er et førende ejendomsselskab specialiseret i premiumejendomme i Tyrkiet, Dubai, Cypern, Bali og Frankrig. Med mange års erfaring og et stærkt engagement i kvalitet hjælper vi vores kunder med at finde deres perfekte hjem eller investering.' },
    tr: { title: 'Biz Kimiz', description: 'Future Homes International; Türkiye, Dubai, Kıbrıs, Bali ve Fransa genelinde seçkin gayrimenkuller konusunda uzmanlaşmış lider bir emlak şirketidir. Yılların deneyimi ve mükemmelliğe bağlılığımızla müşterilerimizin ideal evlerini veya yatırım fırsatlarını bulmalarına yardımcı oluyoruz.' },
    es: { title: 'Quiénes Somos', description: 'Future Homes International es una empresa inmobiliaria líder especializada en propiedades premium en Turquía, Dubái, Chipre, Bali y Francia. Con años de experiencia y un compromiso con la excelencia, ayudamos a nuestros clientes a encontrar su hogar perfecto o una oportunidad de inversión.' },
    de: { title: 'Wer Wir Sind', description: 'Future Homes International ist ein führendes Immobilienunternehmen, spezialisiert auf Premium-Immobilien in der Türkei, Dubai, Zypern, Bali und Frankreich. Mit jahrelanger Erfahrung und einem klaren Qualitätsanspruch helfen wir unseren Kunden, ihr perfektes Zuhause oder ihre Investitionsmöglichkeit zu finden.' },
    fr: { title: 'Qui Nous Sommes', description: 'Future Homes International est une société immobilière leader spécialisée dans les biens premium en Turquie, à Dubaï, à Chypre, à Bali et en France. Forts de nombreuses années d’expérience et d’un engagement envers l’excellence, nous aidons nos clients à trouver leur maison idéale ou leur opportunité d’investissement.' },
    ru: { title: 'Кто Мы', description: 'Future Homes International — ведущая компания в сфере недвижимости, специализирующаяся на премиальных объектах в Турции, Дубае, на Кипре, Бали и во Франции. Благодаря многолетнему опыту и стремлению к качеству мы помогаем клиентам найти идеальный дом или инвестиционную возможность.' },
    ar: { title: 'من نحن', description: 'Future Homes International هي شركة عقارية رائدة متخصصة في العقارات المميزة في تركيا ودبي وقبرص وبالي وفرنسا. بفضل سنوات من الخبرة والالتزام بالتميز، نساعد عملاءنا في العثور على المنزل المثالي أو فرصة الاستثمار المناسبة.' },
    fa: { title: 'ما که هستیم', description: 'Future Homes International یک شرکت پیشرو در املاک است که در املاک ممتاز در ترکیه، دبی، قبرس، بالی و فرانسه تخصص دارد. با سال‌ها تجربه و تعهد به کیفیت، به مشتریان کمک می‌کنیم خانه ایده‌آل یا فرصت سرمایه‌گذاری مناسب خود را پیدا کنند.' },
    ur: { title: 'ہم کون ہیں', description: 'Future Homes International ایک معروف رئیل اسٹیٹ کمپنی ہے جو ترکی، دبئی، قبرص، بالی اور فرانس میں پریمیم جائیدادوں میں مہارت رکھتی ہے۔ برسوں کے تجربے اور معیار کے عزم کے ساتھ، ہم اپنے کلائنٹس کو بہترین گھر یا سرمایہ کاری کا موقع تلاش کرنے میں مدد دیتے ہیں۔' },
    id: { title: 'Siapa Kami', description: 'Future Homes International adalah perusahaan real estate terkemuka yang berspesialisasi dalam properti premium di Turki, Dubai, Siprus, Bali, dan Prancis. Dengan pengalaman bertahun-tahun dan komitmen pada kualitas, kami membantu klien menemukan rumah ideal atau peluang investasi terbaik.' },
  };

  const localizeSections = (sections: ContentSection[]): ContentSection[] => {
    if (slug !== 'about-us') return sections;
    const localized = aboutCompanyInfo[lang] || aboutCompanyInfo.en;
    return sections.map((section) => {
      if (section.type !== 'company_info') return section;
      return { ...section, title: localized.title, description: localized.description };
    });
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['website_content', slug, lang, location.search],
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
          const nonHeroSections = localizeSections(allSections.filter(section => section.type !== 'hero'));
          
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