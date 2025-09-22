import React from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const { isOnline, isBlocked, isChecking, retryConnection } = useConnectionStatus();

  // Don't show anything if connection is fine
  if (isOnline && !isBlocked) {
    return null;
  }

  return (
    <Alert className="m-4" variant={isBlocked ? "destructive" : "default"}>
      <div className="flex items-center gap-2">
        {isBlocked ? (
          <AlertTriangle className="h-4 w-4" />
        ) : isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription className="flex-1">
          {isBlocked ? (
            <div>
              <strong>Network Access Restricted</strong>
              <p>Your network provider may be blocking access to our servers. This is a known issue in the UAE. Consider using a VPN to access the full site.</p>
            </div>
          ) : !isOnline ? (
            <div>
              <strong>Connection Issues</strong>
              <p>Having trouble connecting to our servers. Please check your internet connection.</p>
            </div>
          ) : (
            <div>
              <strong>Connectivity Warning</strong>
              <p>Connection is unstable. Some features may not work properly.</p>
            </div>
          )}
        </AlertDescription>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={retryConnection}
          disabled={isChecking}
        >
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Retry
        </Button>
      </div>
    </Alert>
  );
};