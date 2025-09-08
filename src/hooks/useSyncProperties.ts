import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSyncAllData } from './useSyncAllData';

interface SyncStats {
  total: number;
  synced: number;
  updated: number;
  errors: number;
}

export const useSyncProperties = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const { toast } = useToast();

  // Mock data syncing removed - database-only approach
  const syncDubaiProperties = async () => {
    toast({
      title: "Mock Data Removed",
      description: "Dubai properties mock data syncing has been disabled. Application now uses database-only approach.",
      variant: "default"
    });
  };

  const { syncAllData, syncAllProperties, syncBlogPosts } = useSyncAllData();

  return {
    syncDubaiProperties,
    syncAllData,
    syncAllProperties, 
    syncBlogPosts,
    isSyncing,
    syncStats
  };
};