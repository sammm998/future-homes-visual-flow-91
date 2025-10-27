import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Play } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Virtual360Viewer from '@/components/Virtual360Viewer';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  ref_no: string;
  title: string;
  location: string;
  price: string;
  property_image: string | null;
  property_images: string[] | null;
  description: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  sizes_m2: string | null;
}

const VirtualTourDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!property || !property.property_images || property.property_images.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button
            variant="ghost"
            onClick={() => navigate('/interactive-virtual-tour')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Property Not Available</h2>
            <p className="text-muted-foreground">
              This property does not have virtual tour images available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const allImages = property.property_image 
    ? [property.property_image, ...property.property_images]
    : property.property_images;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button
            variant="ghost"
            onClick={() => navigate('/interactive-virtual-tour')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Property Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-muted-foreground">REF: {property.ref_no}</span>
                <h1 className="text-4xl font-bold mt-2">{property.title}</h1>
                <p className="text-lg text-muted-foreground mt-2">{property.location}</p>
              </div>

              <div className="text-3xl font-bold text-primary">{property.price}</div>

              {property.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {property.bedrooms && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                )}
                {property.sizes_m2 && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold">{property.sizes_m2}</p>
                  </div>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setShowViewer(true)}
              >
                <Play className="h-5 w-5 mr-2" />
                Start Interactive 360° Tour
              </Button>
            </div>

            {/* Preview Images */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Tour Preview</h3>
              <div className="grid grid-cols-2 gap-4">
                {allImages.slice(0, 4).map((image, idx) => (
                  <div 
                    key={idx}
                    className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity relative bg-muted"
                    onClick={() => setShowViewer(true)}
                  >
                    <img 
                      src={image} 
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load preview image:', image);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {idx === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {allImages.length} images available • Click to start tour
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold text-lg mb-4">Virtual Tour Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">360° View</h4>
                  <p className="text-sm text-muted-foreground">
                    Rotate and explore every angle of each room
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Color Customization</h4>
                  <p className="text-sm text-muted-foreground">
                    Change wall and floor colors to match your style
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Zoom & Detail</h4>
                  <p className="text-sm text-muted-foreground">
                    Zoom in to see fine details and finishes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showViewer && (
        <Virtual360Viewer
          images={allImages}
          propertyTitle={property.title}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};

export default VirtualTourDetail;
