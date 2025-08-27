import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useCurrency } from '@/contexts/CurrencyContext';
import { ApartmentType } from '@/utils/apartmentTypes';

interface ApartmentTypesDisplayProps {
  apartmentTypes: ApartmentType[];
  variant?: 'compact' | 'full';
  className?: string;
}

const ApartmentTypesDisplay: React.FC<ApartmentTypesDisplayProps> = ({ 
  apartmentTypes, 
  variant = 'compact',
  className = '' 
}) => {
  const { formatPrice } = useCurrency();

  if (!apartmentTypes || apartmentTypes.length === 0) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {apartmentTypes.slice(0, 3).map((apt, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {apt.type}
          </Badge>
        ))}
        {apartmentTypes.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{apartmentTypes.length - 3}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="font-semibold text-foreground">Available Apartment Types</h4>
      <div className="grid gap-3">
        {apartmentTypes.map((apt, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border">
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{apt.type}</span>
              <span className="text-sm text-muted-foreground">{apt.size}</span>
            </div>
            <div className="font-bold text-primary">
              {apt.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentTypesDisplay;