import { useLocation } from 'react-router-dom';

export const useCanonicalUrl = () => {
  const location = useLocation();
  const baseUrl = 'https://www.futurehomesinternational.com';
  
  // Remove trailing slashes and ensure proper format
  const pathname = location.pathname === '/' ? '' : location.pathname.replace(/\/$/, '');
  return `${baseUrl}${pathname}${location.search}`;
};

export const usePageMeta = (pageTitle?: string, pageDescription?: string) => {
  const canonicalUrl = useCanonicalUrl();
  
  return {
    canonicalUrl,
    title: pageTitle || "Future Homes - International Real Estate Investment",
    description: pageDescription || "Premium properties in Turkey, Dubai, Cyprus, Antalya, Mersin & France. Expert guidance, citizenship programs & luxury homes.",
  };
};