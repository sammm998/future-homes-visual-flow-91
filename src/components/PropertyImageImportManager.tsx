import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Check, X, AlertCircle, Image, Loader } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ImportStats {
  totalProperties: number;
  totalImages: number;
  importedImages: number;
  failedImages: number;
  currentProperty?: string;
}

interface PropertyImageImportManagerProps {
  onImportComplete?: () => void;
}

const PropertyImageImportManager: React.FC<PropertyImageImportManagerProps> = ({
  onImportComplete
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats>({
    totalProperties: 0,
    totalImages: 0,
    importedImages: 0,
    failedImages: 0
  });
  const [importLog, setImportLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    fetchImportStats();
  }, []);

  const fetchImportStats = async () => {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, property_images')
        .eq('is_active', true)
        .not('property_images', 'is', null);

      if (error) throw error;

      const propertiesWithImages = properties.filter(p => 
        Array.isArray(p.property_images) && p.property_images.length > 0
      );

      const totalImages = propertiesWithImages.reduce((sum, p) => 
        sum + (p.property_images?.length || 0), 0
      );

      setImportStats(prev => ({
        ...prev,
        totalProperties: propertiesWithImages.length,
        totalImages
      }));

    } catch (error) {
      console.error('Error fetching import stats:', error);
    }
  };

  const startImportProcess = async () => {
    setIsImporting(true);
    setImportStats(prev => ({ ...prev, importedImages: 0, failedImages: 0 }));
    setImportLog([]);
    setShowLog(true);

    try {
      // Get all properties with external images
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, property_images')
        .eq('is_active', true)
        .not('property_images', 'is', null);

      if (error) throw error;

      const propertiesWithExternalImages = properties.filter(p => 
        Array.isArray(p.property_images) && 
        p.property_images.length > 0 &&
        p.property_images.some(img => img.includes('cdn.futurehomesturkey.com'))
      );

      addToLog(`Starting import process for ${propertiesWithExternalImages.length} properties...`);

      for (const property of propertiesWithExternalImages) {
        setImportStats(prev => ({ 
          ...prev, 
          currentProperty: property.title 
        }));

        addToLog(`Processing: ${property.title}`);

        const externalImages = property.property_images.filter(img => 
          img.includes('cdn.futurehomesturkey.com')
        );

        for (let i = 0; i < externalImages.length; i++) {
          const imageUrl = externalImages[i];
          try {
            // Download and upload image to Supabase Storage
            const fileName = `property_${property.id}_image_${i}.webp`;
            const response = await fetch(imageUrl);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.status}`);
            }

            const blob = await response.blob();
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('property-images')
              .upload(`${property.id}/${fileName}`, blob, {
                cacheControl: '3600',
                upsert: true
              });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('property-images')
              .getPublicUrl(`${property.id}/${fileName}`);

            // Update property with new image URL
            const updatedImages = [...property.property_images];
            updatedImages[property.property_images.indexOf(imageUrl)] = publicUrl;

            const { error: updateError } = await supabase
              .from('properties')
              .update({ 
                property_images: updatedImages,
                property_image: updatedImages[0] // Update main image too
              })
              .eq('id', property.id);

            if (updateError) throw updateError;

            setImportStats(prev => ({
              ...prev,
              importedImages: prev.importedImages + 1
            }));

            addToLog(`✓ Imported image ${i + 1} for ${property.title}`);

          } catch (error) {
            console.error(`Failed to import image ${i + 1} for ${property.title}:`, error);
            setImportStats(prev => ({
              ...prev,
              failedImages: prev.failedImages + 1
            }));
            addToLog(`✗ Failed to import image ${i + 1} for ${property.title}: ${error.message}`);
          }
        }
      }

      addToLog(`Import process completed! ${importStats.importedImages} images imported, ${importStats.failedImages} failed.`);
      
      if (onImportComplete) {
        onImportComplete();
      }

    } catch (error) {
      console.error('Error during import process:', error);
      addToLog(`Import process failed: ${error.message}`);
    } finally {
      setIsImporting(false);
      setImportStats(prev => ({ ...prev, currentProperty: undefined }));
    }
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setImportLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const getProgress = () => {
    const total = importStats.importedImages + importStats.failedImages;
    return importStats.totalImages > 0 ? (total / importStats.totalImages) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{importStats.totalProperties}</div>
            <div className="text-sm text-muted-foreground">Properties</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{importStats.totalImages}</div>
            <div className="text-sm text-muted-foreground">Total Images</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{importStats.importedImages}</div>
            <div className="text-sm text-muted-foreground">Imported</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{importStats.failedImages}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Import Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Property Image Import Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Import Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={startImportProcess}
              disabled={isImporting || importStats.totalImages === 0}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Start Import Process
                </>
              )}
            </Button>
            
            {isImporting && (
              <Badge variant="secondary">
                Processing: {importStats.currentProperty}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {(isImporting || importStats.importedImages > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Import Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
          )}

          {/* Log Toggle */}
          {importLog.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLog(!showLog)}
            >
              {showLog ? 'Hide Log' : 'Show Log'} ({importLog.length} entries)
            </Button>
          )}

          {/* Import Log */}
          {showLog && importLog.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Import Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-xs">
                  {importLog.map((entry, index) => (
                    <div 
                      key={index} 
                      className={`p-1 rounded ${
                        entry.includes('✓') ? 'bg-green-50 text-green-800' :
                        entry.includes('✗') ? 'bg-red-50 text-red-800' :
                        'bg-gray-50 text-gray-800'
                      }`}
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyImageImportManager;