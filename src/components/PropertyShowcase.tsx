
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProperties } from '@/hooks/useProperties';

const PropertyShowcase = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { properties, loading } = useProperties();
  
  // Take the first 6 properties for showcase
  const showcaseProperties = properties.slice(0, 6);

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
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
    <section className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Premium Properties Worldwide
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explore our carefully curated selection of premium properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {showcaseProperties.map((property) => (
            <div
              key={property.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handlePropertyClick(property)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={property.property_image || '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png'} 
                  alt={property.title}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {property.price || property.starting_price_eur || formatPrice(0)}
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <p className="text-muted-foreground mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {property.location}
                </p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{property.sizes_m2 || 'N/A'}</span>
                  <span>{property.bedrooms || 'N/A'} bed • {property.bathrooms || 'N/A'} bath</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(PropertyShowcase);
