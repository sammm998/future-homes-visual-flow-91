import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from '@/contexts/CurrencyContext';
import { useState } from 'react';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { formatPriceFromString } from '@/utils/priceFormatting';
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { Link } from "react-router-dom";

const PopularProperties = () => {
  const { formatPrice } = useCurrency();
  const { properties, loading } = useProperties();
  
  // Take the first 3 properties as popular ones
  const popularProperties = properties.slice(0, 3);

  const getBadgeInfo = (property: any) => {
    if (property.status === 'sold') return { text: 'Sold', color: 'bg-red-500' };
    if (property.status === 'under_construction') return { text: 'Under Construction', color: 'bg-blue-500' };
    if (property.location?.toLowerCase().includes('sea') || property.title?.toLowerCase().includes('sea')) return { text: 'Sea view', color: 'bg-green-500' };
    if (property.location?.toLowerCase().includes('dubai')) return { text: 'Investment', color: 'bg-purple-500' };
    return { text: 'Available', color: 'bg-primary' };
  };

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-md w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded-md w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Popular Projects
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover our most sought-after properties
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View all listing
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularProperties.map((property) => {
            const badgeInfo = getBadgeInfo(property);
            return (
              <Link to={`/property/${property.id}`} key={property.id}>
                <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={property.property_image || '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png'} 
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${badgeInfo.color} text-white`}>
                        {badgeInfo.text}
                      </Badge>
                      {property.ref_no && (
                        <Badge variant="secondary" className="bg-gray-800 text-white">
                          {property.ref_no}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md font-bold text-lg text-foreground">
                        {property.price || property.starting_price_eur ? formatPriceFromString(property.price || property.starting_price_eur || '0', formatPrice) : 'Price on request'}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin size={16} />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath size={16} />
                        <span>{property.bathrooms || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square size={16} />
                        <span>{property.sizes_m2 || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Button variant="outline">
            View all listing
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularProperties;