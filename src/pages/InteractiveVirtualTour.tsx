import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Home } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  ref_no: string;
  title: string;
  location: string;
  property_image: string | null;
  property_images: string[] | null;
  bedrooms: string | null;
  bathrooms: string | null;
  price: string;
}

const InteractiveVirtualTour = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, ref_no, title, location, property_image, property_images, bedrooms, bathrooms, price')
        .eq('is_active', true)
        .not('property_images', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter properties that have multiple images
      const propertiesWithImages = (data || []).filter(
        (p) => p.property_images && Array.isArray(p.property_images) && p.property_images.length > 0
      );

      setProperties(propertiesWithImages);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (propertyId: string, refNo: string) => {
    navigate(`/virtual-tour/${propertyId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interactive Virtual Tours
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore properties in 360° and customize colors to visualize your dream home
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No Properties Available</h2>
            <p className="text-muted-foreground">
              There are currently no properties with virtual tour capability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const imageCount = property.property_images?.length || 0;
              
              return (
                <Card 
                  key={property.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handlePropertySelect(property.id, property.ref_no)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={property.property_image || property.property_images?.[0] || '/placeholder.svg'}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Failed to load property image:', property.property_image);
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs inline-block mb-2">
                        {imageCount} Images • 360° Tour
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground">REF: {property.ref_no}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{property.location}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">{property.price}</div>
                    </div>
                    
                    {(property.bedrooms || property.bathrooms) && (
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        {property.bedrooms && <span>🛏️ {property.bedrooms}</span>}
                        {property.bathrooms && <span>🚿 {property.bathrooms}</span>}
                      </div>
                    )}
                    
                    <Button className="w-full" size="lg">
                      Start Virtual Tour
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveVirtualTour;
