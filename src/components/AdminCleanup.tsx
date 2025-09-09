import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyCleanup } from '@/hooks/usePropertyCleanup';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Database, AlertTriangle, Eye, Shield, Activity, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminCleanup = () => {
  const { 
    removeDuplicateProperties, 
    getPropertyStats, 
    getMonitoringStats,
    getInsertionLogs,
    checkForDuplicates,
    isProcessing, 
    cleanupStats 
  } = usePropertyCleanup();
  
  const [propertyStats, setPropertyStats] = useState<any>(null);
  const [monitoringStats, setMonitoringStats] = useState<any>(null);
  const [insertionLogs, setInsertionLogs] = useState<any[]>([]);
  const [duplicateCheckResults, setDuplicateCheckResults] = useState<any[]>([]);
  const [checkTitle, setCheckTitle] = useState('');
  const [checkLocation, setCheckLocation] = useState('');
  const [checkRefNo, setCheckRefNo] = useState('');
  const { toast } = useToast();

  // Auto-refresh monitoring data
  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      const [stats, monitoring, logs] = await Promise.all([
        getPropertyStats(),
        getMonitoringStats(),
        getInsertionLogs(20)
      ]);
      
      setPropertyStats(stats);
      setMonitoringStats(monitoring);
      setInsertionLogs(logs);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
    }
  };

  const handleGetStats = async () => {
    try {
      await loadMonitoringData();
      toast({
        title: "Stats updated",
        description: "All monitoring data refreshed",
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
      await loadMonitoringData();
    } catch (error) {
      toast({
        title: "Cleanup failed",
        description: "Failed to clean up duplicate properties",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateCheck = async () => {
    if (!checkTitle.trim() || !checkLocation.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and location",
        variant: "destructive"
      });
      return;
    }

    try {
      const results = await checkForDuplicates(checkTitle, checkLocation, checkRefNo);
      setDuplicateCheckResults(results);
      
      const totalDuplicates = results.reduce((sum, r) => sum + r.count, 0);
      if (totalDuplicates > 0) {
        toast({
          title: "Duplicates found!",
          description: `Found ${totalDuplicates} potential duplicates`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "No duplicates",
          description: "This property appears to be unique",
        });
      }
    } catch (error) {
      toast({
        title: "Check failed",
        description: "Failed to check for duplicates",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Comprehensive Duplicate Prevention System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monitoring">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="cleanup" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Cleanup
              </TabsTrigger>
              <TabsTrigger value="checker" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Duplicate Checker
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Insertion Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Properties</p>
                        <p className="text-2xl font-bold">{monitoringStats?.totalProperties || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Recent Insertions</p>
                        <p className="text-2xl font-bold">{monitoringStats?.recentInsertions || 0}</p>
                        <p className="text-xs text-muted-foreground">Last hour</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Suspicious Patterns</p>
                        <p className="text-2xl font-bold">{monitoringStats?.suspiciousPatterns || 0}</p>
                        <p className="text-xs text-muted-foreground">Last 5 minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">System Status</p>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                        <p className="text-xs text-muted-foreground">Protection enabled</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleGetStats} variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cleanup" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="checker" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-insertion Duplicate Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Property Title *</label>
                      <Input
                        value={checkTitle}
                        onChange={(e) => setCheckTitle(e.target.value)}
                        placeholder="Enter property title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location *</label>
                      <Input
                        value={checkLocation}
                        onChange={(e) => setCheckLocation(e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reference Number (optional)</label>
                      <Input
                        value={checkRefNo}
                        onChange={(e) => setCheckRefNo(e.target.value)}
                        placeholder="Enter ref number"
                      />
                    </div>
                  </div>

                  <Button onClick={handleDuplicateCheck}>
                    <Eye className="w-4 h-4 mr-2" />
                    Check for Duplicates
                  </Button>

                  {duplicateCheckResults.length > 0 && (
                    <div className="space-y-4">
                      {duplicateCheckResults.map((result, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-semibold text-red-600 mb-2">
                            {result.type === 'title_location' ? 'Title + Location Match' : 'Reference Number Match'}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Found {result.count} matching properties
                          </p>
                          <div className="space-y-2">
                            {result.matches.slice(0, 3).map((match: any, matchIndex: number) => (
                              <div key={matchIndex} className="text-sm p-2 bg-muted rounded">
                                <p><strong>Title:</strong> {match.title}</p>
                                <p><strong>Location:</strong> {match.location}</p>
                                {match.ref_no && <p><strong>Ref:</strong> {match.ref_no}</p>}
                                <p><strong>Created:</strong> {new Date(match.created_at).toLocaleDateString()}</p>
                              </div>
                            ))}
                            {result.matches.length > 3 && (
                              <p className="text-sm text-muted-foreground">
                                ...and {result.matches.length - 3} more
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Property Insertions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {insertionLogs.length === 0 ? (
                      <p className="text-muted-foreground">No recent insertions</p>
                    ) : (
                      insertionLogs.map((log, index) => (
                        <div key={index} className="p-3 border rounded-lg text-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{log.title || 'Untitled'}</span>
                            <span className="text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">Location: {log.location || 'N/A'}</p>
                          {log.ref_no && <p className="text-muted-foreground">Ref: {log.ref_no}</p>}
                          <p className="text-muted-foreground">
                            IP: {log.ip_address ? String(log.ip_address) : 'N/A'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCleanup;