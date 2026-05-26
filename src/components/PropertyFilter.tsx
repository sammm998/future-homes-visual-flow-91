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
import { useDistrictsByLocation } from "@/hooks/useDistrictsByLocation";
import { useTranslation } from "@/hooks/useTranslation";


interface PropertyFilterProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onSearch?: () => void;
  horizontal?: boolean;
}

const LOCATION_OPTIONS = ['all', 'Antalya', 'Istanbul', 'Mersin', 'Dubai', 'Cyprus', 'Bali'] as const;

const PropertyFilter: React.FC<PropertyFilterProps> = ({ filters, onFilterChange, onSearch, horizontal = false }) => {
  const navigate = useNavigate();
  const { selectedCurrency } = useCurrency();
  const { t, lang } = useTranslation();
  const facilityOptions = [
    { value: 'swimming-pool', label: t('search.pool') },
    { value: 'gym', label: t('search.gym') },
    { value: 'parking', label: t('search.parking') },
    { value: 'garden', label: t('search.garden') },
    { value: 'balcony', label: t('wizard.balcony') },
    { value: 'terrace', label: t('filter.terrace') },
    { value: 'elevator', label: t('filter.elevator') },
    { value: 'security', label: t('search.security') },
    { value: 'air-conditioning', label: t('filter.air_conditioning') },
  ];
  
  // District options grouped by location — derived from actual property data
  const { districtsByLocation } = useDistrictsByLocation();

  // Get available districts based on selected location
  const availableDistricts =
    filters.location && districtsByLocation[filters.location]
      ? districtsByLocation[filters.location]
      : [];
  
  const handleFilterUpdate = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    
    // If location changes, reset district and redirect to the appropriate page (ONLY if not on map-search)
    if (key === 'location' && typeof value === 'string' && value !== filters.location) {
      newFilters.district = ''; // Reset district when location changes
      
      // Check if we're on the map-search page - if so, don't navigate
      const isMapSearch = window.location.pathname === '/map-search';
      
      if (!isMapSearch) {
        const locationRoutes: Record<string, string> = {
          'Antalya': '/antalya',
          'Istanbul': '/istanbul',
          'Mersin': '/mersin',
          'Dubai': '/dubai',
          'Cyprus': '/cyprus',
          'Bali': '/bali'
        };
        
        if (locationRoutes[value]) {
          // Build URL with filters as query parameters
          const params = new URLSearchParams();
          Object.entries(newFilters).forEach(([key, val]) => {
            if (val && val !== '' && key !== 'location') {
              if (Array.isArray(val) && val.length > 0) {
                params.set(key, val.join(','));
              } else if (typeof val === 'string' && val !== '') {
                params.set(key, val);
              }
            }
          });
          
          if (lang && lang !== 'en') params.set('lang', lang);
          const queryString = params.toString();
          const targetUrl = `${locationRoutes[value]}${queryString ? '?' + queryString : ''}`;
          
          // Navigate to the new location page with filters in both URL and state
          navigate(targetUrl, { 
            state: { filters: newFilters }
          });
          return;
        }
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
              <Label htmlFor="propertyType" className="text-xs mb-1 block">{t('search.property_type')}</Label>
              <Select value={filters.propertyType} onValueChange={(value) => handleFilterUpdate('propertyType', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('filter.any_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartments">{t('search.apartments')}</SelectItem>
                  <SelectItem value="villas">{t('search.villas')}</SelectItem>
                  <SelectItem value="houses">{t('search.houses')}</SelectItem>
                  <SelectItem value="commercial">{t('search.commercial')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <Label htmlFor="bedrooms" className="text-xs mb-1 block">{t('search.bedrooms')}</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterUpdate('bedrooms', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('filter.any')} />
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
              <Label htmlFor="location" className="text-xs mb-1 block">{t('search.location')}</Label>
              <Select value={filters.location} onValueChange={(value) => handleFilterUpdate('location', value)}>
                <SelectTrigger className="h-9 notranslate">
                  <SelectValue placeholder={t('filter.select_location')} />
                </SelectTrigger>
                 <SelectContent className="notranslate">
                   {LOCATION_OPTIONS.map((option) => (
                     <SelectItem key={option} value={option} className="notranslate">
                        <span className="notranslate" translate="no">{option === 'all' ? t('info.all') : option}</span>
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div>
              <Label htmlFor="district" className="text-xs mb-1 block">{t('filter.district')}</Label>
              <Select 
                value={filters.district} 
                onValueChange={(value) => handleFilterUpdate('district', value)}
                disabled={availableDistricts.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={availableDistricts.length === 0 ? t('filter.select_location_first') : t('filter.select_district')} />
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
              <Label htmlFor="minPrice" className="text-xs mb-1 block">{t('search.min_price')}</Label>
              <Input 
                className="h-9"
                placeholder={`${selectedCurrency.symbol}0`}
                value={filters.minPrice}
                onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div>
              <Label htmlFor="maxPrice" className="text-xs mb-1 block">{t('search.max_price')}</Label>
              <Input 
                className="h-9"
                placeholder={`${selectedCurrency.symbol}100,000`}
                value={filters.maxPrice}
                onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
              />
            </div>

            {/* Facilities */}
            <div>
              <Label htmlFor="facilities" className="text-xs mb-1 block">{t('search.facilities')}</Label>
              <Select value={Array.isArray(filters.facilities) && filters.facilities.length > 0 ? "selected" : ""} onValueChange={() => {}}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    Array.isArray(filters.facilities) && filters.facilities.length > 0 
                      ? `${filters.facilities.length} ${t('filter.selected')}`
                      : t('filter.select_facilities')
                  } />
                </SelectTrigger>
                <SelectContent>
                  {facilityOptions.map((facility) => (
                    <div key={facility.value} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent cursor-pointer" 
                         onClick={(e) => {
                           e.preventDefault();
                           const facilityKey = facility.value;
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
                        checked={Array.isArray(filters.facilities) ? filters.facilities.includes(facility.value) : false}
                        onCheckedChange={() => {}} // Handled by parent div click
                      />
                      <span className="text-sm">{facility.label}</span>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference Number */}
            <div>
              <Label htmlFor="referenceNo" className="text-xs mb-1 block">{t('search.ref_no')}</Label>
              <Input 
                placeholder={t('filter.reference')}
                value={filters.referenceNo || ''}
                onChange={(e) => handleFilterUpdate('referenceNo', e.target.value)}
                className="h-9"
              />
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sortBy" className="text-xs mb-1 block">{t('search.sort_by')}</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate('sortBy', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('search.sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">{t('search.price_low')}</SelectItem>
                  <SelectItem value="price-high">{t('search.price_high')}</SelectItem>
                  <SelectItem value="newest">{t('search.newest')}</SelectItem>
                  <SelectItem value="oldest">{t('search.oldest')}</SelectItem>
                  <SelectItem value="area-large">{t('search.area_largest')}</SelectItem>
                  <SelectItem value="area-small">{t('search.area_smallest')}</SelectItem>
                  <SelectItem value="bedrooms-most">{t('search.most_bedrooms')}</SelectItem>
                  <SelectItem value="bedrooms-least">{t('search.least_bedrooms')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <button 
                className="h-9 w-full px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center"
                onClick={onSearch}
              >
                {t('search.search')}
              </button>
              <button 
                className="h-9 w-full px-3 text-xs font-medium border border-input bg-muted hover:bg-muted/80 text-muted-foreground rounded-md flex items-center justify-center"
                onClick={handleReset}
              >
                {t('filter.reset')}
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
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('nav.search')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Property Type */}
          <div>
            <Label htmlFor="propertyType" className="text-xs">{t('search.property_type')}</Label>
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterUpdate('propertyType', value)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={t('filter.any_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartments">{t('search.apartments')}</SelectItem>
                <SelectItem value="villas">{t('search.villas')}</SelectItem>
                <SelectItem value="houses">{t('search.houses')}</SelectItem>
                <SelectItem value="commercial">{t('search.commercial')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div>
            <Label htmlFor="bedrooms" className="text-xs">Bedrooms</Label>
            <Select value={filters.bedrooms} onValueChange={(value) => handleFilterUpdate('bedrooms', value)}>
              <SelectTrigger className="h-9 text-xs">
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
            <Label htmlFor="location" className="text-xs">Location</Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterUpdate('location', value)}>
              <SelectTrigger className="h-9 text-xs notranslate">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
               <SelectContent className="notranslate">
                 {LOCATION_OPTIONS.map((option) => (
                   <SelectItem key={option} value={option} className="notranslate">
                     <span className="notranslate" translate="no">{option === 'all' ? 'All' : option}</span>
                   </SelectItem>
                 ))}
               </SelectContent>
            </Select>
          </div>

          {/* Property District */}
          <div>
            <Label htmlFor="district" className="text-xs">District</Label>
            <Select 
              value={filters.district} 
              onValueChange={(value) => handleFilterUpdate('district', value)}
              disabled={availableDistricts.length === 0}
            >
              <SelectTrigger className="h-9 text-xs">
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
            <Label className="text-xs">Price</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input 
                  id="minPrice"
                  placeholder={`Min ${selectedCurrency.symbol}`}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <Input 
                  id="maxPrice"
                  placeholder={`Max ${selectedCurrency.symbol}`}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <Label htmlFor="facilities" className="text-xs">Facilities</Label>
            <div className="space-y-1.5 mt-1.5">
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
                    className="h-3.5 w-3.5"
                  />
                  <Label htmlFor={`vertical-${facility.toLowerCase().replace(" ", "-")}`} className="text-xs font-normal cursor-pointer">
                    {facility}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Number */}
          <div>
            <Label htmlFor="referenceNo" className="text-xs">Reference Number</Label>
            <Input 
              id="referenceNo"
              placeholder="Enter ref no..."
              value={filters.referenceNo || ''}
              onChange={(e) => handleFilterUpdate('referenceNo', e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Sort By */}
          <div>
            <Label htmlFor="sortBy" className="text-xs">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate('sortBy', value)}>
              <SelectTrigger className="h-9 text-xs">
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
          <div className="space-y-2 pt-2">
            <Button className="w-full h-9 text-xs" onClick={onSearch}>
              Search
            </Button>
            <Button variant="secondary" className="w-full h-9 text-xs" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </GlowCard>
  );
};

export default PropertyFilter;