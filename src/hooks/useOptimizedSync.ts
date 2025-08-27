import { useState, useCallback, useRef } from 'react';
import { useSyncAllData } from './useSyncAllData';
import { useToast } from './use-toast';

export const useOptimizedSync = () => {
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);
  const { syncAllProperties, syncBlogPosts, isSyncing } = useSyncAllData();
  const { toast } = useToast();
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced sync function to prevent excessive calls
  const debouncedSync = useCallback((delay = 5000) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        setIsBackgroundSyncing(true);
        
        // Check if sync is needed (only if data is older than 6 hours)
        const lastSync = localStorage.getItem('lastPropertiesSync');
        const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
        
        if (!lastSync || parseInt(lastSync) < sixHoursAgo) {
          await syncAllProperties();
          localStorage.setItem('lastPropertiesSync', Date.now().toString());
          
          toast({
            title: "Background sync completed",
            description: "Properties updated successfully",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error('Background sync failed:', error);
      } finally {
        setIsBackgroundSyncing(false);
      }
    }, delay);
  }, [syncAllProperties, toast]);

  // Background sync that doesn't block UI
  const backgroundSync = useCallback(() => {
    if (!isSyncing && !isBackgroundSyncing) {
      debouncedSync(1000); // 1 second delay for background sync
    }
  }, [debouncedSync, isSyncing, isBackgroundSyncing]);

  // Manual sync with immediate execution
  const manualSync = useCallback(async () => {
    try {
      await syncAllProperties();
      await syncBlogPosts();
      localStorage.setItem('lastPropertiesSync', Date.now().toString());
      
      toast({
        title: "Manual sync completed",
        description: "All data synchronized successfully",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to synchronize data. Please try again.",
        variant: "destructive",
      });
    }
  }, [syncAllProperties, syncBlogPosts, toast]);

  return {
    backgroundSync,
    manualSync,
    isBackgroundSyncing,
    isSyncing,
  };
};