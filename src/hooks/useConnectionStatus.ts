import { useState, useEffect } from 'react';
import { checkConnection, getConnectionState, resetConnection } from '@/lib/supabase-enhanced';
import { useToast } from '@/hooks/use-toast';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const performConnectionCheck = async () => {
    setIsChecking(true);
    try {
      const connectionOk = await checkConnection();
      const state = getConnectionState();
      
      setIsOnline(connectionOk);
      setIsBlocked(state.isBlocked);
      setLastCheck(Date.now());
      
      // Show appropriate notifications
      if (!connectionOk && state.isBlocked) {
        toast({
          title: "Connection Issues Detected",
          description: "Having trouble connecting to our servers. This might be due to network restrictions in your area. Try using a VPN.",
          variant: "destructive",
        });
      } else if (!connectionOk) {
        toast({
          title: "Connection Problems",
          description: "Unable to connect to our servers. Checking your network...",
          variant: "destructive",
        });
      } else if (connectionOk && !isOnline) {
        // Connection restored
        toast({
          title: "Connection Restored",
          description: "Successfully reconnected to our servers!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const retryConnection = async () => {
    resetConnection();
    await performConnectionCheck();
  };

  useEffect(() => {
    // Initial check
    performConnectionCheck();
    
    // Set up periodic checks
    const interval = setInterval(performConnectionCheck, 30000); // Check every 30 seconds
    
    // Listen for online/offline events
    const handleOnline = () => {
      console.log('Browser detected online');
      performConnectionCheck();
    };
    
    const handleOffline = () => {
      console.log('Browser detected offline');
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isBlocked,
    isChecking,
    lastCheck,
    retryConnection,
    checkConnection: performConnectionCheck
  };
};