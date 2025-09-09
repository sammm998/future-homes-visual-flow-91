import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyCleanup } from '@/hooks/usePropertyCleanup';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Database, AlertTriangle } from 'lucide-react';

const AdminCleanup = () => {
  const { removeDuplicateProperties, getPropertyStats, isProcessing, cleanupStats } = usePropertyCleanup();
  const [propertyStats, setPropertyStats] = useState<any>(null);
  const { toast } = useToast();

  const handleGetStats = async () => {
    try {
      const stats = await getPropertyStats();
      setPropertyStats(stats);
      toast({
        title: "Stats fetched",
        description: `Total properties: ${stats.total}`,
      });
    } catch (error) {
      toast({
        title: "Error fetching stats",
        description: "Failed to get property statistics",
        variant: "destructive"
      });
    }
  };

  const handleCleanup = async () => {
    try {
      await removeDuplicateProperties();
      // Refresh stats after cleanup
      await handleGetStats();
    } catch (error) {
      toast({
        title: "Cleanup failed",
        description: "Failed to clean up duplicate properties",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Cleanup & Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleGetStats}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Get Property Stats
            </Button>
            
            <Button 
              onClick={handleCleanup}
              disabled={isProcessing}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isProcessing ? 'Cleaning...' : 'Remove Duplicates'}
            </Button>
          </div>

          {propertyStats && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Property Statistics</h3>
              <p>Total Properties: {propertyStats.total}</p>
            </div>
          )}

          {cleanupStats && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Cleanup Results
              </h3>
              <div className="space-y-1">
                <p>Duplicates Found: {cleanupStats.duplicatesFound}</p>
                <p>Duplicates Removed: {cleanupStats.duplicatesRemoved}</p>
                <p>Errors: {cleanupStats.errors}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCleanup;