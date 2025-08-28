import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCacheManager } from '@/hooks/useCacheManager';
import { Trash2, Database, HardDrive } from 'lucide-react';

interface CacheControlsProps {
  show?: boolean;
}

export const CacheControls = ({ show = false }: CacheControlsProps) => {
  const { clearCache, isClearing } = useCacheManager();

  // Keyboard shortcut: Ctrl+Shift+C to clear all cache
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearCache('all');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [clearCache]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg z-50">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Cache Controls</h3>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => clearCache('all')}
          disabled={isClearing}
          size="sm"
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Cache
        </Button>
        <Button
          onClick={() => clearCache('service-worker')}
          disabled={isClearing}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Database className="w-4 h-4 mr-2" />
          Clear Service Worker
        </Button>
        <Button
          onClick={() => clearCache('browser')}
          disabled={isClearing}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <HardDrive className="w-4 h-4 mr-2" />
          Clear Browser Storage
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Ctrl+Shift+C for quick clear
      </p>
    </div>
  );
};