import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GlowCard } from "@/components/ui/spotlight-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Eye } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";


interface PropertyFilterProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onSearch?: () => void;
  horizontal?: boolean;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ filters, onFilterChange, onSearch, horizontal = false }) => {
  const navigate = useNavigate();
  const { selectedCurrency } = useCurrency();
  
  // District options grouped by location
  const districtsByLocation: Record<string, Array<{value: string, label: string}>> = {
    'Antalya': [
      { value: 'dosemealti', label: 'Döşemealtı' },
      { value: 'altintas', label: 'Altintas' },
      { value: 'konyaalti', label: 'Konyaalti' },
      { value: 'muratpasa', label: 'Muratpasa' },
      { value: 'lara', label: 'Lara' },
      { value: 'belek', label: 'Belek' },
      { value: 'kemer', label: 'Kemer' },
      { value: 'kepez', label: 'Kepez' },
      { value: 'aksu', label: 'Aksu' }
    ],
    'Dubai': [
      { value: 'sports-city', label: 'Sports City' },
      { value: 'dubailand', label: 'Dubailand' },
      { value: 'jumeirah-lake-towers', label: 'Jumeirah Lake Towers' },
      { value: 'al-furjan', label: 'Al Furjan' },
      { value: 'bukadra', label: 'Bukadra' },
      { value: 'marina', label: 'Marina' },
      { value: 'motor-city', label: 'Motor City' },
      { value: 'meydan', label: 'Meydan' },
      { value: 'islands', label: 'Islands' },
      { value: 'downtown', label: 'Downtown' },
      { value: 'dubai-hills', label: 'Dubai Hills' },
      { value: 'al-safa-one', label: 'Al Safa One' },
      { value: 'al-warsan', label: 'Al Warsan' },
      { value: 'land-residence-complex', label: 'Land Residence Complex' },
      { value: 'investment-park', label: 'Investment Park' },
      { value: 'studio-city', label: 'Studio City' },
      { value: 'al-jaddaf', label: 'Al Jaddaf' },
      { value: 'dubai-south', label: 'Dubai South' },
      { value: 'jumeirah-village-circle', label: 'Jumeirah Village Circle' },
      { value: 'jumeirah-village-triangle', label: 'Jumeirah Village Triangle' },
      { value: 'al-satwa', label: 'Al Satwa' }
    ],
    'Mersin': [
      { value: 'fethiye', label: 'Fethiye' },
      { value: 'milas', label: 'Milas' }
    ]
  };
  
  // Get available districts based on selected location
  const availableDistricts = filters.location && districtsByLocation[filters.location] 
    ? districtsByLocation[filters.location]
    : [];
  
  const handleFilterUpdate = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    
    // If location changes, reset district and redirect to the appropriate page
    if (key === 'location' && typeof value === 'string' && value !== filters.location) {
      newFilters.district = ''; // Reset district when location changes
      
      const locationRoutes: Record<string, string> = {
        'Antalya': '/antalya',
        'Mersin': '/mersin',
        'Dubai': '/dubai',
        'Cyprus': '/cyprus',
        'Bali': '/bali'
      };
      
      if (locationRoutes[value]) {
        // Navigate to the new location page with the updated filters
        navigate(locationRoutes[value], { 
          state: { filters: newFilters }
        });
        return;
      }
    }
    
    // Always trigger filter change - including sortBy for immediate sorting
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      propertyType: '',
      bedrooms: '',
      location: filters.location || '', // Keep current location
      district: '',
      minPrice: '',
      maxPrice: '',
      minSquareFeet: '',
      maxSquareFeet: '',
      facilities: [],
      referenceNo: '',
      sortBy: ''
    };
    onFilterChange(resetFilters);
  };

  if (horizontal) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-11 gap-3 items-end">
            {/* Property Type */}
            <div>
              <Label htmlFor="propertyType" className="text-xs mb-1 block">Property Type</Label>
              <Select value={filters.propertyType} onValueChange={(value) => handleFilterUpdate('propertyType', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartments">Apartments</SelectItem>
                  <SelectItem value="villas">Villas</SelectItem>
                  <SelectItem value="houses">Houses</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <Label htmlFor="bedrooms" className="text-xs mb-1 block">Bedrooms</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterUpdate('bedrooms', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-xs mb-1 block">Location</Label>
              <Select value={filters.location} onValueChange={(value) => handleFilterUpdate('location', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All</SelectItem>
                   <SelectItem value="Antalya">Antalya</SelectItem>
                   <SelectItem value="Mersin">Mersin</SelectItem>
                   <SelectItem value="Dubai">Dubai</SelectItem>
                   <SelectItem value="Cyprus">Cyprus</SelectItem>
                   <SelectItem value="Bali">Bali</SelectItem>
                 </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div>
              <Label htmlFor="district" className="text-xs mb-1 block">District</Label>
              <Select 
                value={filters.district} 
                onValueChange={(value) => handleFilterUpdate('district', value)}
                disabled={availableDistricts.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={availableDistricts.length === 0 ? "Select location first" : "Select District"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map(district => (
                    <SelectItem key={district.value} value={district.value}>
                      {district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Min Price */}
            <div>
              <Label htmlFor="minPrice" className="text-xs mb-1 block">Min Price</Label>
              <Input 
                className="h-9"
                placeholder={`${selectedCurrency.symbol}0`}
                value={filters.minPrice}
                onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div>
              <Label htmlFor="maxPrice" className="text-xs mb-1 block">Max Price</Label>
              <Input 
                className="h-9"
                placeholder={`${selectedCurrency.symbol}100,000`}
                value={filters.maxPrice}
                onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
              />
            </div>

            {/* Facilities */}
            <div>
              <Label htmlFor="facilities" className="text-xs mb-1 block">Facilities</Label>
              <Select value={Array.isArray(filters.facilities) && filters.facilities.length > 0 ? "selected" : ""} onValueChange={() => {}}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    Array.isArray(filters.facilities) && filters.facilities.length > 0 
                      ? `${filters.facilities.length} selected`
                      : 'Select Facilities'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {["Swimming Pool", "Gym", "Parking", "Garden", "Balcony", "Terrace", "Elevator", "Security", "Air Conditioning"].map((facility) => (
                    <div key={facility} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent cursor-pointer" 
                         onClick={(e) => {
                           e.preventDefault();
                           const facilityKey = facility.toLowerCase().replace(" ", "-");
                           const currentFacilities = Array.isArray(filters.facilities) ? [...filters.facilities] : [];
                           
                           if (currentFacilities.includes(facilityKey)) {
                             // Remove facility
                             const index = currentFacilities.indexOf(facilityKey);
                             if (index > -1) {
                               currentFacilities.splice(index, 1);
                             }
                           } else {
                             // Add facility
                             currentFacilities.push(facilityKey);
                           }
                           
                           handleFilterUpdate('facilities', currentFacilities);
                         }}>
                      <Checkbox
                        checked={Array.isArray(filters.facilities) ? filters.facilities.includes(facility.toLowerCase().replace(" ", "-")) : false}
                        onCheckedChange={() => {}} // Handled by parent div click
                      />
                      <span className="text-sm">{facility}</span>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference Number */}
            <div>
              <Label htmlFor="referenceNo" className="text-xs mb-1 block">Reference No.</Label>
              <Input 
                placeholder="Reference"
                value={filters.referenceNo || ''}
                onChange={(e) => handleFilterUpdate('referenceNo', e.target.value)}
                className="h-9"
              />
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sortBy" className="text-xs mb-1 block">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate('sortBy', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Low to High</SelectItem>
                  <SelectItem value="price-high">High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="area-large">Area: Largest First</SelectItem>
                  <SelectItem value="area-small">Area: Smallest First</SelectItem>
                  <SelectItem value="bedrooms-most">Most Bedrooms</SelectItem>
                  <SelectItem value="bedrooms-least">Least Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <button 
                className="h-9 w-full px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center"
                onClick={onSearch}
              >
                Search
              </button>
              <button 
                className="h-9 w-full px-3 text-xs font-medium border border-input bg-muted hover:bg-muted/80 text-muted-foreground rounded-md flex items-center justify-center"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vertical layout (existing code)
  return (
    <GlowCard customSize={true} className="w-full h-auto p-0 border-0">
      <Card className="w-full h-full bg-transparent border-none shadow-none">
        <CardHeader>
          <CardTitle>Search Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Type */}
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterUpdate('propertyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartments">Apartments</SelectItem>
                <SelectItem value="villas">Villas</SelectItem>
                <SelectItem value="houses">Houses</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select value={filters.bedrooms} onValueChange={(value) => handleFilterUpdate('bedrooms', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Location */}
          <div>
            <Label htmlFor="location">Property Location</Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterUpdate('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All</SelectItem>
                 <SelectItem value="Antalya">Antalya</SelectItem>
                 <SelectItem value="Mersin">Mersin</SelectItem>
                 <SelectItem value="Dubai">Dubai</SelectItem>
                 <SelectItem value="Cyprus">Cyprus</SelectItem>
                 <SelectItem value="Bali">Bali</SelectItem>
               </SelectContent>
            </Select>
          </div>

          {/* Property District */}
          <div>
            <Label htmlFor="district">Property District</Label>
            <Select 
              value={filters.district} 
              onValueChange={(value) => handleFilterUpdate('district', value)}
              disabled={availableDistricts.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={availableDistricts.length === 0 ? "Select location first" : "Select District"} />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map(district => (
                  <SelectItem key={district.value} value={district.value}>
                    {district.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Price */}
          <div>
            <Label>Property Price</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minPrice" className="text-sm">Min Price</Label>
                <Input 
                  id="minPrice"
                  placeholder={`${selectedCurrency.symbol}0`}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-sm">Max Price</Label>
                <Input 
                  id="maxPrice"
                  placeholder={`${selectedCurrency.symbol}1,000,000`}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Square Feet */}
          <div>
            <Label>Square Feet</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minSquareFeet" className="text-sm">Min</Label>
                <Input 
                  id="minSquareFeet"
                  placeholder="0"
                  value={filters.minSquareFeet}
                  onChange={(e) => handleFilterUpdate('minSquareFeet', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxSquareFeet" className="text-sm">Max</Label>
                <Input 
                  id="maxSquareFeet"
                  placeholder="1000"
                  value={filters.maxSquareFeet}
                  onChange={(e) => handleFilterUpdate('maxSquareFeet', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <Label htmlFor="facilities">Facilities</Label>
            <div className="space-y-2 mt-2">
              {["Swimming Pool", "Gym", "Parking", "Garden", "Balcony", "Terrace", "Elevator", "Security", "Air Conditioning"].map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vertical-${facility.toLowerCase().replace(" ", "-")}`}
                    checked={Array.isArray(filters.facilities) ? filters.facilities.includes(facility.toLowerCase().replace(" ", "-")) : false}
                    onCheckedChange={(checked) => {
                      const facilityKey = facility.toLowerCase().replace(" ", "-");
                      const currentFacilities = Array.isArray(filters.facilities) ? [...filters.facilities] : [];
                      
                      if (checked) {
                        // Add facility if not already present
                        if (!currentFacilities.includes(facilityKey)) {
                          currentFacilities.push(facilityKey);
                        }
                      } else {
                        // Remove facility
                        const index = currentFacilities.indexOf(facilityKey);
                        if (index > -1) {
                          currentFacilities.splice(index, 1);
                        }
                      }
                      
                      handleFilterUpdate('facilities', currentFacilities);
                    }}
                  />
                  <Label htmlFor={`vertical-${facility.toLowerCase().replace(" ", "-")}`} className="text-sm">
                    {facility}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Number */}
          <div>
            <Label htmlFor="referenceNo">Reference Number</Label>
            <Input 
              id="referenceNo"
              placeholder="Enter reference number..."
              value={filters.referenceNo || ''}
              onChange={(e) => handleFilterUpdate('referenceNo', e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ref">Reference No.</SelectItem>
                  <SelectItem value="price-low">Low to High</SelectItem>
                  <SelectItem value="price-high">High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="area-large">Area: Largest First</SelectItem>
                  <SelectItem value="area-small">Area: Smallest First</SelectItem>
                  <SelectItem value="bedrooms-most">Most Bedrooms</SelectItem>
                  <SelectItem value="bedrooms-least">Least Bedrooms</SelectItem>
                </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="space-y-3">
            <Button className="w-full" onClick={onSearch}>
              Search
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </GlowCard>
  );
};

export default PropertyFilter;