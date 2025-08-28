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
  
  const handleFilterUpdate = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    
    // If location changes, redirect to the appropriate page
    if (key === 'location' && typeof value === 'string' && value !== filters.location) {
      const locationRoutes: Record<string, string> = {
        'Antalya': '/antalya',
        'Mersin': '/mersin',
        'Dubai': '/dubai',
        'Cyprus': '/cyprus'
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

  if (horizontal) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-3 items-end">
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
            <div>
              <button 
                className="h-9 w-full px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center"
                onClick={onSearch}
              >
                Search
              </button>
            </div>

            {/* AI Search Button */}
            <div>
              <button 
                className="h-9 w-full px-2 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1"
                onClick={() => navigate('/ai-property-search')}
              >
                <Eye className="w-3 h-3" />
                <span>AI Search</span>
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
               </SelectContent>
            </Select>
          </div>

          {/* Property District */}
          <div>
            <Label htmlFor="district">Property District</Label>
            <Select value={filters.district} onValueChange={(value) => handleFilterUpdate('district', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fethiye">Fethiye</SelectItem>
                <SelectItem value="milas">Milas</SelectItem>
                <SelectItem value="belek">Belek</SelectItem>
                <SelectItem value="kepez">Kepez</SelectItem>
                <SelectItem value="altintas">Altintas</SelectItem>
                <SelectItem value="konyaalti">Konyaalti</SelectItem>
                <SelectItem value="muratpasa">Muratpasa</SelectItem>
                <SelectItem value="aksu">Aksu</SelectItem>
                <SelectItem value="dosemealti">Döşemealtı</SelectItem>
                <SelectItem value="sports-city">Sports City</SelectItem>
                <SelectItem value="dubailand">Dubailand</SelectItem>
                <SelectItem value="jumeirah-lake-towers">Jumeirah Lake Towers</SelectItem>
                <SelectItem value="al-furjan">Al Furjan</SelectItem>
                <SelectItem value="bukadra">Bukadra</SelectItem>
                <SelectItem value="marina">Marina</SelectItem>
                <SelectItem value="motor-city">Motor City</SelectItem>
                <SelectItem value="meydan">Meydan</SelectItem>
                <SelectItem value="islands">Islands</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="dubai-hills">Dubai Hills</SelectItem>
                <SelectItem value="al-safa-one">Al Safa One</SelectItem>
                <SelectItem value="al-warsan">Al Warsan</SelectItem>
                <SelectItem value="land-residence-complex">Land Residence Complex</SelectItem>
                <SelectItem value="investment-park">Investment Park</SelectItem>
                <SelectItem value="studio-city">Studio City</SelectItem>
                <SelectItem value="al-jaddaf">Al Jaddaf</SelectItem>
                <SelectItem value="dubai-south">Dubai South</SelectItem>
                <SelectItem value="jumeirah-village-circle">Jumeirah Village Circle</SelectItem>
                <SelectItem value="jumeirah-village-triangle">Jumeirah Village Triangle</SelectItem>
                <SelectItem value="al-satwa">Al Satwa</SelectItem>
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
          <Button className="w-full" onClick={onSearch}>
            Search
          </Button>
        </CardContent>
      </Card>
    </GlowCard>
  );
};

export default PropertyFilter;