import React from 'react';
import { Button } from '@/components/ui/button';
import { useSyncProperties } from '@/hooks/useSyncProperties';
import { Loader2, Database } from 'lucide-react';

export const PropertySyncButton = () => {
  const { syncDubaiProperties, isSyncing, syncStats } = useSyncProperties();

  const handleSync = () => {
    syncDubaiProperties();
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleSync} 
        disabled={isSyncing}
        className="flex items-center gap-2"
        variant="outline"
      >
        {isSyncing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {isSyncing ? 'Syncing...' : 'Sync Dubai Properties'}
      </Button>
      
      {syncStats && (
        <div className="text-sm text-muted-foreground">
          <p>Total: {syncStats.total}</p>
          <p>Synced: {syncStats.synced}</p>
          <p>Updated: {syncStats.updated}</p>
          <p>Errors: {syncStats.errors}</p>
        </div>
      )}
    </div>
  );
};