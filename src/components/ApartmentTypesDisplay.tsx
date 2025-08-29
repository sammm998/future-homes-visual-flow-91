import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Square } from "lucide-react";
import { useCurrency } from '@/contexts/CurrencyContext';

interface ApartmentType {
  bedrooms: string;
  size_m2: string;
  price: string;
  starting_price?: string;
}

interface ApartmentTypesDisplayProps {
  apartmentTypes: ApartmentType[];
  variant?: 'default' | 'compact';
}

const ApartmentTypesDisplay: React.FC<ApartmentTypesDisplayProps> = ({ 
  apartmentTypes, 
  variant = 'default' 
}) => {
  const { formatPrice } = useCurrency();

  if (!apartmentTypes || apartmentTypes.length === 0) {
    return null;
  }

  const formatPriceFromString = (price: string) => {
    if (!price) return formatPrice(0);
    
    // Extract numeric value from string like "€147,000" or "147000"
    const numericValue = parseFloat(price.replace(/[^\d.-]/g, ''));
    return isNaN(numericValue) ? formatPrice(0) : formatPrice(numericValue);
  };

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {apartmentTypes.map((type, index) => (
          <Card key={index} className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="secondary" className="text-xs">
                  {type.bedrooms}+1 Apartment
                </Badge>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary">
                    {formatPriceFromString(type.price || type.starting_price || '0')}
                  </div>
                  <div className="text-xs text-muted-foreground">Price</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Square size={14} />
                  <span>{type.size_m2}m²</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {apartmentTypes.map((type, index) => (
        <Card key={index} className="border border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg mb-1">
                  {type.bedrooms}+1 Apartment
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Square size={16} />
                  <span>{type.size_m2}m²</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-primary">
                  {formatPriceFromString(type.price || type.starting_price || '0')}
                </div>
                <div className="text-sm text-muted-foreground">Price</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApartmentTypesDisplay;