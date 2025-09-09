import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';

const FeaturedPropertiesShowcase = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  
  // Take the first 4 properties as featured ones
  const featuredProperties = properties.slice(0, 4);

  const handleContactClick = () => {
    navigate('/properties');
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-muted/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
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
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-muted/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-glow rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Premium Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of luxury properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={property.property_image || '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png'}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Price Badge */}
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {property.price || property.starting_price_eur || 'Price on request'}
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{property.location}</span>
                  </div>
                </div>
                
                {/* Property Details */}
                <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>{property.sizes_m2 || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms || 'N/A'} bed</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms || 'N/A'} bath</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleContactClick}
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    Contact Us About This Property
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleContactClick}
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    Schedule a Viewing
                  </Button>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button 
            onClick={handleContactClick}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedPropertiesShowcase);