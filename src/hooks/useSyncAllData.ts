import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// Mock data imports removed - database-only approach

interface SyncStats {
  total: number;
  synced: number;
  updated: number;
  errors: number;
}

export const useSyncAllData = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const { toast } = useToast();

  const syncAllProperties = async () => {
    toast({
      title: "Mock Data Removed",
      description: "Properties now come from database only. Mock data syncing has been disabled.",
      variant: "default"
    });
  };

  const syncBlogPosts = async () => {
    // This can be implemented for real blog post sources if needed
    toast({
      title: "Blog Sync Available",
      description: "Blog syncing can be implemented for real external data sources.",
      variant: "default"
    });
  };

  const syncAllData = async () => {
    toast({
      title: "Database-Only Mode",
      description: "Application is now running on database-only data. No mock data syncing needed.",
      variant: "default"
    });
  };

  return {
    syncAllProperties,
    syncBlogPosts,
    syncAllData,
    isSyncing,
    syncStats
  };
};