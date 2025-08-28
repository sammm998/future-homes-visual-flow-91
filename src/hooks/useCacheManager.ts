import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { clearAllCaches, clearServiceWorkerCaches, clearBrowserStorage } from '@/utils/cacheManager';

export const useCacheManager = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const clearCache = async (type: 'all' | 'service-worker' | 'browser' = 'all') => {
    setIsClearing(true);
    
    try {
      switch (type) {
        case 'all':
          await clearAllCaches();
          break;
        case 'service-worker':
          await clearServiceWorkerCaches();
          toast({
            title: "Cache cleared",
            description: "Service worker caches have been cleared."
          });
          break;
        case 'browser':
          clearBrowserStorage();
          toast({
            title: "Storage cleared", 
            description: "Browser storage has been cleared."
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Error clearing cache",
        description: "An error occurred while clearing the cache.",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
  };

  return {
    clearCache,
    isClearing
  };
};