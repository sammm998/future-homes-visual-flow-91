import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Additional delay to ensure DOM is ready and handle any scroll containers
    const timer = setTimeout(() => {
      // Force scroll to top with multiple methods to ensure it works
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Scroll all potential scrollable containers to top
      const scrollableElements = document.querySelectorAll('[data-radix-scroll-area-viewport], .scroll-area, [data-scroll-area]');
      scrollableElements.forEach(el => {
        el.scrollTop = 0;
      });
      
      // Also check for any main content containers
      const mainElements = document.querySelectorAll('main, .main-content, #root > div');
      mainElements.forEach(el => {
        el.scrollTop = 0;
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};