import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Building, MapPin, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageStats {
  totalProperties: number;
  totalImages: number;
  avgImagesPerProperty: number;
  locationBreakdown: { [key: string]: number };
  topLocations: { location: string; count: number; images: number }[];
}

const PropertyImageStats: React.FC = () => {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImageStats();
  }, []);

  const fetchImageStats = async () => {
    try {
      // Get all properties with images
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, location, property_images')
        .eq('is_active', true)
        .not('property_images', 'is', null);

      if (error) throw error;

      // Filter properties that actually have images
      const propertiesWithImages = properties.filter(p => 
        Array.isArray(p.property_images) && p.property_images.length > 0
      );

      // Calculate stats
      const totalProperties = propertiesWithImages.length;
      const totalImages = propertiesWithImages.reduce((sum, p) => 
        sum + (p.property_images?.length || 0), 0
      );
      const avgImagesPerProperty = totalProperties > 0 ? totalImages / totalProperties : 0;

      // Location breakdown
      const locationCounts: { [key: string]: { count: number; images: number } } = {};
      
      propertiesWithImages.forEach(property => {
        const location = property.location || 'Unknown';
        if (!locationCounts[location]) {
          locationCounts[location] = { count: 0, images: 0 };
        }
        locationCounts[location].count += 1;
        locationCounts[location].images += property.property_images?.length || 0;
      });

      // Top locations (sorted by property count)
      const topLocations = Object.entries(locationCounts)
        .map(([location, data]) => ({
          location,
          count: data.count,
          images: data.images
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      const locationBreakdown = Object.fromEntries(
        Object.entries(locationCounts).map(([loc, data]) => [loc, data.count])
      );

      setStats({
        totalProperties,
        totalImages,
        avgImagesPerProperty,
        locationBreakdown,
        topLocations
      });

    } catch (error) {
      console.error('Error fetching image stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties.toLocaleString(),
      icon: Building,
      description: 'Active properties with images',
      color: 'text-blue-600'
    },
    {
      title: 'Total Images',
      value: stats.totalImages.toLocaleString(),
      icon: Image,
      description: 'High-quality property photos',
      color: 'text-green-600'
    },
    {
      title: 'Average Images',
      value: Math.round(stats.avgImagesPerProperty),
      icon: Database,
      description: 'Images per property',
      color: 'text-purple-600'
    },
    {
      title: 'Locations',
      value: Object.keys(stats.locationBreakdown).length,
      icon: MapPin,
      description: 'Different locations covered',
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Gallery Statistics
          </h2>
          <p className="text-muted-foreground">
            Comprehensive overview of our property image collection
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Locations by Property Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topLocations.map((location, index) => (
                <motion.div
                  key={location.location}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {location.location}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {location.count} properties
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {location.images}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      images
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PropertyImageStats;