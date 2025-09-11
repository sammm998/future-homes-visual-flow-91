import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface PropertyFiltersProps {
  locations: string[];
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  locations,
  selectedLocation,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filter Properties:</span>
      </div>
      
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={onPriceRangeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="0-250000">Under €250,000</SelectItem>
          <SelectItem value="250000-500000">€250,000 - €500,000</SelectItem>
          <SelectItem value="500000-1000000">€500,000 - €1,000,000</SelectItem>
          <SelectItem value="1000000+">Over €1,000,000</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="w-3 h-3" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default PropertyFilters;